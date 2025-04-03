import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { AuthServiceService } from './auth-service.service';
import { SignInDto, SignUpDto } from '@app/contracts';
import { JwtAuthGuard } from 'libs/guards';

@Controller('auth')
export class AuthServiceController {
  constructor(private readonly authServiceService: AuthServiceService) {}

  private extractTokenFromHeader(authHeader: string): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.split(' ')[1];
  }

  @Post('sign-up')
  create(@Body(new ValidationPipe()) signUpDto: SignUpDto) {
    return this.authServiceService.signUp(signUpDto);
  }
  @Post('sign-in')
  login(@Body(new ValidationPipe()) signInDto: SignInDto) {
    return this.authServiceService.signIn(signInDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('sign-out')
  async logout(@Headers('authorization') authHeader: string) {
    const accessToken = this.extractTokenFromHeader(authHeader);
    if (!accessToken) {
      throw new Error('Access token is missing');
    }

    return await this.authServiceService.signOut(accessToken);
  }

  @Post('refresh-token')
  async refreshToken(
    @Headers('authorization') authHeader: string,
    @Body()
    {
      refresh_token,
    }: {
      refresh_token: string;
    },
  ) {
    const accessToken = this.extractTokenFromHeader(authHeader);

    if (!accessToken) {
      throw new Error('Access token is missing');
    }

    return await this.authServiceService.refreshToken({
      accessToken,
      refreshToken: refresh_token,
    });
  }
}
