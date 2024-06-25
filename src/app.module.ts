import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './Module/Authen/Auth.modules';
import { ServeStaticModule } from '@nestjs/serve-static';
import { EventGateway } from './EventGateway';
import { join } from 'path';
import { ChatModule } from './Module/ChatSocket/Chat.Module';
import { NotificationModule } from './Module/EventNotification/Notification.Module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true, // Để sử dụng ConfigModule trên toàn bộ dự án
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    AuthModule,
    ChatModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [EventGateway, AppService],
})
export class AppModule {}
