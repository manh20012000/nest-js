import { Prop, Schema, SchemaFactory,} from '@nestjs/mongoose'

import * as mongoose from 'mongoose';
@Schema({ timestamps: true, collection: 'ChatShema' })
export class Chat extends mongoose.Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  senderId: {}
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User'})
  receiverId: {}
  @Prop({ required: true })
  text: string
}
export const ChatSchema = SchemaFactory.createForClass(Chat)
