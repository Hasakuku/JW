import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UsersController } from './users.controller';
import { ParticipantModule } from '../participants/participant.module';
import { UserRepository } from './users.repository';
import { CategoryRepository } from '../categories/categories.repository';
import { MeetingRepository } from '../meetings/meetings.repository';

@Module({
  imports: [ParticipantModule],
  controllers: [UsersController],
  providers: [
    UserService,
    UserRepository,
    CategoryRepository,
    MeetingRepository,
  ],
  exports: [UserService, UserRepository],
})
export class UsersModule {}
