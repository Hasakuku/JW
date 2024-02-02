import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { TransformInterceptor } from 'src/common/interceptors/response-type.interceptor';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  //* 사용자 탈퇴
  @Patch('/withdraw')
  @ApiOperation({ summary: '사용자 탈퇴' })
  @ApiResponse({
    status: 204,
    description: '사용자 탈퇴',
  })
  withdraw() {}

  //* 사용자 삭제
  @Delete('/delete')
  @ApiOperation({ summary: '사용자 삭제' })
  @ApiResponse({
    status: 204,
    description: '사용자 삭제',
  })
  deleteUser() {}

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

  //* 사용자 정보 조회
  @Get('/:id')
  @UseInterceptors(TransformInterceptor)
  @ApiOperation({ summary: '사용자 정보 조회' })
  @ApiParam({ name: 'id', description: '사용자 ID' })
  @ApiResponse({
    status: 200,
    description: '사용자 목록 조회',
    type: User,
  })
  async getUser(@Param('id') userId: number): Promise<User> {
    return await this.userService.getUserById(userId);
  }

  //*사용자 정보 수정
  @Patch('/:id')
  @UseInterceptors(TransformInterceptor)
  async updateUser(
    @Param('id') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<object> {
    const result = await this.userService.updateUser(userId, updateUserDto);
    return { result };
  }
}
