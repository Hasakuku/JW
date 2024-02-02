import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import * as crypto from 'crypto';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  // PrimaryColumn,
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

export enum InterestCategory {
  DEFAULT = 'default',
  CULTURE = 'culture', //문화예술
  FOOD = 'food', // 음식
  SPORTS = 'sports', // 스포츠
  TOUR = 'tour', // 관광
  RELIGION = 'religion', // 종교
  WELLBING = 'wellbing', // 건강,휴양
  SOCIAL = 'social', // 소셜활동
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

  @ApiProperty()
  // @IsEnum(InterestCategory, { each: true })
  @Column('simple-array')
  interestCategory: InterestCategory[];

  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

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
