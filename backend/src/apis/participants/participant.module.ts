import { Module } from '@nestjs/common';
import { ParticipantController } from './participant.controller';
import { ParticipantService } from './participant.service';
import { ParticipantRepository } from './participant.repository';
import { MeetingsService } from '../meetings/meetings.service';
import { MeetingRepository } from '../meetings/meetings.repository';
import { UserRepository } from '../users/users.repository';
import { CategoryRepository } from '../categories/categories.repository';

@Module({
  controllers: [ParticipantController],
  providers: [
    CategoryRepository,
    ParticipantService,
    ParticipantRepository,
    MeetingsService,
    MeetingRepository,
    UserRepository,
  ],
  exports: [ParticipantService, ParticipantRepository],
})
export class ParticipantModule {}
