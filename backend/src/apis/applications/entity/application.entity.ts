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

export enum ApplicationStatus {
  PENDING = 'pending',
  REJECTED = 'rejected',
  ACCEPTED = 'accepted',
  CANCELED = 'canceled',
}

@Entity()
@Unique(['meetingId', 'userId'])
export class Application extends BaseEntity {
  @PrimaryGeneratedColumn()
  applicationId: number;

  @ManyToOne(() => Meeting)
  @JoinColumn({ name: 'meetingId' })
  meetingId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  userId: number;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING,
  })
  status: ApplicationStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
