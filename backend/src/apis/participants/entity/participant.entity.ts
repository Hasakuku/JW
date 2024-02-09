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
  RelationId,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

export enum ParticipantStatus {
  PENDING = 'pending', // 응답을 기다리는 상태
  REJECTED = 'rejected', // 초대를 거부한 상태
  CANCELED = 'canceled', // 초대를 수락한 후 취소한 상태
  ATTENDED = 'attended', // 모임에 참석한 상태
}

@Entity()
@Unique(['meetingId', 'userId'])
export class Participant extends BaseEntity {
  @PrimaryGeneratedColumn()
  participantId: number;

  @ManyToOne(() => Meeting)
  @JoinColumn({ name: 'meetingId' })
  @RelationId((participant: Participant) => participant.meetingId)
  meetingId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  // @RelationId((participant: Participant) => participant.userId)
  userId: number;

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
