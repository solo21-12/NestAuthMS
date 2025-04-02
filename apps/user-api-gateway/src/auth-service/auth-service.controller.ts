import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthServiceService } from './auth-service.service';
import { SignInDto, SignUpDto } from '@app/contracts';

@Controller('auth')
export class AuthServiceController {
  constructor(private readonly authServiceService: AuthServiceService) {}

  @Post('sign-up')
  create(@Body(new ValidationPipe()) signUpDto: SignUpDto) {
    return this.authServiceService.signUp(signUpDto);
  }
  @Post('login')
  login(@Body(new ValidationPipe()) signInDto: SignInDto) {
    return this.authServiceService.signIn(signInDto);
  }
}
