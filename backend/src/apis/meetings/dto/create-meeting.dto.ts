import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsDate, IsEnum, IsInt, IsNotEmpty } from 'class-validator';
import { InterestCategory, User } from 'src/apis/users/entities/user.entity';

export class CreateMeetingDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  tag: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  period: Date;

  @IsNotEmpty()
  @IsEnum(InterestCategory)
  category: InterestCategory;

  @IsNotEmpty()
  @IsInt()
  member_limit: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  participants: User[];

  creator: User;
}
