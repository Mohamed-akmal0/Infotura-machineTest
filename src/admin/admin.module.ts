import { Class, classSchema, Course, CourseSchema, User, UserSchema } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminRepo } from './admin.repository';
import { AdminService } from './admin.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('ADMIN_SECRET'),
        signOptions: {expiresIn : '1d'}
      }),
      inject: [ConfigService]
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Course.name, schema: CourseSchema },
      {name: Class.name, schema: classSchema} ,
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminRepo],
})
export class AdminModule {}
