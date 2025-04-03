import { Module } from '@nestjs/common';
import { AppConfigModule } from 'libs/config/src/config.module';
import { RedisService } from './redis.service';

@Module({
  imports: [AppConfigModule],
  providers: [RedisService],
  exports: [RedisService],
})
export class AppServiceModule {}
