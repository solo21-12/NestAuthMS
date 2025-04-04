import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from 'libs/constants';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
  })
  name?: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({
    description: 'User email address',
    example: 'test@test.com',
  })
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @ApiProperty({
    description: 'User password',
    example: 'StrongPassword123!',
    minLength: 8,
  })
  password?: string;

  @IsOptional()
  @IsEnum(UserRole)
  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    default: UserRole.USER,
  })
  role?: UserRole;
}
