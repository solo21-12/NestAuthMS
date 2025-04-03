import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthServiceService } from './auth-service.service';
import { SignUpDto, SignInDto, AUTH_SERVICES_PATTERNS } from '@app/contracts';

@Controller()
export class AuthServiceController {
  constructor(private readonly authServiceService: AuthServiceService) {}

  @MessagePattern(AUTH_SERVICES_PATTERNS.SIGNUP)
  create(@Payload() signUpDto: SignUpDto) {
    return this.authServiceService.signUp(signUpDto);
  }

  @MessagePattern(AUTH_SERVICES_PATTERNS.SIGNIN)
  login(@Payload() signInDto: SignInDto) {
    return this.authServiceService.signIn(signInDto);
  }

  @MessagePattern(AUTH_SERVICES_PATTERNS.SIGNOUT)
  logout(@Payload() refreshToken: string) {
    return this.authServiceService.signOut(refreshToken);
  }
}
