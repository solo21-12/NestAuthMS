import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { AuthServiceService } from './auth-service.service';
import { AuthRto, SignInDto, SignUpDto } from '@app/contracts';
import { JwtAuthGuard } from 'libs/guards';
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
  @ApiResponse({ status: 200, description: 'User logged out successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(@Headers('authorization') authHeader: string) {
    const accessToken = this.extractTokenFromHeader(authHeader);
    if (!accessToken) {
      throw new Error('Access token is missing');
    }

    return await this.authServiceService.signOut(accessToken);
  }
}
