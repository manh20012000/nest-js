import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthSchema } from 'src/Schema/userSchame';
import { AuthService } from './AuthService';
import { AuthController } from './Auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthMiddleware } from 'src/Protected/MiddwaveProtected';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'AuthModel', schema: AuthSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret', // Replace 'defaultSecret' with your actual secret key
      signOptions: { expiresIn: '1d' },
      global: true,
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: 'auth/Oneuser', method: RequestMethod.GET },
      { path: 'auth/getUser', method: RequestMethod.GET },
      { path: 'Notification/Send', method: RequestMethod.POST },
      {
        path: 'auth/updatefcmtoken',
        method: RequestMethod.POST,
      },
      {
        path: 'chat/ChatMessage',
        method: RequestMethod.POST,
      },
    ); // Đặt các route bạn muốn áp dụng middleware
  }
}
