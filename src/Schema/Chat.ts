import { Prop, Schema, SchemaFactory,} from '@nestjs/mongoose'

import * as mongoose from 'mongoose';
@Schema({ timestamps: true, collection: 'ChatShema' })
export class Chat extends Document{
    @Prop({ required: true })
    senderId:{type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
    @Prop({ required: true })
    receiverId: [
        {
            type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
    @Prop({ required: true })
    text: string
    
      video: {
        type: String,
    }
    
      image: {
        type: [String], 
      }
}
export const ChatSchema=SchemaFactory.createForClass(Chat)