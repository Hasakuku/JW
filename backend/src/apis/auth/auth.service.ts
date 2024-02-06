import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
// import { AuthCredentialDto } from './dto/auth-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthCredentialDto } from './dto/auth-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/apis/users/users.service';
import * as nodemailer from 'nodemailer';
import { authMessage, userMessage } from 'src/constant/messages/message-type';
import { SendCodeDto } from './dto/send-code.dto';
import { EntityManager } from 'typeorm';
import { AuthCode } from './entities/auth-code.entity';
import { SocialUserDto } from './dto/social-user.dto';
import { User } from '../users/entities/user.entity';
import { HttpService } from '@nestjs/axios';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private entityManager: EntityManager,
    private httpService: HttpService,
  ) {}

  async OAuthLogin(socialUser: SocialUserDto): Promise<any> {
    // 1. 회원조회
    // const email: string = socialUser.email;
    // let user: any = await this.userService.getUserByEmail(email); //user를 찾아서
    // 2, 회원가입이 안되어있다면? 자동회원가입
    // if (!user) user = await this.userService.createUser(user); //user가 없으면 하나 만들고, 있으면 이 if문에 들어오지 않을거기때문에 이러나 저러나 user는 존재하는게 됨.
    // 3. 회원가입이 되어있다면? 로그인(AT, RT를 생성해서 브라우저에 전송)한다
    // this.setRefreshToken({ user, res });
    // const accessToken = await this.jwtService.sign(user);
    // res.cookie('jwt', accessToken, { httpOnly: true });
    // res.redirect('http://localhost:3000');
  }
  async kakaoWithdraw(code: string) {
    const newToken = await this.httpService
      .post(
        'https://kauth.kakao.com/oauth/token',
        `grant_type=authorization_code&client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${process.env.FRONT_URI}/api/v1/auth/kakao/withdraw-callback&code=${code}`,
        {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
        },
      )
      .toPromise();

    const kakaoToken = newToken.data.access_token;

    const user = await this.httpService
      .get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${kakaoToken}`,
        },
      })
      .toPromise();

    const kakaoId = user.data.id;
    const kakaoEmail = user.data.kakao_account.email;
    const checkUser = await this.entityManager.findOneBy(User, {
      email: kakaoEmail,
    });

    if (!checkUser) throw new NotFoundException('사용자 정보가 없음');

    const result = await this.httpService
      .post(
        'https://kapi.kakao.com/v1/user/unlink',
        {
          target_id_type: 'user_id',
          target_id: kakaoId,
        },
        {
          headers: {
            Authorization: `Bearer ${kakaoToken}`,
          },
        },
      )
      .toPromise();

    if (result.data.id !== kakaoId)
      throw new InternalServerErrorException('카카오 서버 오류');
    await this.entityManager.softDelete(User, { email: kakaoEmail });
    // await this.entityManager.update(
    // User,
    // { kakaoId: kakaoId },
    // { deletedAt: new Date() },
    // );
  }

  //* 회원가입
  async signup(createUserDto: CreateUserDto): Promise<void> {
    await this.userService.createUser(createUserDto);
  }

  //* 로그인
  async login(authCredentialDto: AuthCredentialDto): Promise<string> {
    const { email, password } = authCredentialDto;
    const foundUser = await this.userService.getUserByEmail(email);

    if (!foundUser || !(await foundUser.validatePassword(password)))
      throw new UnauthorizedException(authMessage.LOGIN_FAILED);
    const payload = { email };
    const accessToken = await this.jwtService.sign(payload);
    console.log(accessToken)
    return accessToken;
  }

  //* 인증코드 생성
  async createAuthCode(
    email: string,
    code: number,
    expirationTime: Date,
  ): Promise<void> {
    // 기존에 같은 이메일에 대한 코드가 있는지 확인
    const existingCode = await this.entityManager.findOneBy(AuthCode, {
      email,
    });

    // 기존 코드가 있다면 삭제
    if (existingCode) {
      await this.entityManager.delete(AuthCode, { email });
    }

    // 새로운 코드 생성
    const authCode = new AuthCode();
    authCode.email = email;
    authCode.code = code;
    authCode.expirationTime = expirationTime;

    // 새로운 코드 저장
    await this.entityManager.save(authCode);
  }

  //* 이메일 인증 코드 발송
  async sendCodeEmail(sendCodeEmail: SendCodeDto): Promise<void> {
    const { email, type } = sendCodeEmail;
    const user = await this.userService.getUserByEmail(email);
    if (type === 'signup' && user) {
      throw new ConflictException(authMessage.SIGNUP_CONFLICT_EMAIL);
    }
    if (type === 'resetPW' && !user) {
      throw new NotFoundException(userMessage.USER_NOTFOUND);
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000);
    const codeExpirationTime = new Date();
    const setCodeExpirationTime = new Date(codeExpirationTime);
    setCodeExpirationTime.setMinutes(codeExpirationTime.getMinutes() + 3);
    // await this.userService.setResetCode(
    //   email,
    //   resetCode,
    //   setCodeExpirationTime,
    // );
    await this.createAuthCode(email, resetCode, setCodeExpirationTime);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Auth Code',
      text: `Auth Code: ${resetCode} \n CodeExpirationTime: ${setCodeExpirationTime}`,
    };

    await transporter.sendMail(mailOptions);
  }

  //* 이메일 인증 확인
  async verifyAuthCode(email: string, code: number): Promise<boolean> {
    const authCode = await this.entityManager
      .createQueryBuilder(AuthCode, 'authCode')
      .where('authCode.email = :email', { email })
      .orderBy('authCode.expirationTime', 'DESC')
      .getOne();
    if (!authCode) {
      throw new NotFoundException(authMessage.EMAIL_NOTFOUND);
    }

    if (new Date() > authCode.expirationTime) {
      throw new UnauthorizedException(authMessage.CODE_EXPIRED);
    }

    if (authCode.code !== Number(code)) {
      throw new UnauthorizedException(authMessage.CODE_UNAUTHORIZED);
    }

    return true;
  }

  //  async resetPassword(email: string, newPassword: string): Promise<void> {
  //   const user = await this.userService.getUserByEmail(email);
  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }

  //   user.password = newPassword;
  //   user.resetPasswordCode = null; // Clear the reset token
  //   await this.userService.save(user);
  // }

  // async sendResetPasswordEmail(
  //   email: string,
  //   updateUserDto: UpdateUserDto,
  // ): Promise<void> {
  //   const user = await this.userService.getUserByEmail(email);
  //   if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');

  //   const code = Math.floor(100000 + Math.random() * 900000); // 6자리 랜덤 인증 코드 생성
  //   user.resetPasswordCode = code;
  //   await this.userService.updateUser(email, updateUserDto);

  //   const transporter = nodemailer.createTransport({
  //     // 여기에 이메일 서비스 설정을 입력하세요.
  //   });

  //   const mailOptions = {
  //     from: 'your-email@example.com',
  //     to: email,
  //     subject: '비밀번호 재설정 코드',
  //     text: `비밀번호 재설정 코드는 ${code}입니다.`,
  //   };

  //   await transporter.sendMail(mailOptions);
  // }
}
