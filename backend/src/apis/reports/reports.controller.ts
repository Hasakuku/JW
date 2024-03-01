import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import {
  CreateMeetingReportDto,
  CreateUserReportDto,
} from './dto/create-reports.dto';
import { ReportsService } from './reports.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportService: ReportsService) {}

  @Post('/meetings')
  async createMeetingReport(
    @Body() createReportDto: CreateMeetingReportDto,
    @Body('meetingId') meetingId: number,
    @Req() req,
  ): Promise<object> {
    const reporterId = req.user.userId;
    await this.reportService.createMeetingReport(
      createReportDto,
      reporterId,
      meetingId,
    );
    return { message: '모임 신고 완료' };
  }

  @Get('/meetings')
  async findAllMeetingReport(): Promise<object> {
    return await this.reportService.findAllMeetingReports();
  }

  @Post('/users')
  async createUserReport(
    @Body() createReportDto: CreateUserReportDto,
    @Body('userId') userId: number,
    @Req() req,
  ): Promise<object> {
    const reporterId = req.user.userId;
    await this.reportService.createUserReport(
      createReportDto,
      reporterId,
      userId,
    );
    return { message: '유저 신고 완료' };
  }

  @Get('/users')
  async findAllUserReport(): Promise<object> {
    return await this.reportService.findAllUserReports();
  }
}
