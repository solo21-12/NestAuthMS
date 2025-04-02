import { Controller } from '@nestjs/common';
import { UserServiceService } from './user-service.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CreateUserDto,
  UpdateUserDto,
  USER_SERVICES_PATTERNS,
  UserDto,
} from '@app/contracts';

@Controller()
export class UserServiceController {
  constructor(private readonly userServiceService: UserServiceService) {}

  @MessagePattern(USER_SERVICES_PATTERNS.FIND_ALL)
  findAll() {
    return this.userServiceService.findAll();
  }

  @MessagePattern(USER_SERVICES_PATTERNS.CREATE)
  create(@Payload() createUserDto: CreateUserDto): Promise<UserDto> {
    return this.userServiceService.create(createUserDto);
  }

  @MessagePattern(USER_SERVICES_PATTERNS.FIND_ONE)
  findOne(@Payload() id: string) {
    return this.userServiceService.findById(id);
  }

  @MessagePattern(USER_SERVICES_PATTERNS.UPDATE)
  update(@Payload() updateAuthServiceDto: UpdateUserDto, id: string) {
    return this.userServiceService.update(id, updateAuthServiceDto);
  }

  @MessagePattern(USER_SERVICES_PATTERNS.REMOVE)
  delete(@Payload() id: string) {
    return this.userServiceService.delete(id);
  }

  @MessagePattern(USER_SERVICES_PATTERNS.FIND_BY_EMAIL)
  findByEmail(@Payload() email: string) {
    return this.userServiceService.findByEmail(email);
  }
}
