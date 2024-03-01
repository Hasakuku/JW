import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import {
  CreateMeetingReportDto,
  CreateUserReportDto,
} from './dto/create-reports.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportService: ReportsService) {}

  @Post()
  async createMeetingReport(
    @Body() createReportDto: CreateMeetingReportDto,
    @Req() req,
  ): Promise<object> {
    const userId = req.user.userId;
    await this.reportService.createMeetingReport(createReportDto, userId);
    return { message: '모임 신고 완료' };
  }

  @Get()
  async findAllMeetingReport(): Promise<object> {
    return await this.reportService.findAllMeetingReports();
  }

  @Post()
  async createUserReport(
    @Body() createReportDto: CreateUserReportDto,
    @Req() req,
  ): Promise<object> {
    const userId = req.user.userId;
    await this.reportService.createUserReport(createReportDto, userId);
    return { message: '유저 신고 완료' };
  }

  @Get()
  async findAllUserReport(): Promise<object> {
    return await this.reportService.findAllUserReports();
  }
}
