// import from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Gender, Provider, InterestCategory } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
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

  @ApiProperty({ example: 'user@test.com' })
  @IsEmail()
  @IsNotEmpty()
  @Length(1, 50)
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  password: string;

  @ApiProperty({ example: 'male' })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ example: 'kakao' })
  @IsEnum(Provider)
  provider: Provider;

  @ApiProperty({ example: 'abc_0001.png' })
  @IsString()
  @IsOptional()
  profileImage?: string;

  @ApiProperty({ example: ['culture', 'food'] })
  @IsEnum(InterestCategory)
  interestCategory: InterestCategory[];
}
