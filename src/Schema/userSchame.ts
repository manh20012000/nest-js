// src/schemas/auth.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'Users' })
export class Auth extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phonenumber: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  surname: string;

  @Prop({ required: false })
  birthdate: String;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  avatar: string;

  @Prop({ required: true })
  nameaccount: string;

  @Prop({ required: true })
  password: string;
  @Prop({ required: false })
  fcmtoken: string[];
}

export const AuthSchema = SchemaFactory.createForClass(Auth);

// import { Schema, Document, model, Collection } from "mongoose";
// const AuthSchema = new Schema(
//   {
//     email: { type: String, required: true },
//     phonenumber: { type: Number, required: true },
//     name: { type: String, required: true },
//     surname: { type: String, required: true },
//     birthdate: { type: Date, required: true },
//     gender: { type: String, required: true },
//     avatar: { type: String, required: true },
//     nameaccount: { type: String, required: true },
//     password: { type: String, required: true },
//   },
//   {
//     timestamps: true,
//     collection: 'Users'
//   }

// );

// export { AuthSchema };

// export interface Auth extends Document {
//   email: string;
//   phonenumber: number;
//   name: string;
//   surname: string;
//   birthdate: Date;
//   gender: string;
//   avatar: string;
//   nameaccount: string;
//   password: string;
// }
