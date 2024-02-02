import { ApiProperty } from '@nestjs/swagger';
import { ErrorResponse } from './response-type';
import { authMessage } from '../messages/message-type';

export class Unauthorized extends ErrorResponse {
  @ApiProperty({ example: 401 })
  statusCode: number;

  @ApiProperty({ example: 'Unauthorized' })
  error: string;

  @ApiProperty({ example: '인증 오류' })
  message: string;
}

export class CodeUnauthorized extends ErrorResponse {
  @ApiProperty({ example: 401 })
  statusCode: number;

  @ApiProperty({ example: 'Unauthorized' })
  error: string;

  @ApiProperty({
    example: `${authMessage.CODE_UNAUTHORIZED} | ${authMessage.CODE_UNAUTHORIZED}`,
  })
  message: string;
}
