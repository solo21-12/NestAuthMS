import { Module } from '@nestjs/common';
import { AuthServiceService } from './auth-service.service';
import { AuthServiceController } from './auth-service.controller';
import { DbModule } from 'libs/db/src/db.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USER_SERVICE_CONSTANTS } from 'libs/constants';
import { AppConfigModule } from 'libs/config/src/config.module';
import { AppServiceModule } from 'libs/services';

@Module({
  imports: [
    AppServiceModule,
    AppConfigModule,
    DbModule,
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
  controllers: [AuthServiceController],
  providers: [AuthServiceService],
})
export class AuthServiceModule {}
