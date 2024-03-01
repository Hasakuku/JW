import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import {
  MeetingReportRepository,
  UserReportRepository,
} from './reports.repository';
import { UserRepository } from '../users/users.repository';

@Module({
  controllers: [ReportsController],
  providers: [
    ReportsService,
    MeetingReportRepository,
    UserReportRepository,
    UserRepository,
  ],
})
export class ReportsModule {}
