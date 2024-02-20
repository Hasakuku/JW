import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMeetingDto, UpdateMeetingDto } from './dto/create-meeting.dto';
import { Meeting } from './entities/meeting.entity';
import { MeetingRepository } from './meetings.repository';
import { GetMeetingsDto } from './dto/get-meeting.dto';
import { User } from '../users/entities/user.entity';

import { CategoryRepository } from '../categories/categories.repository';
import { ParticipantService } from '../participants/participant.service';
import { ParticipantRepository } from '../participants/participant.repository';
import { Category } from '../categories/entity/categories.entity';

interface MeetingResponse {
  meetingId: number;
  title: string;
  categories: Category[]; // 카테고리의 타입이 무엇인지에 따라 변경될 수 있습니다.
  image: string;
  description: string;
  location: string;
  meeting_date: Date;
  member_limit: number;
  created_at: Date;
  host: User; // 'User'는 사용자 정보를 담는 타입입니다. 실제 사용자 정보의 형태에 따라 변경될 수 있습니다.
  participants_number: number;
  isLiked: boolean;
}
@Injectable()
export class MeetingsService {
  constructor(
    private readonly meetingRepository: MeetingRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly participantRepository: ParticipantRepository,
  ) {}

  async createMeetings(
    user: User,
    createMeetingDto: CreateMeetingDto,
  ): Promise<Meeting> {
    const meeting = new Meeting();
    const { categories, ...rest } = createMeetingDto;
    Object.assign(meeting, rest);
    meeting.user = user;
    if (categories && Array.isArray(categories)) {
      const getCategories = categories.map(async (categoryId) => {
        return await this.categoryRepository.findOneBy({ categoryId });
      });
      meeting.categories = await Promise.all(getCategories);
    }
    return await this.meetingRepository.save(meeting);
  }

  async getMeetingById(
    meetingId: number,
    user?: User,
  ): Promise<MeetingResponse> {
    const meeting = await this.meetingRepository.findOne({
      where: { meetingId },
      relations: ['categories', 'user', 'likes'],
    });
    const participants = await this.participantRepository
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
        status: 'attended',
      })
      .getRawMany();

    const isLiked = meeting.likes.some(
      (meetingUser) => meetingUser.userId === user.userId,
    );

    meeting.participants = participants;
    const result: MeetingResponse = {
      meetingId: meeting.meetingId,
      title: meeting.title,
      categories: meeting.categories,
      image: meeting.image,
      description: meeting.description,
      location: meeting.location,
      meeting_date: meeting.meeting_date,
      member_limit: meeting.member_limit,
      created_at: meeting.created_at,
      host: meeting.user,
      participants_number: meeting.participants.length,
      isLiked,
    };
    return result;
  }

  async getMeetingDetailByHost(
    meetingId: number,
    user: User,
  ): Promise<Meeting> {
    const meeting = await this.meetingRepository.findOne({
      where: { meetingId },
      relations: ['participants', 'categories', 'user'],
    });
    if (meeting.user.userId !== user.userId) {
      throw new ForbiddenException('권한이 없습니다.');
    }
    return meeting;
  }

  async getMeetings(
    {
      keyword,
      categories,
      member_min,
      member_max,
      date_start,
      date_end,
      location,
      sort,
      perPage,
      cursorId,
    }: GetMeetingsDto,
    user?: User,
  ) {
    let query = this.meetingRepository
      .createQueryBuilder('meeting')
      .leftJoinAndSelect('meeting.user', 'user')
      .leftJoinAndSelect(
        'meeting.participants',
        'participant',
        'participant.status = :status',
        { status: 'attended' },
      )
      .leftJoinAndSelect('meeting.likes', 'likes')
      .leftJoinAndSelect('meeting.categories', 'categories')
      .andWhere(`(meeting.member_limit BETWEEN :member_min AND :member_max)`, {
        member_min,
        member_max,
      })
      .andWhere('meeting.meeting_date BETWEEN :date_start AND :date_end', {
        date_start,
        date_end,
      });
    if (categories && categories.length !== 0) {
      query = query.andWhere('categories.categoryId IN (:...categories)', {
        categories,
      });
    }
    if (keyword) {
      query = query.andWhere(
        '(meeting.title LIKE :keyword OR meeting.description LIKE :keyword OR user.username LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    if (location) {
      query = query.andWhere('meeting.location LIKE :location', {
        location: `%${location}%`,
      });
    }

    switch (sort) {
      case 'default':
        query = query.orderBy('meeting.created_at', 'ASC');
        if (cursorId)
          query.andWhere('meeting.meetingId > :cursorId', {
            cursorId: cursorId,
          });
        break;
      case 'current':
        query = query.orderBy('meeting.created_at', 'DESC');
        if (cursorId)
          query.andWhere('meeting.meetingId < :cursorId', {
            cursorId: cursorId,
          });
        break;
      case 'count':
        query = query
          .orderBy('meeting.member_limit', 'DESC')
          .addOrderBy('meeting.meetingId', 'ASC');
        if (cursorId)
          query.andWhere('meeting.meetingId > :cursorId', {
            cursorId: cursorId,
          });
        break;
    }

    const meetings = await query.take(perPage).getMany();

    const meetingsWithAllCategories = await Promise.all(
      meetings.map(async (meeting) => {
        const categories = await this.meetingRepository
          .createQueryBuilder('meeting')
          .relation(Meeting, 'categories')
          .of(meeting)
          .loadMany();
        return { ...meeting, categories };
      }),
    );

    const meetingsWithLikes = meetingsWithAllCategories.map((meeting) => {
      const meetingDate = new Date(meeting.meeting_date);
      const now = new Date();

      const isActivated = !(
        meetingDate.getFullYear() < now.getFullYear() ||
        (meetingDate.getFullYear() === now.getFullYear() &&
          meetingDate.getMonth() < now.getMonth()) ||
        (meetingDate.getFullYear() === now.getFullYear() &&
          meetingDate.getMonth() === now.getMonth() &&
          meetingDate.getDate() < now.getDate())
      );
      const isLiked = meeting.likes.some(
        (meetingUser) => meetingUser.userId === user.userId,
      );
      const host = {
        userId: meeting.user.userId,
        username: meeting.user.username,
        profileImage: meeting.user.profileImage,
      };
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
        host,
        participants_number: meeting.participants.length,
        isLiked,
        isActivated,
      };
    });
    console.log(user);
    return meetingsWithLikes;
  }

  async updateMeeting(
    meetingId: number,
    updateMeetingDto: UpdateMeetingDto,
  ): Promise<Meeting> {
    const meeting = await this.meetingRepository.findOneBy({ meetingId });
    if (!meeting) {
      throw new NotFoundException(`${meetingId}를 찾을 수 없습니다. `);
    }

    const updatedMeeting = Object.assign(meeting, updateMeetingDto);
    return await this.meetingRepository.save(updatedMeeting);
  }
}
