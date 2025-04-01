import { Controller, Get } from '@nestjs/common';
import { UserApiGatewayService } from './user-api-gateway.service';

@Controller()
export class UserApiGatewayController {
  constructor(private readonly userApiGatewayService: UserApiGatewayService) {}

  @Get()
  getHello(): string {
    return this.userApiGatewayService.getHello();
  }
}
