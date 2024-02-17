import { Module } from '@nestjs/common';
import { ParticipantController } from './participant.controller';
import { ParticipantService } from './participant.service';
import { ParticipantRepository } from './participant.repository';
import { MeetingsService } from '../meetings/meetings.service';
import { MeetingRepository } from '../meetings/meetings.repository';

@Module({
  controllers: [ParticipantController],
  providers: [
    ParticipantService,
    ParticipantRepository,
    MeetingsService,
    MeetingRepository,
  ],
  exports: [ParticipantService],
})
export class ParticipantModule {}
