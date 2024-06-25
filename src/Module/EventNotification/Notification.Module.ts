import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { NotificationService } from './Notification.Service';
import { NotificationController } from './Notification.Controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationShema } from 'src/Schema/Notification';
import { AuthModule } from '../Authen/Auth.modules';
import { JwtModule } from '@nestjs/jwt';
import { AuthSchema } from 'src/Schema/userSchame';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Notification', schema: NotificationShema }, // Ensure the name matches the schema name
    ]),
    MongooseModule.forFeature([
      { name: 'AuthModule', schema: AuthSchema }, // Ensure the name matches the schema name
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret', // Replace 'defaultSecret' with your actual secret key
      signOptions: { expiresIn: '1d' },
      global: true,
    }),
    AuthModule,
  ],
  providers: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {}
