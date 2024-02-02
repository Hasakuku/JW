import { ApiProperty } from '@nestjs/swagger';
import { authMessage } from '../messages/message-type';

export class SuccessResponse {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;
}

export class Login extends SuccessResponse {
  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ example: authMessage.LOGIN_SUCCESS })
  message: string;
}

export class Authorized extends SuccessResponse {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'true' })
  data: boolean;

  @ApiProperty({ example: authMessage.CODE_AUTHORIZED })
  message: string;
}

export class CodeSend extends SuccessResponse {
  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ example: authMessage.CODE_SEND_SUCCESS })
  message: string;
}
