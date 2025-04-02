import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        dbName: configService.get<string>('DB_NAME') || 'myDatabase',
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [MongooseModule],
})
export class DbModule {}
