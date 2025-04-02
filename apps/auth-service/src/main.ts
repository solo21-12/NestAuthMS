import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AuthServiceModule } from './auth-service.module';
import { AUTH_SERVICES_CONSTANTS } from 'libs/constants';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthServiceModule,
    {
      transport: Transport.TCP,
      options: {
        port: AUTH_SERVICES_CONSTANTS.PORT,
      },
    },
  );
  await app.listen();
}
bootstrap();
