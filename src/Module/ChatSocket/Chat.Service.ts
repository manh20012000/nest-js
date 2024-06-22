import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from 'src/Schema/Chat';
import { Converstation, ConvertShema } from 'src/Schema/Convertsation';
import { EventGateway } from 'src/EventGateway';
@Injectable()
export class ChatService {
  constructor(
    @InjectModel('ChatModel')
    private chat: Model<Chat>,
    @InjectModel('SchemaConvertStation')
    private Chatconvert: Model<ConvertShema>,
    private eventGate: EventGateway,
  ) {}

  async ChatMessage(senderId: string, reciveid: string, text: string) {
    console.log(senderId, reciveid);
    let consverstation: ConvertShema = await this.Chatconvert.findOne({
      participants: { $all: [senderId, reciveid] },
    });
    if (!consverstation) {
      consverstation = await this.Chatconvert.create({
        participants: [senderId, reciveid],
      });
    }
    const newMessage: Chat = await this.chat.create({
      senderId,
      reciveid,
      text,
    });
    if (newMessage) {
      await consverstation.messages.push(newMessage._id);
      consverstation.save();
    }
    console.log(text);
    this.eventGate.sendMessage(reciveid, text);
  }

  async SelectUserChat(senderId: string, reciveId: string) {
    const message = (
      await this.Chatconvert.findOne({
        participants: { $all: [senderId, reciveId] },
      })
    ).populate({
      path: 'Chat',
      options: { sort: { createdAt: -1 } },
    });
    console.log(message, 'log giá trị tin nhăns');
  }
}
