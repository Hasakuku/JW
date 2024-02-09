import { IsEnum, IsNotEmpty } from 'class-validator';
import { ParticipantStatus } from '../entity/participant.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateParticipantStatusDto {
  @ApiProperty({ example: 2 })
  @IsNotEmpty()
  participantId: number;

  @ApiProperty({ example: ParticipantStatus.ATTENDED })
  @IsEnum(ParticipantStatus)
  status: ParticipantStatus;
}
