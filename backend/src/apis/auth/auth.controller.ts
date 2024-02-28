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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { TransformInterceptor } from 'src/common/interceptors/response-type.interceptor';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './auth.decorator';
import { Response } from 'express';
import { authMessage } from 'src/constant/messages/message-type';
import { KakaoAuthGuard } from './auth.guard';
import { AuthCodeDto, SendCodeDto, AuthCredentialDto } from './dto';
import * as SWAGGER from './auth.swagger';

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
  @ApiOperation({ summary: '카카오 로그인 콜백' })
  async kakaoLogin(@Req() req, @Res() res) {
    // res.cookie('jwt', req.user.token, {
    //   httpOnly: true,
    // });
    res.setHeader('Authorization', 'Bearer' + req.user.token);
    res.redirect(process.env.FRONT_URI);
    // res.redirect('http://localhost:3000');
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
    res.status(200).json({ message: 'logout' });
  }
  //* 회원가입
  @Post('/signup')
  @ApiOperation({ summary: '이메일 가입' })
  @ApiResponse(SWAGGER['Signup']['res'][201])
  async signup(@Body() createUserDto: CreateUserDto): Promise<object> {
    await this.authService.signup(createUserDto);
    return { message: authMessage.SIGNUP_SUCCESS };
  }

  //* 로그인
  @Post('/login')
  // @UseGuards(AuthGuard())
  @UseInterceptors(TransformInterceptor)
  @ApiOperation(SWAGGER['EmailLogin']['op'])
  @ApiResponse(SWAGGER['EmailLogin']['res'][201])
  @ApiResponse(SWAGGER['EmailLogin']['res'][401])
  async login(
    @Body() authCredentialDto: AuthCredentialDto,
    @Res() res: Response,
  ) {
    const accessToken = await this.authService.login(authCredentialDto);
    res.setHeader('Authorization', 'Bearer' + accessToken);
    res
      .status(201)
      .json({ result: res.header, message: authMessage.LOGIN_SUCCESS });
  }

  //*로그 아웃
  @Delete('/logout')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(TransformInterceptor)
  @ApiOperation(SWAGGER['Logout']['op'])
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        jwt: {
          type: 'string',
          example: 'token',
        },
      },
    },
  })
  @ApiResponse(SWAGGER['Logout']['res'][204])
  async logout(@Req() req, @Res() res: Response): Promise<void> {
    // 토큰을 검증하고 사용자를 찾습니다.
    // const token = req.user;
    // const user = await this.authService.findUserByToken(token);

    // if (!user) {
    // throw new UnauthorizedException('Invalid token');
    // }

    // 사용자의 토큰을 무효화합니다.
    // await this.authService.invalidateUserToken(user.id);

    // 성공적인 로그아웃 메시지를 반환합니다.
    res.status(204).json({ message: authMessage.LOGOUT_SUCCESS });
  }

  //* 이메일 인증 코드 발송
  @Post('send-code')
  @UseInterceptors(TransformInterceptor)
  @ApiOperation(SWAGGER['SendCode']['op'])
  @ApiBody(SWAGGER['SendCode']['body'])
  @ApiResponse(SWAGGER['SendCode']['res'][201])
  async sendCodeEmail(@Body() sendCodeDto: SendCodeDto): Promise<object> {
    await this.authService.sendCodeEmail(sendCodeDto);
    return { message: authMessage.CODE_SEND_SUCCESS };
  }

  //* 이메일 인증 확인
  @Get('auth-code')
  @UseInterceptors(TransformInterceptor)
  @ApiOperation(SWAGGER['AuthCode']['op'])
  @ApiResponse(SWAGGER['AuthCode']['res'][200])
  @ApiResponse(SWAGGER['AuthCode']['res'][401])
  async verifyAuthCode(@Query() authCodeDto: AuthCodeDto): Promise<object> {
    const result = await this.authService.verifyAuthCode(authCodeDto);
    return { result };
  }
}
