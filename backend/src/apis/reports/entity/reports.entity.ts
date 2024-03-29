import { Meeting } from 'src/apis/meetings/entities/meeting.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// export enum ReportCategory {
//   SPAM = '스팸',
//   HARASSMENT = '비방/욕설',
//   INAPPROPRIATE_CONTENT = 'INAPPROPRIATE_CONTENT',
// }

// 모임 신고 엔티티
@Entity()
export class MeetingReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'reporterId' })
  reporter: User;

  @ManyToOne(() => Meeting)
  @JoinColumn({ name: 'meetingId' })
  meeting: Meeting;
}

// 유저 신고 엔티티
@Entity()
export class UserReport {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column({ type: 'enum', enum: ReportCategory })
  // category: ReportCategory;

  @Column()
  content: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'reporterId' })
  reporter: User;

  @OneToOne(() => User)
  @JoinColumn({ name: 'reportedUserId' })
  reportedUser: User;
}
