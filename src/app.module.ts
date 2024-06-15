import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {  ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './Module/Authen/Auth.controller';
import { AuthModule } from './Module/Authen/Auth.modules';
import { AuthService } from './Module/Authen/AuthService';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:'.env',
      isGlobal: true, // Để sử dụng ConfigModule trên toàn bộ dự án
    }), MongooseModule.forRoot(process.env.MONGODB_URI),AuthModule],
     controllers: [AppController],
      providers: [AppService],
})
export class AppModule {}
