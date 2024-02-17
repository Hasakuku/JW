import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { Meeting } from './entities/meeting.entity';
import { MeetingRepository } from './meetings.repository';
import { Sort } from './dto/get-meeting.dto';
import { InterestCategory } from '../users/entities/user.entity';

@Injectable()
export class MeetingsService {
  constructor(private meetingRepository: MeetingRepository) {}

  async createMeetings(createMeetingDto: CreateMeetingDto): Promise<Meeting> {
    const {
      title,
      tag,
      location,
      meeting_date,
      category,
      member_limit,
      description,
    } = createMeetingDto;
    try {
      const result = await this.meetingRepository.query(
        `INSERT INTO meeting (title, tag, location, meeting_date, category, member_limit, description) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
          title,
          tag,
          location,
          meeting_date,
          category,
          member_limit,
          description,
        ],
      );

      return result;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
    // const meeting = new Meeting();
    // const meeting = await this.meetingRepository.create(createMeetingDto);
    // Object.assign(meeting, createMeetingDto);
    // return await this.meetingRepository.save(meeting);
  }

  async getMeetingById(meetingId: number): Promise<Meeting> {
    return await this.meetingRepository.findOne({
      where: { meetingId },
      // relations: ['participants'],
    });
  }
  // async getMeetings1(
  //   category,
  //   keyword,
  //   member_limit,
  //   date,
  //   location,
  // ): Promise<any> {
  //   const query = await this.meetingRepository
  //     .createQueryBuilder('meetings')
  //     .where('meeting.category = :category', { category })
  //     .andWhere('meeting.title LIKE :keyword', { keyword: `%${keyword}%` })
  //     .andWhere('meeting.member_limit <= :member_limit', { member_limit })
  //     .andWhere('meeting.meeting_date >= :date', { date })
  //     .andWhere('meeting.location = :location', { location });

  //   const meetings = await query.getMany();
  //   return meetings;
  // }

  async getMeetings({
    keyword,
    category = InterestCategory.DEFAULT,
    member_min = 0,
    member_max = 100,
    date_start = new Date(),
    date_end = new Date(),
    location,
    sort = Sort.DEFAULT,
    perPage = 9,
    cursorId = 1,
    cursorValue = 0,
  }): Promise<Meeting[]> {
    let query = await this.meetingRepository
      .createQueryBuilder('meeting')
      .leftJoin('meeting.userId', 'user')
      .where(
        'meeting.title LIKE :keyword OR meeting.description LIKE :keyword OR user.username LIKE :keyword',
        { keyword: `%${keyword}%` },
      )
      .andWhere('meeting.member_limit BETWEEN :member_min AND :member_max', {
        member_min,
        member_max,
      })
      .andWhere('meeting.meeting_date BETWEEN :date_start AND :date_end', {
        date_start,
        date_end,
      })
      .andWhere('meeting.location Like :location', { location });

    if (category !== InterestCategory.DEFAULT) {
      query = query.andWhere('meeting.category Like :category', { category });
    }

    if (cursorId && cursorValue) {
      query = query.andWhere('meeting.meetingId < :cursorId', { cursorId });
    }

    switch (sort) {
      case Sort.CURRENT:
        query = query.orderBy('meeting.created_at', 'DESC');
        break;
      // case Sort.COUNT:
      // query = query.orderBy('meeting.participants.length', 'DESC');
      // break;
      default:
        query = query.orderBy('meeting.meetingId', 'ASC');
    }

    query = query.select([
      'meeting.meetingId',
      'meeting.meeting_date',
      'meeting.tag',
      'meeting.title',
      'meeting.member_limit',
      'meeting.created_at',
      'meeting.image',
      'user.username',
    ]);

    const meetings = await query.take(perPage).getMany();

    return meetings;
  }
}
