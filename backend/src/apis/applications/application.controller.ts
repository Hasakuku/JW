import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Application } from './entity/application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';

@ApiTags('Applications')
@Controller('applications')
export class ApplicationController {
  constructor(private applicationService: ApplicationService) {}

  @Post()
  @ApiOperation({ summary: '신청 생성' })
  @ApiBody({ description: '신청 생성', type: CreateApplicationDto })
  async create(@Body() application: Application): Promise<Application> {
    return this.applicationService.createApplication(application);
  }

  @Get(':id')
  @ApiOperation({ summary: '신청 조회' })
  @ApiParam({
    name: 'id',
    required: true,
    description: '신청 조회 ID',
    example: 1,
  })
  async findOne(@Param('id') id: number): Promise<Application | undefined> {
    return this.applicationService.getApplicationById(id);
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
    type: Application,
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
    @Body() updatedApplication: Partial<Application>,
  ): Promise<Application> {
    return this.applicationService.updateApplication(id, updatedApplication);
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
    await this.applicationService.deleteApplication(id);
  }
}
