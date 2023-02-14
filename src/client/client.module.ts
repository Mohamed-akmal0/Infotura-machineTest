import { Class, classSchema, User, UserSchema } from '@app/common';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientController } from './client.controller';
import { ClientRepo } from './client.repository';
import { ClientService } from './client.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Class.name, schema: classSchema },
    ]),
    JwtModule,
  ],
  controllers: [ClientController],
  providers: [ClientService, ClientRepo],
})
export class ClientModule {}
