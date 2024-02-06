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
  UpdateDateColumn,
} from 'typeorm';

export enum ApplyStatus {
  PENDING = 'pending',
  REJECTED = 'rejected',
  ACCEPTED = 'accepted',
  CANCELED = 'canceled',
}

@Entity()
export class Apply extends BaseEntity {
  @PrimaryGeneratedColumn()
  applyId: number;

  @ManyToOne(() => Meeting)
  @JoinColumn({ name: 'meetingId' })
  meetingId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  userId: number;

  @Column({ type: 'enum', enum: ApplyStatus, default: ApplyStatus.PENDING })
  status: ApplyStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
