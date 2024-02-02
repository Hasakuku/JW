import { ApiProperty } from '@nestjs/swagger';

export class AuthCredentialDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}
