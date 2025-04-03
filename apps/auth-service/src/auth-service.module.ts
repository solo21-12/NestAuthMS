import { Module } from '@nestjs/common';
import { AuthServiceService } from './auth-service.service';
import { AuthServiceController } from './auth-service.controller';
import { DbModule } from 'libs/db/src/db.module';
import { PasswordHashService } from './password-hash.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USER_SERVICE_CONSTANTS } from 'libs/constants';
import { AuthJwtService } from './jwt.service';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigModule } from 'libs/config/src/config.module';
import { RedisService } from './redis.service';

@Module({
  imports: [
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
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '15m',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthServiceController],
  providers: [
    AuthServiceService,
    PasswordHashService,
    AuthJwtService,
    RedisService,
  ],
})
export class AuthServiceModule {}
