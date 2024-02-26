import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { User } from '../users/entities/user.entity';
import { Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChatController } from './chat.controller';
import { AuthUser } from './authdecorator';

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly chatController: ChatController) {}
  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log('Initialized!');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('createChatRoom')
  async handleCreateChatRoom(
    client: Socket,
    payload: { name: string; description: string; creator: User },
    @Req() req,
  ): Promise<void> {
    console.log(req);
    const newChatRoom = await this.chatController.createChatRoom(
      payload.name,
      payload.description,
    );
    this.server.emit('newChatRoom', newChatRoom);
    // this.server.to(message.room).emit('chatToClient', message);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @Req() req,
    client: Socket,
    payload: {
      content: string;
      sender: User;
      chatRoomId: number;
      roomId: number;
    },
  ): Promise<void> {
    const user = req.user;
    const newMessage = await this.chatController.sendMessage(
      payload.content,
      user.nickname,
      payload.chatRoomId,
    );
    this.server
      .to(payload.chatRoomId.toString())
      .emit('newMessage', newMessage);
  }

  @SubscribeMessage('joinRoom')
  async handleRoomJoin(client: Socket, room: string): Promise<void> {
    client.join(room);
    client.emit('joinedRoom', room);
  }

  @SubscribeMessage('leaveRoom')
  handleRoomLeave(client: Socket, room: string): void {
    client.leave(room);
    client.emit('leftRoom', room);
  }
}
