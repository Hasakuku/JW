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

@Injectable()
export class ReportsService {
  constructor(
    private meetingReportRepository: MeetingReportRepository,
    private userReportRepository: UserReportRepository,
    private userRepository: UserRepository,
  ) {}

  async createMeetingReport(
    createMeetingReportDto: CreateMeetingReportDto,
    userId: number,
  ): Promise<void> {
    const user = await this.userRepository.findOne({ where: { userId } });
    const report = this.meetingReportRepository.create(createMeetingReportDto);
    report.reporter = user;
    await this.meetingReportRepository.save(report);
    return;
  }

  async findAllMeetingReports(): Promise<MeetingReport[]> {
    return await this.meetingReportRepository.find();
  }

  async createUserReport(
    createUserReportDto: CreateUserReportDto,
    userId: number,
  ): Promise<void> {
    const user = await this.userRepository.findOne({ where: { userId } });
    const report = this.userReportRepository.create(createUserReportDto);
    report.reporter = user;
    await this.userReportRepository.save(report);
    return;
  }

  async findAllUserReports(): Promise<UserReport[]> {
    return await this.userReportRepository.find();
  }
}
