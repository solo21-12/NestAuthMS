import { IsString } from 'class-validator';

export class AuthRefreshTokenDto {
  @IsString()
  refreshToken: string;

  @IsString()
  accessToken: string;
}
