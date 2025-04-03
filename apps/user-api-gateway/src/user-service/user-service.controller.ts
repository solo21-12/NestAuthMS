import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserServiceService } from './user-service.service';
import { CreateUserDto } from '@app/contracts';
import { JwtAuthGuard } from 'libs/guards/src/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserServiceController {
  constructor(private readonly userService: UserServiceService) {}

  @Post()
  create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
  ) {
    return this.userService.update(id, createUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
