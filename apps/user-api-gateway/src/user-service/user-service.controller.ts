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
import { AdminGuard, JwtAuthGuard } from 'libs/guards';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserServiceController {
  constructor(private readonly userService: UserServiceService) {}

  @UseGuards(AdminGuard)
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

  @UseGuards(AdminGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
  ) {
    return this.userService.update(id, createUserDto);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
