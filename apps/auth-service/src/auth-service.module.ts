import { Module } from '@nestjs/common';
import { AuthServiceService } from './auth-service.service';
import { AuthServiceController } from './auth-service.controller';
import { DbModule } from 'libs/db/src/db.module';
import { AppConfigModule } from 'libs/config/src/config.module';
import { AppServiceModule } from 'libs/services';

@Module({
  imports: [AppServiceModule, AppConfigModule, DbModule],
  controllers: [AuthServiceController],
  providers: [AuthServiceService],
})
export class AuthServiceModule {}
