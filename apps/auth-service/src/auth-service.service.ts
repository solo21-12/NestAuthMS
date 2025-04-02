import {
  AuthServiceDto,
  CreateAuthServiceDto,
  UpdateAuthServiceDto,
} from '@app/contracts';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthServiceService {
  private auths: AuthServiceDto[] = [
    {
      id: 1,
      email: 'test@gmail.com',
      password: 'password',
    },
  ];
  create(createAuthServiceDto: CreateAuthServiceDto) {
    const newAuth: AuthServiceDto = {
      id: this.auths.length + 1,
      ...createAuthServiceDto,
    };

    this.auths.push(newAuth);
    return newAuth;
  }

  findAll() {
    return this.auths;
  }

  findOne(id: number) {
    return this.auths.find((auth) => auth.id === id);
  }

  update(id: number, updateAuthServiceDto: UpdateAuthServiceDto) {
    return `This action updates a #${id} authService`;
  }

  delete(id: number) {
    return `This action removes a #${id} authService`;
  }
}
