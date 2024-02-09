import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Participant, ParticipantStatus } from './entity/participant.entity';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { ParticipantRepository } from './participant.repository';

@Injectable()
export class ParticipantService {
  constructor(private participantRepository: ParticipantRepository) {}

  async createParticipant(
    createParticipantDto: CreateParticipantDto,
  ): Promise<Participant> {
    return this.participantRepository.createParticipant(createParticipantDto);
  }

  async participantById(participantId: number): Promise<Participant> {
    return this.participantRepository.getParticipantById(participantId);
  }

  async updateParticipant(
    participantId: number,
    updatedParticipant: Partial<Participant>,
  ): Promise<Participant> {
    return this.participantRepository.updateParticipant(
      participantId,
      updatedParticipant,
    );
  }

  async deleteParticipant(participantId: number): Promise<void> {
    await this.participantRepository.deleteParticipant(participantId);
  }

  // async updateStatus(
  //   participantId: number,
  //   status: Partial<Participant>,
  // ): Promise<Participant> {
  //   const participant = await this.participantRepository.updateParticipant(
  //     participantId,
  //     status,
  //   );
  //   if (!participantId) {
  //     throw new Error('신청이 존재하지 않습니다.');
  //   }

  //   participant.status = status;
  //   return this.participantRepository.save(participant);
  // }

  async getParticipantsByUserId(userId: number): Promise<Participant[]> {
    return this.participantRepository.find({ where: { userId } });
  }
}
