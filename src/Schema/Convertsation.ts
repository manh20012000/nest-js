import { Prop, Schema, SchemaFactory,} from '@nestjs/mongoose'

import * as mongoose from 'mongoose';
@Schema({ timestamps: true, collection: 'Convertsation' })
export class ConvertShema extends Document{
    @Prop({ required: true })
    participants: [
        {
          
        },
    ]
    @Prop({ required: true })
    messages: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ChatShema",
          default: [],
        },
    ]
    @Prop({ required: true })
    nameChat:string
}
export const Converstation=SchemaFactory.createForClass(ConvertShema)