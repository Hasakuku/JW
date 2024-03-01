import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { MeetingReport, UserReport } from './entity/reports.entity';

@Injectable()
export class UserReportRepository extends Repository<UserReport> {
  constructor(dataSource: DataSource) {
    super(UserReport, dataSource.createEntityManager());
  }
}

@Injectable()
export class MeetingReportRepository extends Repository<MeetingReport> {
  constructor(dataSource: DataSource) {
    super(MeetingReport, dataSource.createEntityManager());
  }
}
