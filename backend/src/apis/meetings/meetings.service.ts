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
import { ParticipantRepository } from '../participants/participant.repository';
import { MeetingDetailResponse, MeetingListResponse } from './meetings.type';
import { UserRepository } from '../users/users.repository';

@Injectable()
export class MeetingsService {
  constructor(
    private readonly meetingRepository: MeetingRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly participantRepository: ParticipantRepository,
    private readonly userRepository: UserRepository,
  ) {}

  //* 모임 생성
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

  //* 모임 상세 조회
  async getMeetingById(
    meetingId: number,
    user?: User,
  ): Promise<MeetingDetailResponse> {
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

    let isLiked;
    if (user) {
      // isLiked = meeting.likes.some(
      //   (meetingUser) => meetingUser.userId === user.userId,
      // );
      const getUser = await this.userRepository.findOne({
        where: { userId: user.userId },
        relations: ['likes'],
      });

      isLiked = getUser.likes.some(
        (likes) => likes.meetingId === meeting.meetingId,
      );
    }

    meeting.participants = participants;
    const result: MeetingDetailResponse = {
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
      participants_number: meeting.participants.length + 1,
      participants: meeting.participants,
      isLiked: isLiked ?? false,
    };
    return result;
  }

  //* 방장 모임 상세 조회
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

  //* 모임 목록 조회
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
    let getUser;
    if (user)
      getUser = await this.userRepository.findOne({
        where: { userId: user.userId },
        relations: ['likes'],
      });
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

    const numPerPage = Number(perPage);
    const meetings = await query.take(numPerPage).getMany();

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
      let isLiked;
      if (user) {
        // isLiked = meeting.likes.some(
        //   (meetingUser) => meetingUser.userId === user.userId,
        // );
        isLiked = getUser.likes.some(
          (likes) => likes.meetingId === meeting.meetingId,
        );
      }
      const host = {
        userId: meeting.user.userId,
        username: meeting.user.username,
        profileImage: meeting.user.profileImage,
      };
      const result: MeetingListResponse = {
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
        participants_number: meeting.participants.length + 1,
        isLiked: isLiked ?? false,
        isActivated,
      };
      return result;
    });

    return meetingsWithLikes;
  }

  //* 모임 수정
  async updateMeeting(
    meetingId: number,
    user: User,
    updateMeetingDto: UpdateMeetingDto,
  ): Promise<object> {
    const meeting = await this.meetingRepository.findOne({
      where: { meetingId },
      relations: ['user'],
    });
    if (!meeting) {
      throw new NotFoundException(`${meetingId}를 찾을 수 없습니다. `);
    }
    if (user.userId !== meeting.user.userId && user.isAdmin === false) {
      throw new ForbiddenException('권한이 없습니다.');
    }

    const { categories, ...rest } = updateMeetingDto;

    const updatedMeeting = Object.assign(meeting, rest);

    if (categories && Array.isArray(categories)) {
      const getCategories = categories.map(async (categoryId) => {
        return await this.categoryRepository.findOneBy({ categoryId });
      });
      updatedMeeting.categories = await Promise.all(getCategories);
    }
    return await this.meetingRepository.save(updatedMeeting);
    // return await this.meetingRepository.update(meetingId, updatedMeeting);
  }

  //* 모임 삭제
  async deleteMeeting(meetingId: number, user: User): Promise<object> {
    const meeting = await this.meetingRepository.findOne({
      where: { meetingId },
      relations: ['user'],
    });
    if (!meeting) {
      throw new NotFoundException(`${meetingId}를 찾을 수 없습니다. `);
    }
    if (user.userId !== meeting.user.userId && user.isAdmin === false) {
      throw new ForbiddenException('권한이 없습니다.');
    }
    return await this.meetingRepository.delete(meetingId);
  }
}
