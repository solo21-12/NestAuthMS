import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthRefreshTokenDto {
  @IsString()
  @ApiProperty()
  refreshToken: string;

  @IsString()
  @ApiProperty()
  accessToken: string;
}

export class RefreshTokenRequestDto {
  @IsString()
  @ApiProperty()
  refresh_token: string;
}
