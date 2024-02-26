import { ApiProperty } from '@nestjs/swagger';
import * as crypto from 'crypto';
import { Category } from 'src/apis/categories/entity/categories.entity';
import { Meeting } from 'src/apis/meetings/entities/meeting.entity';
import { Participant } from 'src/apis/participants/entity/participant.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum Provider {
  LOCAL = 'local',
  KAKAO = 'kakao',
  GOOGLE = 'google',
}

@Entity()
export class User extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  userId: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 50 })
  username: string;

  @ApiProperty()
  @Column({ length: 50, unique: true })
  nickname: string;

  @ApiProperty()
  @Column({ length: 50, unique: true })
  email: string;

  @ApiProperty()
  @Column({ length: 50 })
  password: string;

  @ApiProperty()
  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @ApiProperty()
  @Column({ type: 'enum', enum: Provider })
  provider: Provider;

  @ApiProperty()
  @Column({ nullable: true })
  profileImage?: string;

  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

  @ApiProperty()
  @ManyToMany(() => Category, (category) => category.users)
  @JoinTable({
    name: 'users_categories',
    joinColumn: { name: 'categoryId' },
    inverseJoinColumn: { name: 'userId' },
  })
  categories?: Category[];

  @ApiProperty()
  @OneToMany(() => Participant, (participant) => participant.user)
  participants?: Participant[];

  @ApiProperty()
  @OneToMany(() => Meeting, (meeting) => meeting.user)
  meetings?: Meeting[];

  @ApiProperty()
  @ManyToMany(() => Meeting, (meeting) => meeting.likes)
  @JoinTable({
    name: 'users_meetings',
    joinColumn: { name: 'userId' },
    inverseJoinColumn: { name: 'meetingId' },
  })
  likes?: Meeting[];

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at?: Date;

  @ApiProperty()
  @DeleteDateColumn()
  deleted_at?: Date;

  private static async hashPassword(password: string): Promise<string> {
    return await crypto.createHash('sha1').update(password).digest('hex');
  }

  async setPassword(password: string): Promise<string> {
    this.password = await User.hashPassword(password);
    return this.password;
  }

  async validatePassword(password: string): Promise<boolean> {
    const hashedPassword = await User.hashPassword(password);
    return this.password === hashedPassword;
  }
}
