import { Module } from '@nestjs/common';
import { AuthServiceService } from './auth-service.service';
import { AuthServiceController } from './auth-service.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICES_CONSTANTS } from 'libs/constants';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: AUTH_SERVICES_CONSTANTS.NAME,
        transport: Transport.TCP,
        options: {
          port: AUTH_SERVICES_CONSTANTS.PORT,
        },
      },
    ]),
  ],
  controllers: [AuthServiceController],
  providers: [AuthServiceService],
})
export class AuthServiceModule {}
