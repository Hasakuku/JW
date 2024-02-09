import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
// import { AuthCredentialDto } from './dto/auth-user.dto';
import { User } from '../users/entities/user.entity';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthCredentialDto } from './dto/auth-user.dto';
import { TransformInterceptor } from 'src/common/interceptors/response-type.interceptor';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './auth.decorator';
import { Response } from 'express';
import { CodeUnauthorized } from 'src/constant/swagger/response-type-401';
import {
  Authorized,
  CodeSend,
  Login,
} from 'src/constant/swagger/response-type-success';
import { authMessage, userMessage } from 'src/constant/messages/message-type';
import { SendCodeDto } from './dto/send-code.dto';
import { LoginUnauthorized } from 'src/constant/swagger/response-type-404';
import { KakaoAuthGuard } from './auth.guard';

interface IOAuthUser {
  user: {
    name: string;
    email: string;
    password: string;
  };
}

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  // @Get('/kakao/redirect')
  // async redirectKakao(@Res() res: Response) {
  //   const redirectUri =
  //     'https://kauth.kakao.com/oauth/authorize?client_id=3f9afa0045d4d2e28e15fe477c6f683a&redirect_uri=http://localhost:3000/api/v1/auth/kakao/login&response_type=code&scope=profile_nickname,account_email';
  //   res.redirect(redirectUri);
  // }

  //*카카오 로그인
  @UseGuards(KakaoAuthGuard)
  @Get('/kakao')
  @ApiOperation({ summary: '카카오 페이지 리다이렉트(프론트 요청URI)' })
  async kakao(): Promise<void> {
    return;
  }
  //*카카오 로그인 콜백
  @UseGuards(KakaoAuthGuard)
  @Get('kakao/login')
  // @UseInterceptors(TransformInterceptor)
  @ApiOperation({ summary: '카카오 로그인 콜백' })
  async kakaoLogin(@Req() req, @Res() res) {
    res.cookie('jwt', req.user.token, {
      httpOnly: true,
    });
    // res.status(201).json(authMessage.LOGIN_SUCCESS);
    res.redirect(process.env.FRONT_URI);
  }
  //*카카오 연결 끊기
  @Get('kakao/withdraw')
  @ApiOperation({ summary: '카카오 탈퇴 페이지 리다이렉트(프론트 요청URI)' })
  async kakaoWithdraw(@Res() res): Promise<void> {
    const url = process.env.KAKAO_WITHDRAW_URI;
    res.redirect(url);
  }
  //*카카오 연결 끊기 콜백
  @Get('kakao/withdraw-callback')
  @ApiOperation({ summary: '카카오 탈퇴 콜백' })
  async kakaoWithdrawCallback(@Req() req, @Res() res) {
    await this.authService.kakaoWithdraw(req.query.code);
    res.cookie('jwt', null, { maxAge: 0 });
    // res.status(204).redirect(process.env.FRONT_URI);
    res.status(200).json({ message: 'logout' });
  }
  //* 회원가입
  @Post('/signup')
  @ApiOperation({ summary: '이메일 가입' })
  @ApiBody({ description: '사용자 등록', type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: '사용자 등록',
  })
  async signup(@Body() createUserDto: CreateUserDto): Promise<object> {
    this.authService.signup(createUserDto);
    return { message: authMessage.SIGNUP_SUCCESS };
  }

  //* 로그인
  @Post('/login')
  // @UseGuards(AuthGuard())
  @UseInterceptors(TransformInterceptor)
  @ApiOperation({ summary: '이메일 로그인' })
  @ApiBody({ type: AuthCredentialDto })
  @ApiResponse({
    status: 201,
    description: '사용자 로그인 (쿠키에 jwt 토큰 생성)',
    type: Login,
  })
  @ApiResponse({
    status: 401,
    description: authMessage.LOGIN_FAILED,
    type: LoginUnauthorized,
  })
  async login(
    @Body() authCredentialDto: AuthCredentialDto,
    @Res() res: Response,
  ) {
    const accessToken = await this.authService.login(authCredentialDto);
    res.cookie('jwt', accessToken, { httpOnly: true });
    res.status(201).json({ message: authMessage.LOGIN_SUCCESS });
  }

  //*로그 아웃
  @Delete('/logout')
  // @UseInterceptors(TransformInterceptor)
  @ApiOperation({ summary: '로그 아웃' })
  @ApiResponse({
    status: 204,
    description: '사용자 로그 아웃',
  })
  logout(@Res() res: Response): void {
    res.cookie('jwt', null, {
      maxAge: 0,
    });
    res.sendStatus(204);
  }

  //* 이메일 인증 코드 발송
  @Post('send-code')
  @UseInterceptors(TransformInterceptor)
  @ApiOperation({ summary: '인증 코드 발송' })
  @ApiBody({
    type: SendCodeDto,
    description: '이메일 인증 코드 발송',
    examples: {
      '회원가입 코드 발송': {
        summary: '회원가입을 위한 이메일 인증 코드 발송',
        value: {
          email: 'user@test.com',
          type: 'signup',
        },
      },
      '비밀번호 재설정 코드 발송': {
        summary: '비밀번호 재설정을 위한 이메일 인증 코드 발송',
        value: {
          email: 'user@test.com',
          type: 'resetPW',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: authMessage.CODE_SEND_SUCCESS,
    type: CodeSend,
  })
  async sendCodeEmail(@Body() sendCodeEmail: SendCodeDto): Promise<object> {
    await this.authService.sendCodeEmail(sendCodeEmail);
    return { message: authMessage.CODE_SEND_SUCCESS };
  }

  //* 이메일 인증 확인
  @Get('auth-code')
  @UseInterceptors(TransformInterceptor)
  @ApiOperation({ summary: '코드 인증' })
  @ApiQuery({ name: 'email', type: String, example: 'user@test.com' })
  @ApiQuery({ name: 'code', type: Number, example: '123456' })
  @ApiResponse({
    status: 200,
    description: '코드 인증 완료',
    type: Authorized,
  })
  @ApiResponse({
    status: 401,
    description: '인증 오류',
    type: CodeUnauthorized,
  })
  async verifyAuthCode(
    @Query('email') email: string,
    @Query('code') code: number,
  ): Promise<object> {
    const result = await this.authService.verifyAuthCode(email, code);
    return { result };
  }
}
