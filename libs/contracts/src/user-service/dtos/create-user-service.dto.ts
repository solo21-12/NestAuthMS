import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from 'libs/constants';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
    minLength: 3,
  })
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User email address',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({
    description: 'User password',
    example: 'StrongPassword123!',
    minLength: 8,
  })
  password: string;

  @IsEnum(UserRole)
  @IsOptional()
  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    default: UserRole.USER,
  })
  role?: UserRole = UserRole.USER;
}
