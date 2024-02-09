import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { TransformInterceptor } from 'src/common/interceptors/response-type.interceptor';
import { ParticipantService } from '../participants/participant.service';
import { Participant } from '../participants/entity/participant.entity';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UserService,
    private readonly participantService: ParticipantService,
  ) {}

  //* 사용자 탈퇴
  @Patch('/withdraw')
  @ApiOperation({ summary: '사용자 탈퇴' })
  @ApiResponse({
    status: 204,
    description: '사용자 탈퇴',
  })
  async withdraw() {}

  //* 사용자 삭제
  @Delete('/delete')
  @ApiOperation({ summary: '사용자 삭제' })
  @ApiResponse({
    status: 204,
    description: '사용자 삭제',
  })
  async deleteUser() {}

  //* 이메일 중복 확인
  @Get('check-email')
  @UseInterceptors(TransformInterceptor)
  @ApiOperation({ summary: '이메일 중복 확인' })
  async checkEmail(@Query('email') email: string): Promise<object> {
    const result = await this.userService.checkEmail(email);
    return { result };
  }

  //* 닉네임 중복 확인
  @Get('check-nickname')
  @UseInterceptors(TransformInterceptor)
  @ApiOperation({ summary: '닉네임 중복 확인' })
  async checkNickname(@Query('nickname') nickname: string): Promise<object> {
    const result = await this.userService.checkNickname(nickname);
    return { result };
  }

  //* 비밀번호 재설정
  @Patch('reset-password')
  @UseInterceptors(TransformInterceptor)
  @ApiOperation({ summary: '비밀번호 재설정' })
  async updatePassword(
    @Body('email') email: string,
    @Body('newPassword') newPassword: string,
  ): Promise<object> {
    const result = await this.userService.updatePassword(email, newPassword);
    return { result };
  }

  //*사용자 신청 현황 조회
  @UseGuards(AuthGuard('jwt'))
  @Get('/participants')
  @UseInterceptors(TransformInterceptor)
  @ApiOperation({ summary: '사용자 신청 현황 조회' })
  @ApiResponse({
    status: 200,
    description: '사용자 신청 현황 조회',
  })
  async getUserParticipants(@Req() req): Promise<object> {
    const result: Participant[] =
      await this.participantService.getParticipantsByUserId(req.user.userId);
    return { result };
  }

  //*사용자 참가 모임 조회
  @UseGuards(AuthGuard('jwt'))
  @Get('/meetings')
  @UseInterceptors(TransformInterceptor)
  @ApiOperation({ summary: '사용자 참가 모임 조회' })
  @ApiResponse({
    status: 200,
    description: '사용자 참가 모임 조회',
  })
  async getUserMeetings(@Req() req): Promise<object> {
    const result: Participant[] =
      await this.participantService.getMeetingsByUserId(req.user.userId);
    return { result };
  }
  //* 사용자 정보 조회
  @UseGuards(AuthGuard('jwt'))
  @Get('/profile')
  @UseInterceptors(TransformInterceptor)
  @ApiOperation({ summary: '사용자 정보 조회' })
  @ApiResponse({
    status: 200,
    description: '사용자 정보 조회 성공',
    type: User,
  })
  async getUser(@Req() req): Promise<object> {
    const result = await this.userService.getUserById(req.user.userId);
    return { result };
  }

  //*사용자 정보 수정
  @UseGuards(AuthGuard('jwt'))
  @Patch('/profile')
  @UseInterceptors(TransformInterceptor)
  @ApiOperation({ summary: '사용자 정보 수정' })
  async updateUser(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<object> {
    await this.userService.updateUser(req.user.userId, updateUserDto);
    return { message: '수정 성공' };
  }
  //* 사용자 목록 조회
  @Get()
  @ApiOperation({ summary: '사용자 목록 조회' })
  @ApiResponse({
    status: 200,
    description: '사용자 목록 조회',
    type: Array<User>,
  })
  async getUserAll(): Promise<object> {
    const result = await this.userService.getUserAll();
    return { result };
  }
}
