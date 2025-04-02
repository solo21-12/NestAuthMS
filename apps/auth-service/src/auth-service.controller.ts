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

  // @MessagePattern(AUTH_SERVICES_PATTERNS.FIND_ALL)
  // findAll() {
  //   return this.authServiceService.findAll();
  // }

  // @MessagePattern(AUTH_SERVICES_PATTERNS.FIND_ONE)
  // findOne(@Payload() id: number) {
  //   return this.authServiceService.findOne(id);
  // }

  // @MessagePattern(AUTH_SERVICES_PATTERNS.UPDATE)
  // update(@Payload() SignInDto: SignInDto) {
  //   return this.authServiceService.update(
  //     SignInDto.id,
  //     SignInDto,
  //   );
  // }

  // @MessagePattern(AUTH_SERVICES_PATTERNS.REMOVE)
  // delete(@Payload() id: number) {
  //   return this.authServiceService.delete(id);
  // }
}
