import { Module } from '@nestjs/common';
import { MeetingsController } from './meetings.controller';
import { MeetingsService } from './meetings.service';
import { ParticipantModule } from '../participants/participant.module';
import { MeetingRepository } from './meetings.repository';

@Module({
  imports: [ParticipantModule],
  controllers: [MeetingsController],
  providers: [MeetingsService, MeetingRepository],
})
export class MeetingsModule {}
