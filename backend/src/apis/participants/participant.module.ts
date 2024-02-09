import { Module } from '@nestjs/common';
import { ParticipantController } from './participant.controller';
import { ParticipantService } from './participant.service';
import { ParticipantRepository } from './participant.repository';
import { Repository } from 'typeorm';
import { MeetingsService } from '../meetings/meetings.service';

@Module({
  controllers: [ParticipantController],
  providers: [ParticipantService, ParticipantRepository, MeetingsService],
  exports: [ParticipantService],
})
export class ParticipantModule {}
