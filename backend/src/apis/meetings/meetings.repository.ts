import { DataSource, Repository } from 'typeorm';
import { Meeting } from './entities/meeting.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MeetingRepository extends Repository<Meeting> {
  constructor(dataSource: DataSource) {
    super(Meeting, dataSource.createEntityManager());
  }
}
