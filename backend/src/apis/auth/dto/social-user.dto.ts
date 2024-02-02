import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CreateUserDto } from 'src/apis/users/dto/create-user.dto';
import { Provider } from 'src/apis/users/entities/user.entity';

export class SocialUserDto extends CreateUserDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  nickname: string;

  @IsEnum(Provider)
  @IsString()
  provider: Provider;

  @IsString()
  profileImage?: string;
}
