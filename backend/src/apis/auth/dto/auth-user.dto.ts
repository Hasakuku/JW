import { ApiProperty } from '@nestjs/swagger';

export class AuthCredentialDto {
  @ApiProperty({ example: 'user@test.com' })
  email: string;
  @ApiProperty({ example: '123456' })
  password: string;
}
