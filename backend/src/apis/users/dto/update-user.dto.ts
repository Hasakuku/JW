import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Gender } from '../entities/user.entity';

export class UpdateUserDto {
  @ApiProperty({ example: 'user' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  username: string;

  @ApiProperty({ example: '꽁꽁' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  nickname: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  password: string;

  @ApiProperty({ example: 'male' })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ example: 'abc_0001.png' })
  @IsString()
  @IsOptional()
  profileImage?: string;

  @ApiProperty({ example: [1, 2] })
  @IsOptional()
  categoryIds?: number[];

  // @ApiProperty({ example: '123456' })
  // @IsString()
  // @IsOptional()
  // resetPasswordCode?: number;
}
