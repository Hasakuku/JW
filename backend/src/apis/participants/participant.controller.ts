import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ParticipantService } from './participant.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Participant } from './entity/participant.entity';
import { CreateParticipantDto } from './dto/create-participant.dto';

@ApiTags('Participants')
@Controller('participants')
export class ParticipantController {
  constructor(private participantService: ParticipantService) {}

  @Post()
  @ApiOperation({ summary: '신청 생성' })
  @ApiBody({ description: '신청 생성', type: CreateParticipantDto })
  async create(@Body() participant: Participant): Promise<Participant> {
    return this.participantService.createParticipant(participant);
  }

  @Get(':id')
  @ApiOperation({ summary: '신청 조회' })
  @ApiParam({
    name: 'id',
    required: true,
    description: '신청 조회 ID',
    example: 1,
  })
  async findOne(@Param('id') id: number): Promise<Participant[]> {
    return this.participantService.getParticipantsByUserId(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '신청 상태 변경' })
  @ApiParam({
    name: 'id',
    required: true,
    description: '변경할 신청의 ID',
    example: 1,
  })
  @ApiBody({
    description: '변경할 신청의 정보',
    type: Participant,
    examples: {
      수락: {
        summary: '신청 수락',
        value: {
          status: 'accepted',
        },
      },
    },
  })
  async update(
    @Param('id') id: number,
    @Body() updatedParticipant: Partial<Participant>,
  ): Promise<Participant> {
    return this.participantService.updateParticipant(id, updatedParticipant);
  }

  @Delete(':id')
  @ApiOperation({ summary: '신청 삭제' })
  @ApiResponse({
    status: 204,
    description: '신청 삭제 성공',
  })
  @ApiResponse({
    status: 500,
    description: '서버 오류',
  })
  async delete(@Param('id') id: number): Promise<void> {
    await this.participantService.deleteParticipant(id);
  }
}
