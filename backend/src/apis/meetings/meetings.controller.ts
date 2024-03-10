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
  Res,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { CreateMeetingDto, UpdateMeetingDto } from './dto/create-meeting.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
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
import { PaginationDto } from 'src/constant/pagination.dto';

@ApiTags('Meetings')
@Controller('meetings')
export class MeetingsController {
  constructor(
    private meetingsService: MeetingsService,
    private participantService: ParticipantService,
    private userService: UserService,
  ) {}
  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  @UsePipes(ValidationPipe)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: '모임 삭제' })
  @ApiResponse({
    status: 201,
    description: '모임 삭제 성공',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'UnAuthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  async deleteMeeting(
    @Param('id') meetingId: number,
    @Req() req,
  ): Promise<object> {
    const user = req.user;
    await this.meetingsService.deleteMeeting(meetingId, user);
    return { message: '모임 삭제 성공' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/:id')
  @UsePipes(ValidationPipe)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: '모임 수정' })
  @ApiBody({ type: UpdateMeetingDto })
  @ApiResponse({
    status: 201,
    description: '모임 수정 성공',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'UnAuthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  async updateMeeting(
    @Body(new ValidationPipe({ transform: true }))
    updateMeeting: UpdateMeetingDto,
    @Param('id') meetingId: number,
    @Req() req,
  ): Promise<object> {
    const user = req.user;
    await this.meetingsService.updateMeeting(meetingId, user, updateMeeting);
    return { message: '모임 수정 성공' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UsePipes(ValidationPipe)
  @ApiBearerAuth('jwt')
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
    return { message: '모임 생성 성공' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/:id/like')
  @UsePipes(ValidationPipe)
  @UseInterceptors(TransformInterceptor)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: '좋아요 추가' })
  @ApiParam({ name: 'id', required: true, example: 1 })
  async addLike(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<object> {
    await this.userService.addLike(req.user.userId, id);
    return { message: '좋아요 추가 성공' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id/like')
  @UsePipes(ValidationPipe)
  @UseInterceptors(TransformInterceptor)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: '좋아요 삭제' })
  @ApiParam({ name: 'id', required: true, example: 1 })
  async removeLike(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<object> {
    await this.userService.removeLike(req.user.userId, id);
    return { message: '좋아요 삭제 성공' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/participants')
  @ApiBearerAuth('jwt')
  // @UsePipes(ValidationPipe)
  @UseInterceptors(TransformInterceptor)
  @ApiOperation({ summary: '모임의 참가 상태 목록 조회' })
  @ApiParam({ name: 'id', required: true, example: 1 })
  async getParticipantsByMeetingId(
    @Param('id', ParseIntPipe) id: number,
    @Query() paginationDto: PaginationDto,
    @Req() req,
  ): Promise<object> {
    const user = req.user;
    const result = await this.participantService.getParticipantsByMeetingId(
      id,
      user,
      paginationDto,
    );
    return { result };
  }

  @Get(':id/attenders')
  // @UsePipes(ValidationPipe)
  @UseInterceptors(TransformInterceptor)
  @ApiOperation({ summary: '모임의 참가자 목록 조회' })
  @ApiParam({ name: 'id', required: true, example: 1 })
  async getParticipantsAttendingByMeetingId(
    @Param('id', ParseIntPipe) id: number,
    @Query() paginationDto?: PaginationDto,
  ): Promise<object> {
    const result =
      await this.participantService.getParticipantsAttendingByMeetingId(
        id,
        paginationDto,
      );
    return { result };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:id/host')
  @UseInterceptors(TransformInterceptor)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: '방장 모임 상세 조회' })
  @ApiParam({ name: 'id', required: true, example: 1 })
  async getMeetingDetailByHost(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<object> {
    const result = await this.meetingsService.getMeetingDetailByHost(
      id,
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
  @ApiBearerAuth('jwt')
  @ApiParam({ name: 'id', required: true, example: 1 })
  async getMeetingById(
    @Param('id', ParseIntPipe) id,
    @Req() req,
  ): Promise<object> {
    let user;
    // const token = req.cookies['jwt'];
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      user = verify(token, process.env.JWT_SECRET);
    }
    const result = await this.meetingsService.getMeetingById(id, user);
    return { result };
  }

  @Get()
  @UseInterceptors(TransformInterceptor)
  @ApiOperation({ summary: '모임 목록 조회' })
  @ApiBearerAuth('jwt')
  async getMeetings(
    @Req() req,
    @Query(GetMeetingsPipe)
    getMeetingsDto: GetMeetingsDto,
  ): Promise<object> {
    let user;
    // const token = req.cookies['jwt'];
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      user = verify(token, process.env.JWT_SECRET);
    }
    const result = await this.meetingsService.getMeetings(getMeetingsDto, user);
    return { result };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('test')
  async test(@Req() req, @Res() res) {
    res.json(req.user);
  }
}
