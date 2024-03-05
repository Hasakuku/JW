import { Module } from '@nestjs/common';
import { MeetingsController } from './meetings.controller';
import { MeetingsService } from './meetings.service';
import { ParticipantModule } from '../participants/participant.module';
import { MeetingRepository } from './meetings.repository';
import { CategoryModule } from '../categories/categories.module';
import { ParticipantRepository } from '../participants/participant.repository';
import { UsersModule } from '../users/users.module';
import { UserRepository } from '../users/users.repository';

@Module({
  imports: [ParticipantModule, CategoryModule, UsersModule],
  controllers: [MeetingsController],
  providers: [
    MeetingsService,
    MeetingRepository,
    ParticipantRepository,
    UserRepository,
  ],
})
export class MeetingsModule {}
