import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsDate,
  Max,
  IsInt,
} from 'class-validator';
import { InterestCategory } from 'src/apis/users/entities/user.entity';
import { formatDate } from 'src/constant/formDate';

export enum Sort {
  DEFAULT = 'default',
  COUNT = 'count',
  CURRENT = 'current',
}

export class GetMeetingsDto {
  @ApiProperty({ example: '테스트', required: false })
  @IsOptional()
  @IsString()
  keyword: string;

  @ApiProperty({ example: 'default', required: false })
  @IsOptional()
  @IsString()
  category: InterestCategory;

  @ApiProperty({ example: 0, required: false, minimum: 0 })
  @IsOptional()
  @IsInt()
  member_min?: number;

  @ApiProperty({ example: 10, required: false, maximum: 100 })
  @IsOptional()
  @IsInt()
  @Max(100)
  member_max?: number;

  @ApiProperty({
    example: formatDate(new Date()),
    required: false,
    default: formatDate(new Date()),
  })
  @IsOptional()
  @IsDate()
  date_start: Date;

  @ApiProperty({
    example: formatDate(new Date()),
    required: false,
    default: formatDate(new Date()),
  })
  @IsOptional()
  @IsDate()
  date_end: Date;

  @ApiProperty({ example: '일본', required: true })
  @IsOptional()
  @IsString()
  location: string;

  @ApiProperty({ example: 'default', required: false })
  @IsOptional()
  @IsString()
  sort?: Sort;

  @ApiProperty({ example: 5, required: false, default: 9 })
  @IsOptional()
  @IsInt()
  perPage?: number;

  @ApiProperty({ example: '', required: false })
  @IsOptional()
  @IsNumber()
  cursorId?: number;

  @ApiProperty({ example: '', required: false })
  @IsOptional()
  @IsString()
  cursorValue?: number;
}
