import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthCodeDto {
  @ApiProperty({ example: 'user@test.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 123456 })
  @IsNotEmpty()
  code: number;
}
