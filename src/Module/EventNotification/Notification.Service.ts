import { Injectable, Get, Post, Req, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotificationShema } from 'src/Schema/Notification';
import { Express, Response } from 'express';
import { Notification } from './Notification.dto/Notification';
import { Auth } from 'src/Schema/userSchame';
import { getUser } from '../Authen/Auth.dto/getUser';
@Injectable()
export class NotificationService {
  constructor(
    @InjectModel('Notification')
    private notifiCation: Model<Notification>,
    @InjectModel('AuthModule')
    private authUser: Model<Auth>,
  ) {}
  async sendMessage(notifi: Notification, idsend: string) {
    const notifiModule = await this.notifiCation.create({
      title: notifi.title,
      SendId: idsend,
      ReciverId: notifi.ReciveId,
      content: notifi.content,
      Acccept: false,
    });
    await notifiModule.save();
    const userReciveMesage: getUser = await this.authUser.findById(
      notifi.ReciveId,
    );
    console.log(userReciveMesage.fcmtoken, 'giá trị token được gữi ra ');
  }
}
