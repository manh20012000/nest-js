import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Req,
  HttpException,
  UseInterceptors,
} from '@nestjs/common';
import { Express, Response } from 'express';
import { NotificationService } from './Notification.Service';

@Controller('Notification')
export class NotificationController {
  constructor(private readonly NotificationService: NotificationService) {}
  @Post('Send')
  async senNotification(@Body() notifi: any, @Req() req: Request) {
    const user = (req as any).user;

    this.NotificationService.sendMessage(notifi, user._id);
  }
}
