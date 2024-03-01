import { Injectable } from '@nestjs/common';
import {
  MeetingReportRepository,
  UserReportRepository,
} from './reports.repository';
import {
  CreateMeetingReportDto,
  CreateUserReportDto,
} from './dto/create-reports.dto';
import { MeetingReport, UserReport } from './entity/reports.entity';
import { UserRepository } from '../users/users.repository';
import { MeetingRepository } from '../meetings/meetings.repository';

@Injectable()
export class ReportsService {
  constructor(
    private meetingReportRepository: MeetingReportRepository,
    private userReportRepository: UserReportRepository,
    private userRepository: UserRepository,
    private meetingRepository: MeetingRepository,
  ) {}

  async createMeetingReport(
    createMeetingReportDto: CreateMeetingReportDto,
    userId: number,
    meetingId: number,
  ): Promise<void> {
    const user = await this.userRepository.findOne({ where: { userId } });
    const meeting = await this.meetingRepository.findOne({
      where: { meetingId },
    });
    const report = this.meetingReportRepository.create(createMeetingReportDto);
    report.reporter = user;
    report.meeting = meeting;
    await this.meetingReportRepository.save(report);
    return;
  }

  async findAllMeetingReports(): Promise<MeetingReport[]> {
    return await this.meetingReportRepository.find();
  }

  async createUserReport(
    createUserReportDto: CreateUserReportDto,
    reporterId: number,
    userId: number,
  ): Promise<void> {
    const reporter = await this.userRepository.findOne({
      where: { userId: reporterId },
    });
    const user = await this.userRepository.findOne({ where: { userId } });
    const report = this.userReportRepository.create(createUserReportDto);
    report.reporter = reporter;
    report.reportedUser = user;
    await this.userReportRepository.save(report);
    return;
  }

  async findAllUserReports(): Promise<UserReport[]> {
    return await this.userReportRepository.find();
  }
}
