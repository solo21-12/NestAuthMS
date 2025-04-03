import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICES_PATTERNS, SignInDto, SignUpDto } from '@app/contracts';
import { AUTH_SERVICES_CONSTANTS } from 'libs/constants';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthServiceService {
  constructor(
    @Inject(AUTH_SERVICES_CONSTANTS.NAME)
    private readonly authServiceClient: ClientProxy,
  ) {}

  async signUp(SignUpDto: SignUpDto) {
    try {
      const response$ = this.authServiceClient.send(
        AUTH_SERVICES_PATTERNS.SIGNUP,
        SignUpDto,
      );

      return await lastValueFrom(response$).catch((error) => {
        console.error('API Gateway Sign-up Error:', error);

        // Ensure we return an HTTP-friendly error message
        throw new BadRequestException(error.message || 'Sign-up failed');
      });
    } catch (error) {
      console.error('API Gateway Sign-up Error:', error);
      throw new BadRequestException(error.message || 'Sign-up failed');
    }
  }

  async signIn(SignInDto: SignInDto) {
    try {
      const response$ = this.authServiceClient.send(
        AUTH_SERVICES_PATTERNS.SIGNIN,
        SignInDto,
      );

      return await lastValueFrom(response$).catch((error) => {
        console.error('API Gateway Sign-in Error:', error);

        throw new BadRequestException(error.message || 'Sign-in failed');
      });
    } catch (error) {
      console.error('API Gateway Sign-in Error:', error);
      throw new BadRequestException(error.message || 'Sign-in failed');
    }
  }

  async signOut(accessToken: string) {
    try {
      const response = await lastValueFrom(
        this.authServiceClient.send(
          AUTH_SERVICES_PATTERNS.SIGNOUT,
          accessToken,
        ),
      );
      return response;
    } catch (error) {
      console.error('API Gateway Sign-out Error:', error);
      throw new BadRequestException(error.message || 'Sign-out failed');
    }
  }
}
