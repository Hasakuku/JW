import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { InterestCategory, User } from 'src/apis/users/entities/user.entity';

@Entity()
export class Meeting extends BaseEntity {
  @PrimaryGeneratedColumn()
  meetingId: number;

  @Column({ length: 100 })
  title: string;

  @Column({ length: 50 })
  tag: string;

  @Column({ length: 50 })
  location: string;

  @Column('date')
  period: Date;

  @Column({ type: 'enum', enum: InterestCategory })
  category: InterestCategory;

  @Column('int')
  member_limit: number;

  @Column('text')
  description: string;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'meeting_participants', // Specify the name of the table
    joinColumn: {
      name: 'meeting',
      referencedColumnName: 'meetingId',
    },
    //[{ name: "meetingId" }]
    inverseJoinColumn: {
      name: 'participant',
      referencedColumnName: 'userId',
    },
    //[{ name: "userId" }]
  })
  participants: number[];

  @ManyToOne(() => User)
  creator: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
