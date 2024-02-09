import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Participant } from './entity/participant.entity';
import { CreateParticipantDto } from './dto/create-participant.dto';

@Injectable()
export class ParticipantRepository extends Repository<Participant> {
  constructor(dataSource: DataSource) {
    super(Participant, dataSource.createEntityManager());
  }

  async createParticipant(
    createParticipantDto: CreateParticipantDto,
  ): Promise<Participant> {
    const participant = this.create(createParticipantDto);
    return this.save(participant);
  }

  async getParticipantById(participantId: number): Promise<Participant> {
    return this.findOne({ where: { participantId } });
  }

  async getParticipantByUserId(
    userId: number,
  ): Promise<Participant | undefined> {
    return this.findOne({ where: { userId } });
  }

  async getParticipantByMeetingId(
    meetingId: number,
  ): Promise<Participant | undefined> {
    return this.findOne({ where: { meetingId } });
  }

  async updateParticipant(
    participantId: number,
    status: Partial<Participant>,
  ): Promise<Participant> {
    await this.update(participantId, status);
    return this.findOne({ where: { participantId } });
  }

  async deleteParticipant(participantId: number): Promise<void> {
    await this.delete(participantId);
  }
}
