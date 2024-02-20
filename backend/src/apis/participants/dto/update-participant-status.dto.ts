import { IsEnum, IsNotEmpty } from 'class-validator';
import { ParticipantStatus } from '../entity/participant.entity';

export class UpdateParticipantStatusDto {
  @IsNotEmpty()
  participantId: number;

  @IsEnum(ParticipantStatus)
  status: ParticipantStatus;
}
