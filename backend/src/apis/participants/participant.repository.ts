import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Participant } from './entity/participant.entity';

@Injectable()
export class ParticipantRepository extends Repository<Participant> {
  constructor(dataSource: DataSource) {
    super(Participant, dataSource.createEntityManager());
  }

  async getParticipantById(participantId: number): Promise<Participant> {
    return await this.findOne({ where: { participantId } });
  }

  async getParticipantByUserId(userId: number): Promise<Participant[]> {
    return await this.find({ where: { user: { userId } } });
  }

  async getParticipantByMeetingId(
    meetingId: number,
  ): Promise<Participant | undefined> {
    return await this.findOne({ where: { meeting: { meetingId } } });
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
