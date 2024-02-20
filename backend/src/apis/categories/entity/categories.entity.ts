import { ApiProperty } from '@nestjs/swagger';
import { Meeting } from 'src/apis/meetings/entities/meeting.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Category extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  categoryId: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 50 })
  name: string;

  @ApiProperty()
  @ManyToMany(() => User, (user) => user.categories)
  users: User[];

  @ApiProperty()
  @ManyToMany(() => Meeting, (meeting) => meeting.categories)
  meetings: Meeting[];
}
