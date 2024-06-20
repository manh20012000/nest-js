import { Injectable, } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Chat } from "src/Schema/Chat";
import { Converstation, ConvertShema } from "src/Schema/Convertsation";
@Injectable()
export class ChatService{
    constructor(@InjectModel('ChatModel') private chat: Model<Chat>,
                 @InjectModel('SchemaConvertStation') private Chatconvert :Model<ConvertShema>
    ) {

      
     
 }
    
    async SelectUserChat() { 
          
      }
}