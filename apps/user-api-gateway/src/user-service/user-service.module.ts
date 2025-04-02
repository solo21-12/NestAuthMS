import { Module } from '@nestjs/common';
import { UserServiceService } from './user-service.service';
import { UserServiceController } from './user-service.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USER_SERVICE_CONSTANTS } from 'libs/constants';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: USER_SERVICE_CONSTANTS.NAME,
        transport: Transport.TCP,
        options: {
          port: USER_SERVICE_CONSTANTS.PORT,
        },
      },
    ]),
  ],
  providers: [UserServiceService],
  controllers: [UserServiceController],
})
export class UserServiceModule {}
