import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinTable,
} from 'typeorm';
import { User } from 'src/apis/users/entities/user.entity';
import { ChatRoom } from './chatroom.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn({ name: 'messageId' })
  id: number;

  @Column({ length: 500 })
  content: string;

  @ManyToOne(() => User)
  sender: User;

  @CreateDateColumn()
  sentAt: Date;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.messages)
  @JoinTable({
    name: 'messages_chatRooms',
    joinColumn: { name: 'messageId' },
    inverseJoinColumn: { name: 'chatRoomId' },
  })
  chatRoom: ChatRoom;
}
