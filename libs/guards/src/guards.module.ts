import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { AppConfigModule } from 'libs/config/src/config.module';
import { AppServiceModule } from 'libs/services';

@Module({
  imports: [
    AppServiceModule,
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
  providers: [JwtAuthGuard],
  exports: [JwtAuthGuard, JwtModule, AppServiceModule],
})
export class GuardsModule {}
