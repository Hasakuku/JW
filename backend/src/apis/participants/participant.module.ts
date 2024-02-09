import { Module } from '@nestjs/common';
import { ParticipantController } from './participant.controller';
import { ParticipantService } from './participant.service';
import { ParticipantRepository } from './participant.repository';
import { Repository } from 'typeorm';

@Module({
  controllers: [ParticipantController],
  providers: [ParticipantService, ParticipantRepository],
  exports: [ParticipantService],
})
export class ParticipantModule {}
