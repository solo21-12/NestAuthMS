import { NestFactory } from '@nestjs/core';
import { UserApiGatewayModule } from './user-api-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(UserApiGatewayModule);
  await app.listen(3000);
}
bootstrap();
