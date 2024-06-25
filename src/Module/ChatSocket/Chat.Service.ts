import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from 'src/Schema/Chat';
import { Converstation } from 'src/Schema/Convertsation';
import { EventGateway } from 'src/EventGateway';
@Injectable()
export class ChatService {
  constructor(
    @InjectModel('ChatModel')
    private chat: Model<Chat>,
    @InjectModel('SchemaConvertStation')
    private Chatconvert: Model<Converstation>,
    private eventGate: EventGateway,
  ) {}

  async ChatMessage(senderId: string, reciveid: string, text: string) {
    let consverstation: Converstation = await this.Chatconvert.findOne({
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
    const userSocketconnting: any =
      await this.eventGate.getReciverSocketId(reciveid);
    console.log(userSocketconnting);
    userSocketconnting.forEach(async (socketId: string) => {
      console.log(userSocketconnting, 'dshhdjshdjsdocket id ', reciveid);
      const socketServer = await this.eventGate.socketConnect();
      socketServer.to(socketId).emit('sendMessage', text);
    });
    // this.eventGate.sendMessage(reciveid, text);
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
