import { Module } from '@nestjs/common';
import { AuthServiceService } from './auth-service.service';
import { AuthServiceController } from './auth-service.controller';
import { DbModule } from 'libs/db/src/db.module';
import { PasswordHashService } from './password-hash.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USER_SERVICE_CONSTANTS } from 'libs/constants';
import { AuthJwtService } from './jwt.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
      imports: [ConfigModule],
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
  providers: [AuthServiceService, PasswordHashService, AuthJwtService],
})
export class AuthServiceModule {}
