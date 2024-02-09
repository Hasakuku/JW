import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsDate, IsEnum, IsInt, IsNotEmpty } from 'class-validator';
import { InterestCategory, User } from 'src/apis/users/entities/user.entity';

export class CreateMeetingDto {
  @ApiProperty({ example: '테스트2' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: '열정적' })
  @IsNotEmpty()
  @IsString()
  tag: string;

  @ApiProperty({ example: '일본 도쿄' })
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty({ example: '2024-02-08' })
  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  period: Date;

  @ApiProperty({ example: 'culture' })
  @IsNotEmpty()
  @IsEnum(InterestCategory)
  category: InterestCategory;

  @ApiProperty({ example: 10 })
  @IsNotEmpty()
  @IsInt()
  member_limit: number;

  @ApiProperty({ example: '테스트용 생성' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: [1, 2] })
  participants?: number[];

  @ApiProperty({ example: 1 })
  creator: number;
}
