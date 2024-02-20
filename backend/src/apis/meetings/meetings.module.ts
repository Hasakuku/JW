import { Module } from '@nestjs/common';
import { MeetingsController } from './meetings.controller';
import { MeetingsService } from './meetings.service';
import { ParticipantModule } from '../participants/participant.module';
import { MeetingRepository } from './meetings.repository';
import { CategoryModule } from '../categories/categories.module';
import { ParticipantRepository } from '../participants/participant.repository';

@Module({
  imports: [ParticipantModule, CategoryModule],
  controllers: [MeetingsController],
  providers: [MeetingsService, MeetingRepository, ParticipantRepository],
})
export class MeetingsModule {}
