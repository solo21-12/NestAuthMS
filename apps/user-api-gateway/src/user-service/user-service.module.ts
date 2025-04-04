import { Module } from '@nestjs/common';
import { UserServiceService } from './user-service.service';
import { UserServiceController } from './user-service.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USER_SERVICE_CONSTANTS } from 'libs/constants';
import { ConfigModule } from '@nestjs/config';
import { GuardsModule } from 'libs/guards';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.register([
      {
        name: USER_SERVICE_CONSTANTS.NAME,
        transport: Transport.TCP,
        options: {
          host: 'user-service',
          port: USER_SERVICE_CONSTANTS.PORT,
        },
      },
    ]),
    GuardsModule,
  ],
  providers: [UserServiceService],
  controllers: [UserServiceController],
})
export class UserServiceModule {}
