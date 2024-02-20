import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
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
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ParticipantService } from '../participants/participant.service';
import { TransformInterceptor } from 'src/common/interceptors/response-type.interceptor';
import { GetMeetingsDto } from './dto/get-meeting.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetMeetingsPipe } from './pipes/getMeetings.pipe';
import { UserService } from '../users/users.service';
import { verify } from 'jsonwebtoken';

@ApiTags('Meetings')
@Controller('meetings')
export class MeetingsController {
  constructor(
    private meetingsService: MeetingsService,
    private participantService: ParticipantService,
    private userService: UserService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
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
    @Body(new ValidationPipe({ transform: true }))
    createMeetingDto: CreateMeetingDto,
    @Req() req,
  ): Promise<object> {
    const user = req.user;
    await this.meetingsService.createMeetings(user, createMeetingDto);
    return { message: '모임생성 성공' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/:id/like')
  @UsePipes(ValidationPipe)
  @UseInterceptors(TransformInterceptor)
  @ApiOperation({ summary: '좋아요 추가' })
  @ApiParam({ name: 'id', required: true, example: 1 })
  async addLike(
    @Req() req,
    @Param('meetingId') meetingId: number,
  ): Promise<object> {
    await this.userService.addLike(req.user.userId, meetingId);
    return { message: '좋아요 추가 성공' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id/like')
  @UsePipes(ValidationPipe)
  @UseInterceptors(TransformInterceptor)
  @ApiOperation({ summary: '좋아요 삭제' })
  @ApiParam({ name: 'id', required: true, example: 1 })
  async removeLike(
    @Req() req,
    @Param('meetingId') meetingId: number,
  ): Promise<object> {
    await this.userService.removeLike(req.user.userId, meetingId);
    return { message: '좋아요 삭제 성공' };
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

  @UseGuards(AuthGuard('jwt'))
  @Get('/:id/host')
  @UseInterceptors(TransformInterceptor)
  @ApiOperation({ summary: '방장 모임 상세 조회' })
  @ApiParam({ name: 'id', required: true, example: 1 })
  async getMeetingDetailByHost(
    @Req() req,
    @Param('id') meetingId: number,
  ): Promise<object> {
    const result = await this.meetingsService.getMeetingDetailByHost(
      meetingId,
      req.user,
    );
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
  async getMeetingById(
    @Param('id', ParseIntPipe) id,
    @Req() req,
  ): Promise<object> {
    let user;
    const token = req.cookies['jwt'];

    if (token) {
      user = verify(token, process.env.JWT_SECRET);
    }
    const result = await this.meetingsService.getMeetingById(id, user);
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
  @Get()
  @UseInterceptors(TransformInterceptor)
  @ApiOperation({ summary: '모임 조회' })
  // @ApiQuery({ type: GetMeetingsDto })
  async getMeetings(
    @Req() req,
    @Query(GetMeetingsPipe)
    getMeetingsDto: GetMeetingsDto,
  ): Promise<object> {
    let user;
    const token = req.cookies['jwt'];

    if (token) {
      user = verify(token, process.env.JWT_SECRET);
    }
    const result = await this.meetingsService.getMeetings(getMeetingsDto, user);
    return { result };
  }
}
