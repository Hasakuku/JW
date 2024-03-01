import { Optional } from '@nestjs/common';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { Category } from 'src/apis/categories/entity/categories.entity';
import { formatDate } from 'src/constant/formDate';

export class CreateMeetingDto {
  @ApiProperty({ example: '테스트2' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: '열정적' })
  @Optional()
  @IsString()
  tag?: string;

  @ApiProperty({ example: '일본 도쿄' })
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty({ example: 'image.png' })
  @IsNotEmpty()
  @IsString()
  image?: string;

  @ApiProperty({ example: new Date() })
  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  meeting_date: Date;

  @ApiProperty({ example: [1, 2] })
  @IsOptional()
  categories?: number[];

  @ApiProperty({ example: 10 })
  @IsNotEmpty()
  @IsInt()
  member_limit: number;

  @ApiProperty({ example: '테스트용 생성' })
  @IsNotEmpty()
  @IsString()
  description: string;
}

export class UpdateMeetingDto extends PartialType(CreateMeetingDto) {}
