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
    return await this.save(participant);
  }

  async getParticipantById(participantId: number): Promise<Participant> {
    return await this.findOne({ where: { participantId } });
  }

  async getParticipantByUserId(userId: number): Promise<Participant[]> {
    return await this.find({ where: { userId } });
  }

  async getParticipantByMeetingId(
    meetingId: number,
  ): Promise<Participant | undefined> {
    return await this.findOne({ where: { meetingId } });
  }

  async updateParticipant(
    participantId: number,
    status: Partial<Participant>,
  ): Promise<object> {
    return await this.update(participantId, status);
  }

  async deleteParticipant(participantId: number): Promise<void> {
    await this.delete(participantId);
  }
}
