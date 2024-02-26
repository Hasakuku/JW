import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { User } from '../users/entities/user.entity';
import { ChatRoom } from './entity/chatroom.entity';
import { Message } from './entity/message.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Chats')
@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('room')
  @ApiOperation({ summary: '채팅방 개설' })
  async createChatRoom(
    @Body('name') name: string,
    @Body('description') description: string,
  ): Promise<ChatRoom> {
    return this.chatService.createChatRoom(name, description);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('message')
  @ApiOperation({ summary: '채팅 생성' })
  async sendMessage(
    @Body('content') content: string,
    @Body('sender') sender: User,
    @Body('chatRoomId') chatRoomId: number,
  ): Promise<Message> {
    return this.chatService.sendMessage(content, sender, chatRoomId);
  }

  @Get('room/:id')
  @ApiOperation({ summary: '채팅방 조회' })
  async getChatRoom(@Param('id') id: number): Promise<ChatRoom> {
    return this.chatService.getChatRoom(id);
  }
}
