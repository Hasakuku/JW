import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Participant, ParticipantStatus } from './entity/participant.entity';
import { ParticipantRepository } from './participant.repository';
import { In } from 'typeorm';
import { MeetingsService } from '../meetings/meetings.service';
import { UserRepository } from '../users/users.repository';
import { MeetingRepository } from '../meetings/meetings.repository';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ParticipantService {
  constructor(
    private participantRepository: ParticipantRepository,
    private meetingService: MeetingsService,
    private meetingRepository: MeetingRepository,
    private userRepository: UserRepository,
  ) {}

  async createParticipant(user: User, meetingId: number): Promise<Participant> {
    const userId = user.userId;
    const getUser = await this.userRepository.findOneBy({ userId });
    const getMeeting = await this.meetingRepository.findOneBy({ meetingId });

    const participant = new Participant();
    participant.user = getUser;
    participant.meeting = getMeeting;

    await this.participantRepository.save(participant);
    return participant;
  }
  async participantById(participantId: number): Promise<Participant> {
    return this.participantRepository.getParticipantById(participantId);
  }

  async updateParticipant(
    participantId: number,
    updatedParticipant: ParticipantStatus,
  ): Promise<Participant> {
    const participant = await this.participantRepository.findOne({
      where: { participantId },
      relations: ['meetingId'],
    });
    if (!participant) {
      throw new NotFoundException('존재하지 않는 participantId 입니다.');
    }

    if (
      updatedParticipant !== ParticipantStatus.ATTENDED ||
      !this.meetingIsFull(participant.meeting.meetingId)
    ) {
      participant.status = updatedParticipant;
      return await this.participantRepository.save(participant);
    }
    throw new BadRequestException('잘못된 요청입니다.');
  }

  async meetingIsFull(meetingId: number): Promise<boolean> {
    const meeting = await this.meetingService.getMeetingById(meetingId);
    const participants =
      await this.getParticipantsAttendingByMeetingId(meetingId);
    return participants.length >= meeting.member_limit;
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
    return this.participantRepository.find({
      where: {
        user: { userId },
        status: In([
          ParticipantStatus.PENDING,
          ParticipantStatus.CANCELED,
          ParticipantStatus.REJECTED,
        ]),
      },
    });
  }
  async getMeetingsByUserId(userId: number): Promise<Participant[]> {
    return this.participantRepository.find({
      where: { user: { userId }, status: ParticipantStatus.ATTENDED },
    });
  }

  async getParticipantsById(id: number): Promise<Participant> {
    return await this.participantRepository.getParticipantById(id);
  }

  // async getParticipantsByMeetingId(meetingId: number): Promise<Participant[]> {
  //   return this.participantRepository.find({
  //     where: {
  //       meetingId,
  //     },
  //     select: ['participantId', 'status', 'userId'],
  //     relations: ['userId'],
  //   });
  // }
  async getParticipantsByMeetingId(meetingId: number): Promise<Participant[]> {
    return this.participantRepository
      .createQueryBuilder('participant')
      .select([
        'participant.participantId AS participantId',
        'participant.status AS status',
        'user.userId AS userId',
      ])
      .leftJoin('participant.userId', 'user')
      .where('participant.meetingId = :meetingId', { meetingId })
      .getRawMany();
  }

  async getParticipantCountByMeetingId(meetingId: number): Promise<number> {
    const meeting = await this.getParticipantCountByMeetingId(meetingId);
    return meeting;
  }

  // async getParticipantsAttendingByMeetingId(
  //   meetingId: number,
  // ): Promise<Participant[]> {
  //   return this.participantRepository.find({
  //     where: { meetingId, status: ParticipantStatus.ATTENDED },
  //     select: ['participantId', 'status', 'userId'],
  //     relations: ['userId'],
  //   });
  // }
  async getParticipantsAttendingByMeetingId(
    meetingId: number,
  ): Promise<Participant[]> {
    return this.participantRepository
      .createQueryBuilder('participant')
      .select([
        'participant.participantId AS participantId',
        'user.userId AS userId',
        'user.nickname AS nickname',
        'user.profileImage AS profileImage',
      ])
      .leftJoin('participant.user', 'user')
      .where('participant.meetingId = :meetingId', { meetingId })
      .andWhere('participant.status = :status', {
        status: ParticipantStatus.ATTENDED,
      })
      .getRawMany();
  }
}
