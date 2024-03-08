import { Injectable } from '@nestjs/common';
import {
  MeetingReportRepository,
  UserReportRepository,
} from './reports.repository';
import { MeetingReport, UserReport } from './entity/reports.entity';
import { UserRepository } from '../users/users.repository';
import { MeetingRepository } from '../meetings/meetings.repository';
import { PaginationDto } from 'src/constant/pagination.dto';

@Injectable()
export class ReportsService {
  constructor(
    private meetingReportRepository: MeetingReportRepository,
    private userReportRepository: UserReportRepository,
    private userRepository: UserRepository,
    private meetingRepository: MeetingRepository,
  ) {}

  async createMeetingReport(
    content: string,
    userId: number,
    meetingId: number,
  ): Promise<void> {
    const user = await this.userRepository.findOne({ where: { userId } });
    const meeting = await this.meetingRepository.findOne({
      where: { meetingId },
    });

    const report = new MeetingReport();
    report.content = content;
    report.reporter = user;
    report.meeting = meeting;

    await this.meetingReportRepository.save(report);
    return;
  }

  async findAllMeetingReports(
    paginationDto: PaginationDto,
  ): Promise<MeetingReport[]> {
    const { page = 1, perPage = 10 } = paginationDto;
    return await this.meetingReportRepository.find({
      skip: (page - 1) * perPage,
      take: perPage,
    });
  }

  async createUserReport(
    content: string,
    reporterId: number,
    userId: number,
  ): Promise<void> {
    const reporter = await this.userRepository.findOne({
      where: { userId: reporterId },
    });
    const user = await this.userRepository.findOne({ where: { userId } });
    const report = new UserReport();
    report.content = content;
    report.reporter = reporter;
    report.reportedUser = user;
    await this.userReportRepository.save(report);
    return;
  }

  async findAllUserReports(
    paginationDto: PaginationDto,
  ): Promise<UserReport[]> {
    const { page = 1, perPage = 10 } = paginationDto;
    return await this.userReportRepository.find({
      skip: (page - 1) * perPage,
      take: perPage,
    });
  }
}
