import { Module } from '@nestjs/common';
import { UserApiGatewayController } from './user-api-gateway.controller';
import { UserApiGatewayService } from './user-api-gateway.service';
import { UserServiceModule } from './user-service/user-service.module';
import { AuthServiceModule } from './auth-service/auth-service.module';

@Module({
  imports: [UserServiceModule, AuthServiceModule],
  controllers: [UserApiGatewayController],
  providers: [UserApiGatewayService],
})
export class UserApiGatewayModule {}
