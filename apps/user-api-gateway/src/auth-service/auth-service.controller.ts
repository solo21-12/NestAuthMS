import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthServiceService } from './auth-service.service';
import {
  CreateAuthServiceDto,
  UpdateAuthServiceDto,
} from '@app/contracts/auth-service';

@Controller('auth')
export class AuthServiceController {
  constructor(private readonly authServiceService: AuthServiceService) {}

  @Post()
  create(@Body() createAuthServiceDto: CreateAuthServiceDto) {
    return this.authServiceService.create(createAuthServiceDto);
  }

  @Get()
  findAll() {
    return this.authServiceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authServiceService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAuthServiceDto: UpdateAuthServiceDto,
  ) {
    return this.authServiceService.update(+id, updateAuthServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authServiceService.remove(+id);
  }
}
