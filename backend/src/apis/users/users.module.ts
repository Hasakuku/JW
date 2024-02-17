import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UsersController } from './users.controller';
import { ParticipantModule } from '../participants/participant.module';
import { UserRepository } from './users.repository';

@Module({
  imports: [ParticipantModule],
  controllers: [UsersController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UsersModule {}
