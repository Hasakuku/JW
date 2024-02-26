import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Message } from './entity/message.entity';
import { ChatRoom } from './entity/chatroom.entity';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoom, Message])],
  providers: [ChatService, ChatGateway, ChatController],
  controllers: [ChatController],
})
export class ChatModule {}
