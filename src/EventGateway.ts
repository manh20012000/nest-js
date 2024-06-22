import {
  OnGatewayConnection,
  SubscribeMessage,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from './Module/Authen/AuthService';
import { Injectable, Logger, Res } from '@nestjs/common';
import { addConnection, removeSocketIDFromArray } from './SocketUserId';
import { Express, Response } from 'express';

@WebSocketGateway({ cors: { origin: '*' } })
@Injectable()
export class EventGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  socket: Socket;

  private connectedUsers: Map<string, string> = new Map(); // Lưu trữ các kết nối

  constructor(private readonly authService: AuthService) {}

  // tạo mảng chứa client cho danh sách với các key và value
  private clients: Record<string, string[]> = {};

  afterInit(server: Server) {
    console.log('Init');
  }
  async getReciverSocketId(receiverId) {
    return this.clients[receiverId];
  }
  async handleConnection(socket: Socket) {
    const token = socket.handshake.query.token.toString();
    const refreshToken = socket.handshake.query.refreshtoken.toString();

    if (!token) {
      console.log('disconnect');
      socket.disconnect();
      return;
    }

    try {
      const { userId, newAccessToken } = await this.authService.handelerToken(
        token,
        refreshToken,
      );

      this.connectedUsers.set(socket.id, userId);
      // trả token về cho client để lưu vào local storange

      socket.emit('newAccessToken', newAccessToken);

      this.clients = addConnection(this.clients, userId, socket.id);

      let listUserIdOnline = Object.keys(this.clients);
      socket.emit('user-online', listUserIdOnline);
      // Gửi id người dùng vừa online có tất cả user khác
      socket.broadcast.emit(
        'server-send-when-has-user-online',
        listUserIdOnline,
      );
    } catch (error) {
      console.error('Invalid token: connect socket fail->', error);

      socket.disconnect();
    }
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(reciveId: string, message: string) {
    const soketid: string[] = await this.getReciverSocketId(reciveId);
    console.log(soketid);
    if (soketid.length > 0) {
      soketid.forEach((socketId: string) => {
        console.log(soketid, 'dshhdjshdjsdocket id ', reciveId);
        this.server.to(socketId).emit('sendMessage', message);
      });
    }
  }

  handleDisconnect(socket: Socket) {
    const userId = this.connectedUsers.get(socket.id);

    this.clients = removeSocketIDFromArray(this.clients, userId, socket.id);

    if (userId) {
      this.connectedUsers.delete(socket.id);
    }
  }

  private getSocketIdByUserId(userId: string): string | undefined {
    for (const [socketId, storedUserId] of this.connectedUsers.entries()) {
      if (storedUserId === userId) {
        return socketId;
      }
    }
    return undefined;
  }
}

// @SubscribeMessage('sendMessage')
//   // async handleMessage(
//   socket: Socket,
//   payload: { recipientId: string; message: string },
// ): Promise<void> {
//   const senderId = socket.data.userId;
//   const recipientSocketId = this.getSocketIdByUserId(payload.recipientId);
//   if (recipientSocketId) {
//     this.server.to(recipientSocketId).emit('receiveMessage', {
//       senderId,
//       message: payload.message,
//     });
//   } else {
//     console.warn(`Recipient with ID ${payload.recipientId} not connected`);
//   }
// }
