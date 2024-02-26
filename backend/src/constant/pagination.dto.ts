import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @IsPositive()
  page?: number;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @IsPositive()
  perPage?: number;
}
