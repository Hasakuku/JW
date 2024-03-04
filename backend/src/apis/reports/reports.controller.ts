import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportService: ReportsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/meetings')
  @ApiBearerAuth('jwt')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        category: { type: 'string' },
        content: { type: 'string' },
        meetingId: { type: 'number' },
      },
      required: ['content'],
      example: {
        content: '스팸',
      },
    },
  })
  async createMeetingReport(
    @Body('content') content: string,
    @Body('meetingId') meetingId: number,
    @Req() req,
  ): Promise<object> {
    const reporterId = req.user.userId;
    await this.reportService.createMeetingReport(
      content,
      reporterId,
      meetingId,
    );
    return { message: '모임 신고 완료' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/meetings')
  @ApiBearerAuth('jwt')
  async findAllMeetingReport(): Promise<object> {
    return await this.reportService.findAllMeetingReports();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/users')
  @ApiBearerAuth('jwt')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        category: { type: 'string' },
        content: { type: 'string' },
        userId: { type: 'number' },
      },
      required: ['category', 'content'],
      example: {
        category: '스팸',
        content: '예시 설명',
        userId: '1',
      },
    },
  })
  async createUserReport(
    @Body('content') content: string,
    @Body('userId') userId: number,
    @Req() req,
  ): Promise<object> {
    const reporterId = req.user.userId;
    await this.reportService.createUserReport(content, reporterId, userId);
    return { message: '유저 신고 완료' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/users')
  @ApiBearerAuth('jwt')
  async findAllUserReport(): Promise<object> {
    return await this.reportService.findAllUserReports();
  }
}
