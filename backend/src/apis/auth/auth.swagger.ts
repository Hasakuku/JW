import { CodeUnauthorized } from 'src/constant/swagger/response-type-401';
import {
  Authorized,
  CodeSend,
  Login,
} from 'src/constant/swagger/response-type-success';
import { SendCodeDto } from './dto/send-code.dto';
import { authMessage } from 'src/constant/messages/message-type';
import { LoginUnauthorized } from 'src/constant/swagger/response-type-404';
import { Swagger } from 'src/constant/swagger/swagger.type';

export const AuthCode: Swagger = {
  op: { summary: '코드 인증' },
  res: {
    200: {
      status: 200,
      description: '코드 인증 완료',
      type: Authorized,
    },
    401: {
      status: 401,
      description: '인증 오류',
      type: CodeUnauthorized,
    },
  },
};

export const SendCode: Swagger = {
  op: { summary: '인증 코드 발송' },
  body: {
    type: SendCodeDto,
    description: '이메일 인증 코드 발송 type: [signup, resetPW]',
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
  },
  res: {
    201: {
      status: 201,
      description: authMessage.CODE_SEND_SUCCESS,
      type: CodeSend,
    },
  },
};

export const Logout: Swagger = {
  op: { summary: '로그 아웃' },
  res: {
    204: {
      status: 204,
      description: '사용자 로그 아웃',
    },
  },
};

export const EmailLogin: Swagger = {
  op: { summary: '이메일 로그인' },
  res: {
    201: {
      status: 201,
      description: '사용자 로그인 (쿠키에 JWT 토큰 생성)',
      type: Login,
    },
    401: {
      status: 401,
      description: authMessage.LOGIN_FAILED,
      type: LoginUnauthorized,
    },
  },
};

export const Signup: Swagger = {
  op: { summary: '이메일 가입' },
  res: {
    201: { status: 201, description: '사용자 등록' },
  },
};
