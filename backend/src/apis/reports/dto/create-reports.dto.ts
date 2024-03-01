import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ReportCategory } from '../entity/reports.entity';
import { User } from 'src/apis/users/entities/user.entity';
import { Meeting } from 'src/apis/meetings/entities/meeting.entity';

export class CreateUserReportDto {
  @IsNotEmpty()
  @IsEnum(ReportCategory)
  category: ReportCategory;

  @IsNotEmpty()
  @IsString()
  content: string;
}

export class CreateMeetingReportDto {
  @IsNotEmpty()
  @IsEnum(ReportCategory)
  category: ReportCategory;

  @IsNotEmpty()
  @IsString()
  content: string;
}
