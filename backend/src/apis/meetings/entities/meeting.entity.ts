import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from 'src/apis/users/entities/user.entity';
import { Participant } from 'src/apis/participants/entity/participant.entity';
import { Category } from 'src/apis/categories/entity/categories.entity';

@Entity()
export class Meeting extends BaseEntity {
  @PrimaryGeneratedColumn()
  meetingId: number;

  @Column({ length: 100 })
  title: string;

  @Column({ length: 50 })
  tag: string;

  @Column()
  image: string;

  @Column({ length: 50 })
  location: string;

  @Column('date')
  meeting_date: Date;

  @Column('int')
  member_limit: number;

  @Column('text')
  description: string;

  @ManyToMany(() => Category, (category) => category.meetings)
  @JoinTable({
    name: 'meetings_categories',
    joinColumn: { name: 'categoryId' },
    inverseJoinColumn: { name: 'meetingId' },
  })
  categories?: Category[];

  @OneToMany(() => Participant, (participant) => participant.meeting)
  participants?: Participant[];

  @ManyToOne(() => User, (user) => user.meetings)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToMany(() => User, (user) => user.likes)
  likes?: User[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
