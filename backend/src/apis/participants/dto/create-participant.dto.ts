import { IsEnum, IsNotEmpty } from 'class-validator';
import { ParticipantStatus } from '../entity/participant.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateParticipantDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  meetingId: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ example: 'pending' })
  @IsEnum(ParticipantStatus)
  status?: ParticipantStatus;
}
