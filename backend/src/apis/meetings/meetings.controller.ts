import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
// import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';
import { Meeting } from './entities/meeting.entity';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ParticipantService } from '../participants/participant.service';
import { TransformInterceptor } from 'src/common/interceptors/response-type.interceptor';

@ApiTags('Meetings')
@Controller('meetings')
export class MeetingsController {
  constructor(
    private meetingsService: MeetingsService,
    private participantService: ParticipantService,
  ) {}

  @Post()
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: '모임 생성' })
  @ApiBody({ type: CreateMeetingDto })
  @ApiResponse({
    status: 201,
    description: '모임 생성 성공',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createMeeting(
    @Body() createMeetingDto: CreateMeetingDto,
  ): Promise<object> {
    await this.meetingsService.createMeetings(createMeetingDto);
    return { message: '모임생성 성공' };
  }

  @Get(':id/participants')
  @UsePipes(ValidationPipe)
  @UseInterceptors(TransformInterceptor)
  @ApiOperation({ summary: '모임의 참가 상태 목록 조회' })
  @ApiParam({ name: 'id', required: true, example: 1 })
  async getParticipantsByMeetingId(@Param('id') id: number): Promise<object> {
    const result = await this.participantService.getParticipantsByMeetingId(id);
    return { result };
  }

  @Get(':id/attenders')
  @UsePipes(ValidationPipe)
  @UseInterceptors(TransformInterceptor)
  @ApiOperation({ summary: '모임의 참가자 목록 조회' })
  @ApiParam({ name: 'id', required: true, example: 1 })
  async getParticipantsAttendingByMeetingId(
    @Param('id') id: number,
  ): Promise<object> {
    const result =
      await this.participantService.getParticipantsAttendingByMeetingId(id);
    return { result };
  }

  // @Post()
  // @UsePipes(ValidationPipe)
  // createBoard(@Body() createBoardDto: CreateBoardDto): Promise<Board> {
  //   return this.boardsService.createBoards(createBoardDto);
  // }
  @Get('/:id')
  @UseInterceptors(TransformInterceptor)
  @ApiOperation({ summary: '모임 상세 조회' })
  @ApiParam({ name: 'id', required: true, example: 1 })
  async getMeetingById(@Param('id', ParseIntPipe) id): Promise<object> {
    const result = await this.meetingsService.getMeetingById(id);
    return { result };
  }
  // @Delete('/:id')
  // deleteBoard(@Param('id', ParseIntPipe) id): Promise<void> {
  //   return this.boardsService.deleteBoard(id);
  // }
  // @Patch('/:id/status')
  // updateBoardStatus(
  //   @Param('id', ParseIntPipe) id,
  //   @Body('status', BoardStatusValidationPipe) status: BoardStatus,
  // ): Promise<Board> {
  //   return this.boardsService.updateBoardStatus(id, status);
  // }
  // @Get()
  // getAllBoards(): Promise<Board[]> {
  //   return this.boardsService.getAllBoards();
  // }
}
