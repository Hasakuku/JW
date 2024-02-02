import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
// import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';
import { Meeting } from './entities/meeting.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Meetings')
@Controller('meetings')
export class MeetingsController {
  constructor(private meetingsService: MeetingsService) {}

  @Post()
  @UsePipes(ValidationPipe)
  createMeeting(@Body() createMeetingDto: CreateMeetingDto): Promise<Meeting> {
    return this.meetingsService.createMeetings(createMeetingDto);
  }

  // @Post()
  // @UsePipes(ValidationPipe)
  // createBoard(@Body() createBoardDto: CreateBoardDto): Promise<Board> {
  //   return this.boardsService.createBoards(createBoardDto);
  // }
  // @Get('/:id')
  // getBoardById(@Param('id', ParseIntPipe) id): Promise<Board> {
  //   return this.boardsService.getBoardById(id);
  // }
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
