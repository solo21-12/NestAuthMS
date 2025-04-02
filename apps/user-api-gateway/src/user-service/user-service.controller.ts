import { Controller, Get } from '@nestjs/common';
import { UserServiceService } from './user-service.service';

@Controller('users')
export class UserServiceController {
  constructor(private readonly userService: UserServiceService) {}
  @Get()
  findAll() {
    return this.userService.findAll();
  }
}
