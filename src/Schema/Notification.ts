import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true, collection: 'Notification' })
export class Notification extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  SendId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  ReciverId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  content: string;
  @Prop({ required: true })
  Acccept: boolean;
}

export const NotificationShema = SchemaFactory.createForClass(Notification);
