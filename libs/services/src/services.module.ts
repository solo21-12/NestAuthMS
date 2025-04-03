import { Module } from '@nestjs/common';
import { AppConfigModule } from 'libs/config/src/config.module';
import { RedisService } from './redis.service';
import { PasswordHashService } from './password-hash.service';

@Module({
  imports: [AppConfigModule],
  providers: [RedisService, PasswordHashService],
  exports: [RedisService, PasswordHashService],
})
export class AppServiceModule {}
