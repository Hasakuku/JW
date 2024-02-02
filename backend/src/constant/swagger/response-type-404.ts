import { ApiProperty } from '@nestjs/swagger';
import { ErrorResponse } from './response-type';
import { authMessage } from '../messages/message-type';

export class LoginUnauthorized extends ErrorResponse {
  @ApiProperty({ example: 404 })
  statusCode: number;

  @ApiProperty({ example: 'NotFound' })
  error: string;

  @ApiProperty({ example: authMessage.LOGIN_FAILED })
  message: string;
}
