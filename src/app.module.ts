import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as joi from 'joi';
import { AdminModule } from './admin/admin.module';
import { ClientModule } from './client/client.module';
import { DatabaseModule } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: joi.object({
        MONGO_URI: joi.string().required(),
        PORT: joi.number().required(),
      }),
      envFilePath: '.env',
    }),

    AdminModule,
    ClientModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
