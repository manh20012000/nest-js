import { Module ,NestModule,MiddlewareConsumer,RequestMethod } from "@nestjs/common";
import { ChatService } from "./Chat.Service";
import { ChatController } from "./Chat.Controller";
import { MongooseModule } from "@nestjs/mongoose";
import { ChatSchema } from "src/Schema/Chat";
import { AuthMiddleware } from "src/Protected/MiddwaveProtected";
import { Converstation } from "src/Schema/Convertsation";
import { config } from "process";
@Module({
    imports: [MongooseModule.forFeature([{ name: 'ChatModel', schema: ChatSchema }]),
               MongooseModule.forFeature([{name:'SchemaConvertStation',schema:Converstation}])],
    providers: [ChatService],
    controllers:[ChatController],
})
export class ChatModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
      consumer.apply(AuthMiddleware).forRoutes()
    }
}