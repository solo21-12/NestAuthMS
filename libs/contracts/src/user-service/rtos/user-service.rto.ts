import { UserRole } from 'libs/constants';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserRto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: UserRole;
}

export class UpdateUserRto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name?: string;
  @ApiProperty()
  email?: string;
  @ApiProperty()
  role?: UserRole;
}

export class GetUserRto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
}
