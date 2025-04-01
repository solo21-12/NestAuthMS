import { Module } from '@nestjs/common';
import { UserApiGatewayController } from './user-api-gateway.controller';
import { UserApiGatewayService } from './user-api-gateway.service';

@Module({
  imports: [],
  controllers: [UserApiGatewayController],
  providers: [UserApiGatewayService],
})
export class UserApiGatewayModule {}
