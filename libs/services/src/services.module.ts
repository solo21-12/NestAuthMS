import { Module } from '@nestjs/common';
import { AppConfigModule } from 'libs/config/src/config.module';
import { RedisService } from './redis.service';
import { PasswordHashService } from './password-hash.service';
import { AuthJwtService } from './jwt.service';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    AppConfigModule,
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
  providers: [RedisService, PasswordHashService, AuthJwtService],
  exports: [RedisService, PasswordHashService, AuthJwtService],
})
export class AppServiceModule {}
