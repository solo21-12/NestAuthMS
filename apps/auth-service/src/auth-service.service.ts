import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import {
  SignInDto,
  SignUpDto,
  AuthRto,
  USER_SERVICES_PATTERNS,
} from '@app/contracts';
import { ERROR_MESSAGES, USER_SERVICE_CONSTANTS } from 'libs/constants';
import {
  AuthJwtService,
  PasswordHashService,
  RedisService,
} from 'libs/services';

@Injectable()
export class AuthServiceService {
  constructor(
    @Inject(USER_SERVICE_CONSTANTS.NAME)
    private readonly userClient: ClientProxy,
    private readonly passwordHashService: PasswordHashService,
    private readonly authJwtService: AuthJwtService,
    private readonly redisService: RedisService,
  ) {}

  private async getUser(email: string) {
    try {
      const existingUser$ = this.userClient.send(
        USER_SERVICES_PATTERNS.FIND_BY_EMAIL,
        email,
      );
      const existingUser = await lastValueFrom(existingUser$);

      return existingUser || null;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new RpcException({
        statusCode: 500,
        message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }

  private async generateTokens(userId: string, role: string): Promise<AuthRto> {
    try {
      const { access_token } = await this.authJwtService.generateAccessToken(
        userId,
        role,
      );

      const { refresh_token } = await this.authJwtService.generateRefreshToken(
        userId,
      );
      return { access_token, refresh_token };
    } catch (error) {
      console.error('Error generating tokens:', error);
      throw new RpcException({
        statusCode: 500,
        message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }

  private async checkUserExists(email: string): Promise<boolean> {
    try {
      const existingUser = await this.getUser(email);
      return existingUser !== null;
    } catch (error) {
      console.error('Error checking user existence:', error);
      throw new RpcException({
        statusCode: 500,
        message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }

  private async storeTokensInRedis(
    userId: string,
    accessToken: string,
    refreshToken: string,
  ): Promise<void> {
    try {
      await this.redisService.setKey(
        userId + ':access_token',
        accessToken,
        15 * 60,
      );
      await this.redisService.setKey(
        userId + ':refresh_token',
        refreshToken,
        7 * 24 * 60 * 60,
      );
    } catch (error) {
      console.error('Error storing tokens in Redis:', error);
      throw new RpcException({
        statusCode: 500,
        message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }

  private async validateToken(
    userId: string,
    refreshToken: string,
    access_token: string,
  ) {
    const storedRefreshToken = await this.redisService.getKey(
      userId + ':refresh_token',
    );

    const storedAccessToken = await this.redisService.getKey(
      userId + ':access_token',
    );
    if (refreshToken !== storedRefreshToken) {
      throw new RpcException({
        statusCode: 400,
        message: ERROR_MESSAGES.INVALID_TOKEN,
      });
    }

    if (access_token !== storedAccessToken) {
      throw new RpcException({
        statusCode: 400,
        message: ERROR_MESSAGES.INVALID_TOKEN,
      });
    }
  }

  async signUp(signUpDto: SignUpDto): Promise<AuthRto> {
    try {
      if (await this.checkUserExists(signUpDto.email)) {
        throw new RpcException({
          statusCode: 400,
          message: ERROR_MESSAGES.USER_ALREADY_EXISTS,
        });
      }

      const hashedPassword = await this.passwordHashService.hashPassword(
        signUpDto.password,
      );

      const createdUser$ = this.userClient.send(USER_SERVICES_PATTERNS.CREATE, {
        ...signUpDto,
        password: hashedPassword,
      });

      const createdUser = await lastValueFrom(createdUser$);

      if (!createdUser || !createdUser.id || !createdUser.role) {
        throw new RpcException({
          statusCode: 500,
          message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
      }

      const { access_token, refresh_token } = await this.generateTokens(
        createdUser.id,
        createdUser.role,
      );

      await this.storeTokensInRedis(
        createdUser.id,
        access_token,
        refresh_token,
      );

      return {
        access_token,
        refresh_token,
      };
    } catch (error) {
      console.error('Sign-up error:', error);
      throw new RpcException({
        statusCode: error?.statusCode || 400,
        message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async signIn(signInDto: SignInDto): Promise<AuthRto> {
    const existUser = await this.getUser(signInDto.email);

    if (!existUser) {
      throw new RpcException({
        statusCode: 400,
        message: ERROR_MESSAGES.INVALID_CREDENTIALS,
      });
    }

    const isPasswordValid = await this.passwordHashService.comparePassword(
      signInDto.password,
      existUser.password,
    );

    if (!isPasswordValid) {
      throw new RpcException({
        statusCode: 400,
        message: ERROR_MESSAGES.INVALID_CREDENTIALS,
      });
    }
    const { access_token, refresh_token } = await this.generateTokens(
      existUser.id,
      existUser.role,
    );

    await this.redisService.setKey(
      existUser.id + ':access_token',
      access_token,
      15 * 60,
    );

    await this.redisService.setKey(
      existUser.id + ':refresh_token',
      refresh_token,
      7 * 24 * 60 * 60,
    );
    return {
      access_token,
      refresh_token,
    };
  }

  async signOut(accessToken: string): Promise<{ message: string }> {
    try {
      const decodedToken: any = await this.authJwtService.decodeToken(
        accessToken,
      );

      if (!decodedToken) {
        throw new RpcException({
          statusCode: 400,
          message: ERROR_MESSAGES.INVALID_TOKEN,
        });
      }

      const userId = decodedToken.sub;

      // Remove the access and refresh tokens from Redis
      await this.redisService.deleteKey(userId + ':access_token');
      await this.redisService.deleteKey(userId + ':refresh_token');

      return { message: 'Sign-out successful' };
    } catch (error) {
      console.error('Sign-out error:', error);

      throw new RpcException({
        statusCode: 400,
        message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async refreshToken(
    refreshToken: string,
    access_token: string,
  ): Promise<AuthRto> {
    try {
      const decodedToken: any = await this.authJwtService.decodeToken(
        refreshToken,
      );

      if (!decodedToken) {
        throw new RpcException({
          statusCode: 400,
          message: ERROR_MESSAGES.INVALID_TOKEN,
        });
      }

      const userId = decodedToken.sub;

      // Validate the refresh token and access token
      await this.validateToken(userId, refreshToken, access_token);

      const { access_token: newAccessToken, refresh_token: newRefreshToken } =
        await this.generateTokens(userId, decodedToken.role);

      // Store the new tokens in Redis
      await this.storeTokensInRedis(userId, newAccessToken, newRefreshToken);
      return { access_token: newAccessToken, refresh_token: newRefreshToken };
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw new RpcException({
        statusCode: 400,
        message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
