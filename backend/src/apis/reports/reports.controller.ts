import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PaginationDto } from 'src/constant/pagination.dto';

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
        meetingId: 1,
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
  @ApiQuery({ type: PaginationDto })
  async findAllMeetingReport(paginationDto: PaginationDto): Promise<object> {
    return await this.reportService.findAllMeetingReports(paginationDto);
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
        content: '예시 설명',
        userId: 1,
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
  @ApiQuery({ type: PaginationDto })
  async findAllUserReport(paginationDto: PaginationDto): Promise<object> {
    return await this.reportService.findAllUserReports(paginationDto);
  }
}
