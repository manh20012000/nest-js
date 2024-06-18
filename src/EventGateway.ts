import { OnGatewayConnection,SubscribeMessage, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { AuthService } from "./Module/Authen/AuthService";
import { Injectable,Logger } from "@nestjs/common";

@WebSocketGateway()
@Injectable()
export class EventGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    
  server: Server;
  private connectedUsers: Map<string, string> = new Map(); // Lưu trữ các kết nối

  constructor(private readonly authService: AuthService,) {}

  afterInit(server: Server) {
     console.log('Init');
  }

  async handleConnection(socket: Socket) {
    const token = socket.handshake.query.token as string;
    if (!token) {
      socket.disconnect();
      return;
    }

    try {
      const userId = await this.authService.handelerToken(token);
      this.connectedUsers.set(socket.id, userId);
      console.log(`User connected: ${userId}, socket ID: ${socket.id}`);
      socket.data.userId = userId; // Lưu trữ userId trong dữ liệu socket
    } catch (error) {
      console.error('Invalid token:', error);
      socket.disconnect();
    }
  }

  handleDisconnect(socket: Socket) {
    const userId = this.connectedUsers.get(socket.id);
    if (userId) {
      this.connectedUsers.delete(socket.id);
      console.log(`User disconnected: ${userId}, socket ID: ${socket.id}`);
    }
    }
    @SubscribeMessage('sendMessage')
  async handleMessage(socket: Socket, payload: { recipientId: string; message: string }): Promise<void> {
    const senderId = socket.data.userId;
    const recipientSocketId = this.getSocketIdByUserId(payload.recipientId);
    if (recipientSocketId) {
      this.server.to(recipientSocketId).emit('receiveMessage', {
        senderId,
        message: payload.message,
      });
    } else {
      console.warn(`Recipient with ID ${payload.recipientId} not connected`);
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
