import { Controller, Post, Body, Param, Req } from '@nestjs/common';
import { ChatService } from './Chat.Service';
import { Chat } from 'src/Schema/Chat';
@Controller('chat')
export class ChatController {
  constructor(private readonly ChatService: ChatService) {}
  @Post('ChatMessage')
  async ChatMessage(
    @Body() message: any,

    @Req() req: Request,
  ) {
    const user = (req as any).user; // lấy thông tin user ra cho người dùng

    const messageIdObject = JSON.parse(message.id);

    return this.ChatService.ChatMessage(
        user._id,
        messageIdObject._id,
        message.message,
    
    );
  }
}
