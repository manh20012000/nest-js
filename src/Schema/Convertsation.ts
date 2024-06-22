import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Chat } from './Chat';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true, collection: 'Convertsation' })
export class ConvertShema extends mongoose.Document {
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  participants: mongoose.Schema.Types.ObjectId[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ChatShema' }] })
  messages: mongoose.Schema.Types.ObjectId[];

  @Prop({ required: false, default: null })
  nameChat: string;
}

export const Converstation = SchemaFactory.createForClass(ConvertShema);
