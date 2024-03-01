import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import {
  MeetingReportRepository,
  UserReportRepository,
} from './reports.repository';
import { UserRepository } from '../users/users.repository';
import { MeetingRepository } from '../meetings/meetings.repository';

@Module({
  controllers: [ReportsController],
  providers: [
    ReportsService,
    MeetingReportRepository,
    UserReportRepository,
    UserRepository,
    MeetingRepository,
  ],
})
export class ReportsModule {}
