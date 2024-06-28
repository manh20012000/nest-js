import {
  Injectable,
  Get,
  Post,
  Req,
  Res,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotificationShema } from 'src/Schema/Notification';
import { Express, Response } from 'express';
import { Notification } from './Notification.dto/Notification';
import { Auth } from 'src/Schema/userSchame';
import { getUser } from '../Authen/Auth.dto/getUser';
import * as admin from 'firebase-admin';
import { MessagingProvider } from 'src/Confige/ConfigeFirebase';
import { AndroidConfig } from 'firebase-admin/lib/messaging/messaging-api';
@Injectable()
export class NotificationService {
  constructor(
    @InjectModel('Notification')
    private notifiCation: Model<Notification>,
    @InjectModel('AuthModule')
    private authUser: Model<Auth>,
    @Inject(MessagingProvider)
    private readonly messaging: admin.messaging.Messaging,
  ) {}
  private android: AndroidConfig = {
    priority: 'high',
  };

  private apns = {
    payload: {
      aps: {
        contentAvailable: true,
      },
    },
    headers: {
      'apns-priority': '5', // Must be `5` when `contentAvailable` is set to true.
    },
  };
  async sendMessage(notifi: Notification, idsend: string) {
    // const notifiModule = await this.notifiCation.create({
    //   title: notifi.title,
    //   SendId: idsend,
    //   ReciverId: notifi.ReciveId,
    //   content: notifi.content,
    //   Acccept: false,
    // });
    // await notifiModule.save();

    const userReciveMesage: getUser = await this.authUser.findById(
      notifi.ReciveId,
    );
    const fcmtokens: string[] = userReciveMesage.fcmtoken;
    console.log(userReciveMesage.fcmtoken, 'giá trị token được gữi ra ');
    return await this.messaging
      .sendEachForMulticast({
        tokens: fcmtokens,

        notification: {
          title: 'message',
          body: 'cin chao bạn nha ',
        },
        android: this.android,
        apns: this.apns,
      })
      .then((response) => {
        if (response.failureCount > 0) {
          const failedTokens: string[] = [];
          response.responses.forEach((resp, idx) => {
            if (!resp.success) {
              failedTokens.push(fcmtokens[idx]);
            }
          });
          return failedTokens;
        } else {
          return [];
        }
      })
      .catch((err) => {
        throw new HttpException(
          `Error sending message: ${err.message}`,
          HttpStatus.NO_CONTENT,
        );
      });
  }
}
