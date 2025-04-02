import { Module } from '@nestjs/common';
import { AuthServiceService } from './auth-service.service';
import { AuthServiceController } from './auth-service.controller';
import { DbModule } from 'libs/db/src/db.module';

@Module({
  imports: [DbModule],
  controllers: [AuthServiceController],
  providers: [AuthServiceService],
})
export class AuthServiceModule {}
