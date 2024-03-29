import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { Gender } from 'src/apis/users/entities/user.entity';
import { UserService } from 'src/apis/users/users.service';
import { AuthService } from '../auth.service';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {
    super({
      clientID: '3f9afa0045d4d2e28e15fe477c6f683a',
      callbackURL: `https://jwpj.net/api/v1/auth/kakao/login`,
      // callbackURL: `http://localhost:3000/api/v1/auth/kakao/login`,
      clientSecret: '',
      // scope: ['account_email', 'profile_nickname'],
    });
  }
  //${process.env.LOCAL_FRONT_URI}
  async validate(
    accessToken: string,
    refreshToken: string,
    account: any,
  ): Promise<any> {
    const userEmail = account._json.kakao_account.email;
    const getUser = await this.userService.getUserByEmail(userEmail);
    // console.log(typeof userEmail, userEmail, getUser);
    if (!getUser) {
      const user = {
        // a: account._json.kakao_account,
        email: account._json.kakao_account.email,
        password: String(account.id),
        username: account._json.kakao_account.name,
        nickname: account._json.kakao_account.profile.nickname,
        provider: account.provider,
        profileImage:
          account._json.kakao_account.profile.profile_image_url ?? null,
        gender: Gender[account._json.kakao_account.gender] ?? Gender.OTHER,
      };
      await this.userService.createUser(user);
    }
    const token = await this.authService.login({
      email: account._json.kakao_account.email,
      password: String(account.id),
    });
    return { token };
  }
}

// @Injectable()
// export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
//   constructor(private readonly authService: AuthService) {
//     super({
//       clientID: process.env.KAKAO_CLIENT_ID,
//       callbackURL: process.env.KAKAO_CALLBACK_URL,
//       passReqToCallback: true,
//     });
//   }

//   async validate(
//     request: any,
//     accessToken: string,
//     refreshToken: string,
//     profile: any,
//     done: VerifyCallback,
//   ): Promise<any> {
//     const { username, emails } = profile;
//     const user = {
//       email: emails[0].value,
//       username,
//       provider: 'kakao',
//     };
//     const jwt: string = await this.authService.validateOAuthLogin(
//       user,
//       Provider.KAKAO,
//     );
//     done(null, jwt);
//   }
// }
