import { Module } from '@nestjs/common';
import { UserServiceService } from './user-service.service';
import { UserServiceController } from './user-service.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USER_SERVICE_CONSTANTS } from 'libs/constants';
import { GuardsModule } from 'libs/guards/src/guards.module';
import { ConfigModule } from '@nestjs/config'; // ✅ Import ConfigModule

@Module({
  imports: [
    ConfigModule, // ✅ Ensure ConfigModule is imported
    ClientsModule.register([
      {
        name: USER_SERVICE_CONSTANTS.NAME,
        transport: Transport.TCP,
        options: {
          port: USER_SERVICE_CONSTANTS.PORT,
        },
      },
    ]),
    GuardsModule, // ✅ Ensure GuardsModule is still imported
  ],
  providers: [UserServiceService],
  controllers: [UserServiceController],
})
export class UserServiceModule {}
