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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { TransformInterceptor } from 'src/common/interceptors/response-type.interceptor';
import { ParticipantService } from '../participants/participant.service';
import { Participant } from '../participants/entity/participant.entity';
import { AuthGuard } from '@nestjs/passport';
import { PaginationDto } from 'src/constant/pagination.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UserService,
    private readonly participantService: ParticipantService,
  ) {}

  //* 사용자 탈퇴
  @UseGuards(AuthGuard('jwt'))
  @Patch('/withdraw')
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: '사용자 탈퇴' })
  @ApiResponse({
    status: 204,
    description: '사용자 탈퇴',
  })
  async withdraw(@Req() req): Promise<object> {
    const user = req.user;
    await this.userService.withdraw(user);
    return { message: '유저 탈퇴 성공' };
  }

  //* 사용자 삭제
  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id/delete')
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: '사용자 삭제' })
  @ApiResponse({
    status: 204,
    description: '사용자 삭제',
  })
  async deleteUser(@Req() req, @Param('id') deletedUserId: number) {
    const user = req.user;
    await this.userService.deleteUser(user, deletedUserId);
    return { message: '유저 삭제 성공' };
  }

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
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: '사용자 신청 현황 조회' })
  @ApiResponse({
    status: 200,
    description: '사용자 신청 현황 조회',
  })
  async getUserParticipants(
    @Req() req,
    @Query() paginationDto: PaginationDto,
  ): Promise<object> {
    const result = await this.participantService.getParticipantsByUserId(
      req.user.userId,
      paginationDto,
    );
    return { result };
  }

  //*사용자 개설 모임 목록 조회
  @UseGuards(AuthGuard('jwt'))
  @Get('/meetings-creator')
  @UseInterceptors(TransformInterceptor)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: '사용자 개설 모임 조회' })
  @ApiResponse({ status: 200, description: '사용자 개설 모임 조회 성공' })
  async getMeetingsByUser(
    @Req() req,
    @Query() paginationDto: PaginationDto,
  ): Promise<object> {
    const user = req.user;
    const result = await this.userService.getMeetingsByUser(
      user,
      paginationDto,
    );
    return { result };
  }

  //*사용자 참가 모임 목록 조회
  @UseGuards(AuthGuard('jwt'))
  @Get('/meetings')
  @UseInterceptors(TransformInterceptor)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: '사용자 참가 모임 조회' })
  @ApiResponse({
    status: 200,
    description: '사용자 참가 모임 조회 성공',
  })
  async getUserMeetings(
    @Req() req,
    @Query() paginationDto: PaginationDto,
  ): Promise<object> {
    const result = await this.participantService.getMeetingsByUserId(
      req.user.userId,
      paginationDto,
    );
    return { result };
  }
  //* 사용자 정보 조회
  @UseGuards(AuthGuard('jwt'))
  @Get('/profile')
  @UseInterceptors(TransformInterceptor)
  @ApiBearerAuth('jwt')
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

  //* 다른 사용자 정보 조회
  @Get('/:id/profile-others')
  @UseInterceptors(TransformInterceptor)
  @ApiOperation({ summary: '다른 사용자 정보 조회' })
  @ApiResponse({
    status: 200,
    description: '다른 사용자 정보 조회 성공',
    type: User,
  })
  async getOtherUser(@Param('id') id: number): Promise<object> {
    const result = await this.userService.getOtherUserById(id);
    return { result };
  }

  //*사용자 정보 수정
  @UseGuards(AuthGuard('jwt'))
  @Patch('/profile')
  @UseInterceptors(TransformInterceptor)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: '사용자 정보 수정' })
  async updateUser(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<object> {
    await this.userService.updateUser(req.user.userId, updateUserDto);
    return { message: '수정 성공' };
  }

  //* 사용자 좋아요 목록 조회
  @UseGuards(AuthGuard('jwt'))
  @Get('likes')
  // @UsePipes(ValidationPipe)
  @ApiBearerAuth('jwt')
  @UseInterceptors(TransformInterceptor)
  @ApiOperation({ summary: '좋아요 목록 조회' })
  async getLikes(
    @Req() req,
    @Query() paginationDto: PaginationDto,
  ): Promise<object> {
    const result = await this.userService.getLikes(
      req.user.userId,
      paginationDto,
    );
    return { result };
  }

  //* 사용자 목록 조회
  @Get()
  @ApiOperation({ summary: '사용자 목록 조회' })
  @ApiResponse({
    status: 200,
    description: '사용자 목록 조회',
    type: Array<User>,
  })
  async getUserAll(@Query() paginationDto: PaginationDto): Promise<object> {
    const result = await this.userService.getUserAll(paginationDto);
    return { result };
  }
}
