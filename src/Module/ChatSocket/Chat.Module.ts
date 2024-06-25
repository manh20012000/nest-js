import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { ChatService } from './Chat.Service';
import { ChatController } from './Chat.Controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatSchema } from 'src/Schema/Chat';
import { ConverstationSchema } from 'src/Schema/Convertsation';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../Authen/Auth.modules';
import { EventGateway } from 'src/EventGateway';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ChatModel', schema: ChatSchema }]),
    MongooseModule.forFeature([
      { name: 'SchemaConvertStation', schema: ConverstationSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret', // Replace 'defaultSecret' with your actual secret key
      signOptions: { expiresIn: '1d' },
      global: true,
    }),
    AuthModule,
  ],
  providers: [EventGateway, ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
//   implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(AuthMiddleware).forRoutes({
//       path: 'chat/ChatMessage',
//       method: RequestMethod.POST,
//     });
//   }
// }
