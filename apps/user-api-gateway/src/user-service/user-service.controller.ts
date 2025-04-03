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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserServiceService } from './user-service.service';
import {
  CreateUserDto,
  CreateUserRto,
  GetUserRto,
  UpdateUserRto,
} from '@app/contracts';
import { AdminGuard, JwtAuthGuard } from 'libs/guards';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserServiceController {
  constructor(private readonly userService: UserServiceService) {}

  @UseGuards(AdminGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: CreateUserRto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Return list of users',
    type: GetUserRto,
    isArray: true,
  })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return user data',
    type: GetUserRto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UpdateUserRto,
  })
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
  ) {
    return this.userService.update(id, createUserDto);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
