import { ApiProperty } from '@nestjs/swagger';

export class AuthRto {
  @ApiProperty()
  access_token: string;
  @ApiProperty()
  refresh_token: string;
}
