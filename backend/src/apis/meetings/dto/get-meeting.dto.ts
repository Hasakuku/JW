import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsDate,
  Max,
  IsInt,
  IsArray,
  IsIn,
  IsEnum,
} from 'class-validator';
import { Category } from 'src/apis/categories/entity/categories.entity';
import { formatDate } from 'src/constant/formDate';

export enum Sort {
  DEFAULT = 'default',
  COUNT = 'count',
  CURRENT = 'current',
}

export class GetMeetingsDto {
  constructor() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    this.date_start = today;
    this.date_end = tomorrow;
    this.member_min = 0;
    this.member_max = 100;
    this.sort = Sort.DEFAULT;
    this.perPage = 9;
    this.cursorId = 0;
  }
  @ApiProperty({ example: '테스트', required: false })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiProperty({ type: [Number], example: [1, 2], required: false })
  @IsOptional()
  @IsArray()
  categories?: number[];

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
  date_start?: Date;

  @ApiProperty({
    example: formatDate(new Date()),
    required: false,
    default: formatDate(new Date()),
  })
  @IsOptional()
  @IsDate()
  date_end?: Date;

  @ApiProperty({ example: '일본', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ example: 'default', required: false })
  @IsOptional()
  @IsString()
  @IsEnum(Sort)
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
  cursorValue?: string | Date;
}
