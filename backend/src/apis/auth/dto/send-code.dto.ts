import { IsEmail, IsIn, IsNotEmpty } from 'class-validator';

export class SendCodeDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsIn(['signup', 'resetPW'])
  type: string;
}
