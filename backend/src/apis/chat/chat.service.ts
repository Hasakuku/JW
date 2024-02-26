import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { ChatRoom } from './entity/chatroom.entity';
import { Message } from './entity/message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoom)
    private chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async createChatRoom(name: string, description: string): Promise<ChatRoom> {
    const newChatRoom = await this.chatRoomRepository.create({
      name,
      description,
    });
    return this.chatRoomRepository.save(newChatRoom);
  }

  async sendMessage(
    content: string,
    sender: User,
    chatRoomId: number,
  ): Promise<Message> {
    const chatRoom = await this.chatRoomRepository.findOne({
      where: { id: chatRoomId },
    });
    const newMessage = await this.messageRepository.create({
      content,
      sender,
      chatRoom,
    });
    return await this.messageRepository.save(newMessage);
  }

  async getChatRoom(id: number): Promise<ChatRoom> {
    return await this.chatRoomRepository.findOne({
      where: { id },
      relations: ['messages'],
    });
  }
}
