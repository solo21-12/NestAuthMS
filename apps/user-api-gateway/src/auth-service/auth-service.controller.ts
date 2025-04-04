import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Headers,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthServiceService } from './auth-service.service';
import {
  AuthRto,
  RefreshTokenRequestDto,
  SignInDto,
  SignUpDto,
} from '@app/contracts';
import { JwtAuthGuard } from 'libs/guards';
import { ERROR_MESSAGES } from 'libs/constants';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Authentication')
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
  @ApiOperation({ summary: 'User Registration' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: AuthRto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Body(new ValidationPipe()) signUpDto: SignUpDto) {
    return this.authServiceService.signUp(signUpDto);
  }

  @Post('sign-in')
  @ApiOperation({ summary: 'User Login' })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    type: AuthRto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Body(new ValidationPipe()) signInDto: SignInDto) {
    return this.authServiceService.signIn(signInDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('sign-out')
  @ApiOperation({ summary: 'User Logout' })
  @ApiResponse({
    status: 200,
    description: 'User logged out successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(@Headers('authorization') authHeader: string) {
    const accessToken = this.extractTokenFromHeader(authHeader);
    if (!accessToken) {
      throw new UnauthorizedException(ERROR_MESSAGES.TOKEN_MISSING);
    }

    return await this.authServiceService.signOut(accessToken);
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'User refresh token' })
  @ApiResponse({
    status: 200,
    description: 'User refresh token successfully',
    type: AuthRto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async refreshToken(
    @Headers('authorization') authHeader: string,
    @Body()
    { refresh_token }: RefreshTokenRequestDto,
  ) {
    const accessToken = this.extractTokenFromHeader(authHeader);

    if (!accessToken) {
      throw new UnauthorizedException(ERROR_MESSAGES.TOKEN_MISSING);
    }

    return await this.authServiceService.refreshToken({
      accessToken,
      refreshToken: refresh_token,
    });
  }
}
