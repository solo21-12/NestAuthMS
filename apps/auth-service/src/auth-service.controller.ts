import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthServiceService } from './auth-service.service';
import {
  CreateAuthServiceDto,
  UpdateAuthServiceDto,
  AUTH_SERVICES_PATTERNS,
} from '@app/contracts';

@Controller()
export class AuthServiceController {
  constructor(private readonly authServiceService: AuthServiceService) {}

  @MessagePattern(AUTH_SERVICES_PATTERNS.CREATE)
  create(@Payload() createAuthServiceDto: CreateAuthServiceDto) {
    return this.authServiceService.create(createAuthServiceDto);
  }

  @MessagePattern(AUTH_SERVICES_PATTERNS.FIND_ALL)
  findAll() {
    return this.authServiceService.findAll();
  }

  @MessagePattern(AUTH_SERVICES_PATTERNS.FIND_ONE)
  findOne(@Payload() id: number) {
    return this.authServiceService.findOne(id);
  }

  @MessagePattern(AUTH_SERVICES_PATTERNS.UPDATE)
  update(@Payload() updateAuthServiceDto: UpdateAuthServiceDto) {
    return this.authServiceService.update(
      updateAuthServiceDto.id,
      updateAuthServiceDto,
    );
  }

  @MessagePattern(AUTH_SERVICES_PATTERNS.REMOVE)
  delete(@Payload() id: number) {
    return this.authServiceService.delete(id);
  }
}
