import { Meeting } from 'src/apis/meetings/entities/meeting.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

export enum ParticipantStatus {
  PENDING = 'pending', // 응답을 기다리는 상태
  REJECTED = 'rejected', // 거부한 상태
  CANCELED = 'canceled', // 취소한 상태
  ATTENDED = 'attended', // 모임에 참석한 상태
}

@Entity()
@Unique(['meeting', 'user'])
export class Participant extends BaseEntity {
  @PrimaryGeneratedColumn()
  participantId: number;

  @ManyToOne(() => Meeting, (meeting) => meeting.participants)
  @JoinColumn({ name: 'meetingId' })
  meeting: Meeting;

  @ManyToOne(() => User, (user) => user.participants)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: ParticipantStatus,
    default: ParticipantStatus.PENDING,
  })
  status: ParticipantStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
