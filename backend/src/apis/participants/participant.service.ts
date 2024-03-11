import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
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
import { PaginationDto } from 'src/constant/pagination.dto';

@Injectable()
export class ParticipantService {
  constructor(
    private participantRepository: ParticipantRepository,
    private meetingService: MeetingsService,
    private meetingRepository: MeetingRepository,
    private userRepository: UserRepository,
  ) {}

  async createParticipant(
    user: User,
    meetingId: number,
    description: string = '안녕하세요',
  ): Promise<void> {
    const userId = user.userId;
    const getUser = await this.userRepository.findOneBy({ userId });
    const getMeeting = await this.meetingRepository.findOne({
      where: { meetingId },
      relations: ['participants', 'participants.user'],
    });
    if (!getMeeting) {
      throw new NotFoundException(
        `${meetingId}에 해당하는 모임을 찾을 수 없습니다.`,
      );
    }

    const existParticipant = getMeeting.participants.map((participant) => {
      if (user.userId === participant.user.userId) {
        if (
          participant.status === ParticipantStatus.CANCELED ||
          participant.status === ParticipantStatus.REJECTED
        ) {
          this.updateParticipant(
            participant.participantId,
            ParticipantStatus.PENDING,
          );
        } else throw new ConflictException('이미 신청하였습니다.');
      }
    });
    // if (existParticipant) {
    //   await this.updateParticipant(
    //     existParticipant.participantId,
    //     ParticipantStatus.PENDING,
    //   );
    // }

    // const participant = new Participant();
    // participant.user = getUser;
    // participant.meeting = getMeeting;
    // participant.description = description;

    // await this.participantRepository.save(participant);
    // return participant;
  }

  async participantById(participantId: number): Promise<Participant> {
    return this.participantRepository.getParticipantById(participantId);
  }

  async updateParticipant(
    participantId: number,
    updatedParticipant: ParticipantStatus,
    description?: string,
  ): Promise<Participant> {
    const participant = await this.participantRepository.findOne({
      where: { participantId },
      relations: ['meeting'],
    });

    if (!participant) {
      throw new NotFoundException('존재하지 않는 participantId 입니다.');
    }

    if (
      updatedParticipant !== ParticipantStatus.ATTENDED ||
      !(await this.meetingIsFull(participant.meeting.meetingId))
    ) {
      participant.status = updatedParticipant;
      participant.description = description;
      return await this.participantRepository.save(participant);
    } else throw new BadRequestException('잘못된 요청입니다.');
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

  async getParticipantsByUserId(
    userId: number,
    paginationDto: PaginationDto,
  ): Promise<Participant[]> {
    const { page = 1, perPage = 10 } = paginationDto;
    return await this.participantRepository.find({
      where: {
        user: { userId },
        status: In([
          ParticipantStatus.PENDING,
          ParticipantStatus.CANCELED,
          ParticipantStatus.REJECTED,
        ]),
      },
      relations: ['meeting'],
      skip: (page - 1) * perPage,
      take: perPage,
    });
  }
  async getMeetingsByUserId(
    userId: number,
    paginationDto: PaginationDto,
  ): Promise<object[]> {
    const { page = 1, perPage = 10 } = paginationDto;
    const foundParticipant = await this.participantRepository.find({
      where: { user: { userId }, status: ParticipantStatus.ATTENDED },
      relations: ['meeting'],
      skip: (page - 1) * perPage,
      take: perPage,
    });
    const user = await this.userRepository.findOne({ where: { userId } });
    const result = await Promise.all(
      foundParticipant.map(async (participant) => {
        const meetingId = participant.meeting.meetingId;
        const meeting = await this.meetingService.getMeetingById(
          meetingId,
          user,
        );
        return {
          meetingId: meeting.meetingId,
          title: meeting.title,
          categories: meeting.categories,
          image: meeting.image,
          description: meeting.description,
          location: meeting.location,
          meeting_date: meeting.meeting_date,
          member_limit: meeting.member_limit,
          created_at: meeting.created_at,
          host: meeting.host,
          participants_number: meeting.participants.length + 1,
          participants: meeting.participants,
          isLiked: meeting.isLiked ?? false,
        };
      }),
    );

    return result;
  }

  async getParticipantsById(id: number): Promise<Participant> {
    return await this.participantRepository.getParticipantById(id);
  }

  async getParticipantsByMeetingId(
    meetingId: number,
    user: User,
    paginationDto?: PaginationDto,
  ): Promise<Participant[]> {
    const foundMeeting = await this.meetingRepository.findOne({
      where: { meetingId },
      relations: ['user'],
    });

    if (foundMeeting.user.userId !== user.userId) {
      throw new ForbiddenException('접근 권한이 없습니다.');
    }

    const query = await this.participantRepository
      .createQueryBuilder('participant')
      .select([
        'participant.participantId AS participantId',
        'participant.description AS description',
        'participant.status AS status',
        'user.userId AS userId',
        'user.username AS username',
        'user.nickname AS nickname',
        'user.profileImage AS profileImage',
      ])
      .leftJoin('participant.user', 'user')
      .where('participant.meetingId = :meetingId', { meetingId });

    if (paginationDto) {
      const { page = 1, perPage = 10 } = paginationDto;
      const numPage = Number(page);
      const numPerPage = Number(perPage);
      query.skip((numPage - 1) * numPerPage).take(numPerPage);
    }
    const result: Promise<Participant[]> = query.getRawMany();

    return result;
  }

  async getParticipantCountByMeetingId(meetingId: number): Promise<number> {
    const meeting = await this.getParticipantCountByMeetingId(meetingId);
    return meeting;
  }

  async getParticipantsAttendingByMeetingId(
    meetingId: number,
    paginationDto?: PaginationDto,
  ): Promise<Participant[]> {
    const query = await this.participantRepository
      .createQueryBuilder('participant')
      .select([
        'participant.participantId AS participantId',
        'participant.description AS description',
        'user.userId AS userId',
        'user.nickname AS nickname',
        'user.username AS username',
        'user.profileImage AS profileImage',
      ])
      .leftJoin('participant.user', 'user')
      .where('participant.meetingId = :meetingId', { meetingId })
      .andWhere('participant.status = :status', {
        status: ParticipantStatus.ATTENDED,
      });

    if (paginationDto) {
      const { page = 1, perPage = 10 } = paginationDto;
      const numPage = Number(page);
      const numPerPage = Number(perPage);
      query.skip((numPage - 1) * numPerPage).take(numPerPage);
    }

    const result = await query.getRawMany();
    return result;
  }
}
