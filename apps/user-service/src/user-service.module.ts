import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserServiceController } from './user-service.controller';
import { UserServiceService } from './user-service.service';
import { User, UserSchema } from './schemas/user.schema';
import { DbModule } from 'libs/db/src/db.module';
import { UserServiceRepository } from './user-service.repository';

@Module({
  imports: [
    DbModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserServiceController],
  providers: [UserServiceService, UserServiceRepository],
  exports: [UserServiceService],
})
export class UserServiceModule {}
