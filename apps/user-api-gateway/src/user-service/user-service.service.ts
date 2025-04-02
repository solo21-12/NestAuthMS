import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { USER_SERVICE_CONSTANTS } from 'libs/constants';

@Injectable()
export class UserServiceService {
  constructor(
    @Inject(USER_SERVICE_CONSTANTS.NAME)
    private readonly userClient: ClientProxy,
  ) {}
  findAll() {
    return this.userClient.send('user.findAll', {});
  }
}
