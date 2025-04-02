import { Inject, Injectable } from '@nestjs/common';
import { CreateAuthServiceDto } from './dto/create-auth-service.dto';
import { UpdateAuthServiceDto } from './dto/update-auth-service.dto';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICES_PATTERNS } from '@app/contracts/auth-service';
import { AUTH_SERVICES_CONSTANTS } from 'libs/constants';

@Injectable()
export class AuthServiceService {
  constructor(
    @Inject(AUTH_SERVICES_CONSTANTS.NAME)
    private readonly authServiceClient: ClientProxy,
  ) {}
  create(createAuthServiceDto: CreateAuthServiceDto) {
    return this.authServiceClient.send(
      AUTH_SERVICES_PATTERNS.CREATE,
      createAuthServiceDto,
    );
  }

  findAll() {
    return this.authServiceClient.send(AUTH_SERVICES_PATTERNS.FIND_ALL, {});
  }

  findOne(id: number) {
    return this.authServiceClient.send(AUTH_SERVICES_PATTERNS.FIND_ONE, id);
  }

  update(id: number, updateAuthServiceDto: UpdateAuthServiceDto) {
    return this.authServiceClient.send(AUTH_SERVICES_PATTERNS.UPDATE, {
      id,
      ...updateAuthServiceDto,
    });
  }

  remove(id: number) {
    return this.authServiceClient.send(AUTH_SERVICES_PATTERNS.REMOVE, id);
  }
}
