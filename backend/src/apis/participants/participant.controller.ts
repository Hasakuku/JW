import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ParticipantService } from './participant.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Participant, ParticipantStatus } from './entity/participant.entity';
import { TransformInterceptor } from 'src/common/interceptors/response-type.interceptor';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Participants')
@Controller('participants')
export class ParticipantController {
  constructor(private participantService: ParticipantService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(TransformInterceptor)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: '참가 상태 생성' })
  @ApiBody({
    description: '참가 상태 생성',
    examples: { 생성: { value: { meetingId: 1, description: '안녕하세요' } } },
  })
  async createParticipant(
    @Req() req,
    @Body('meetingId') meetingId: number,
    @Body('description') description: string,
  ): Promise<object> {
    await this.participantService.createParticipant(
      req.user,
      meetingId,
      description,
    );
    return { message: '생성 성공' };
  }

  @Get(':id')
  @UseInterceptors(TransformInterceptor)
  @ApiOperation({ summary: '참가 상태 상세 조회' })
  @ApiParam({
    name: 'id',
    required: true,
    description: '참가 상태 조회 ID',
    example: 1,
  })
  async findOne(@Param('id') id: number): Promise<object> {
    const result = await this.participantService.getParticipantsById(id);
    return { result };
  }

  @Put(':id')
  @UseInterceptors(TransformInterceptor)
  @ApiOperation({ summary: '참가 상태 변경' })
  @ApiParam({
    name: 'id',
    required: true,
    description: '변경할 참가 상태의 ID',
    example: 1,
  })
  @ApiBody({
    description: '변경할 참가 상태의 정보',
    type: Participant,
    examples: {
      수락: {
        summary: '참가 상태 수락',
        value: {
          status: ParticipantStatus.ATTENDED,
        },
      },
      취소: {
        summary: '참가 상태 취소',
        value: {
          status: ParticipantStatus.CANCELED,
        },
      },
      대기: {
        summary: '참가 상태 대기',
        value: {
          status: ParticipantStatus.PENDING,
        },
      },
      거절: {
        summary: '참가 상태 거절',
        value: {
          status: ParticipantStatus.REJECTED,
        },
      },
    },
  })
  async update(
    @Param('id') id: number,
    @Body('status') status: ParticipantStatus,
  ): Promise<object> {
    await this.participantService.updateParticipant(id, status);
    return { message: '성공' };
  }

  @Delete(':id')
  @UseInterceptors(TransformInterceptor)
  @ApiOperation({ summary: '참가 상태 삭제' })
  @ApiResponse({
    status: 204,
    description: '참가 상태 삭제 성공',
  })
  @ApiResponse({
    status: 400,
    description: '(인원제한에 걸린 경우)잘못된 요청입니다.',
  })
  @ApiResponse({
    status: 500,
    description: '서버 오류',
  })
  async delete(@Param('id') id: number): Promise<void> {
    await this.participantService.deleteParticipant(id);
  }
}
