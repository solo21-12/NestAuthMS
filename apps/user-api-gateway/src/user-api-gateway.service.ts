import { Injectable } from '@nestjs/common';

@Injectable()
export class UserApiGatewayService {
  getHello(): string {
    return 'Hello World!';
  }
}
