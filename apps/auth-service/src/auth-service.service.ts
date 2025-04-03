import { AuthJwtService } from './jwt.service';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { PasswordHashService } from './password-hash.service';
import {
  SignInDto,
  SignUpDto,
  AuthRto,
  USER_SERVICES_PATTERNS,
} from '@app/contracts';
import { USER_SERVICE_CONSTANTS } from 'libs/constants';

@Injectable()
export class AuthServiceService {
  constructor(
    @Inject(USER_SERVICE_CONSTANTS.NAME)
    private readonly userClient: ClientProxy,
    private readonly passwordHashService: PasswordHashService,
    private readonly authJwtService: AuthJwtService,
  ) {}

  private async getUser(email: string) {
    try {
      const existingUser$ = this.userClient.send(
        USER_SERVICES_PATTERNS.FIND_BY_EMAIL,
        email,
      );
      const existingUser = await lastValueFrom(existingUser$);

      return existingUser || null; // ✅ Explicitly return null if not found
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new RpcException({
        statusCode: 500,
        message: 'Internal server error while fetching user',
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
        message: 'Failed to generate tokens',
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
        message: 'Failed to check user existence',
      });
    }
  }

  async signUp(signUpDto: SignUpDto): Promise<AuthRto> {
    try {
      if (await this.checkUserExists(signUpDto.email)) {
        throw new RpcException({
          statusCode: 400,
          message: 'User already exists',
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
          message: 'User creation failed: Invalid response from user service',
        });
      }

      const { access_token, refresh_token } = await this.generateTokens(
        createdUser.id,
        createdUser.role,
      );

      return {
        access_token,
        refresh_token,
      };
    } catch (error) {
      console.error('Sign-up error:', error);
      throw new RpcException({
        statusCode: error?.statusCode || 400,
        message: error?.message || 'Failed to sign up',
      });
    }
  }

  async signIn(signInDto: SignInDto): Promise<AuthRto> {
    const existUser = await this.getUser(signInDto.email);

    if (!existUser) {
      throw new RpcException({
        statusCode: 400,
        message: 'Invalid credentials',
      });
    }

    const isPasswordValid = await this.passwordHashService.comparePassword(
      signInDto.password,
      existUser.password,
    );

    if (!isPasswordValid) {
      throw new RpcException({
        statusCode: 400,
        message: 'Invalid credentials',
      });
    }
    const { access_token, refresh_token } = await this.generateTokens(
      existUser.id,
      existUser.role,
    );
    return {
      access_token,
      refresh_token,
    };
  }
}
