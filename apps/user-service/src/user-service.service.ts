import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserServiceService {
  private users: UserDto[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'test@gmail.com',
    },
  ];

  findAll(): UserDto[] {
    return this.users;
  }
}
