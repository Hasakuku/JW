import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateParticipantDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  meetingId: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  userId: number;
}
