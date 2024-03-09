import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { authMessage, userMessage } from 'src/constant/messages/message-type';
import { UserRepository } from './users.repository';
import { CategoryRepository } from '../categories/categories.repository';
import { In } from 'typeorm';
import { MeetingRepository } from '../meetings/meetings.repository';
import { Meeting } from '../meetings/entities/meeting.entity';
import { PaginationDto } from 'src/constant/pagination.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly meetingRepository: MeetingRepository,
  ) {}

  //* 유저 탈퇴
  async withdraw(user: User): Promise<void> {
    await this.usersRepository.softDelete({ userId: user.userId });
  }

  //* 유저 삭제
  async deleteUser(user: User, deletedUserId: number): Promise<void> {
    if (user.isAdmin !== true) {
      throw new ForbiddenException('접근 권한이 없습니다.');
    }

    const foundUser = await this.usersRepository.findOne({
      where: { userId: deletedUserId },
    });
    if (!foundUser) {
      throw new NotFoundException(
        `${deletedUserId}에 해당하는 사용자를 찾을 수 없습니다.`,
      );
    }
    await this.usersRepository.delete({ userId: deletedUserId });
  }

  //* 유저 생성
  async createUser(createUserDto: CreateUserDto): Promise<void> {
    const { email, password, categoryIds, ...rest } = createUserDto;

    const existingUser = await this.usersRepository.findOneBy({ email });

    if (existingUser) {
      // 사용자가 존재하면, 소프트 삭제된 사용자인지 확인
      if (existingUser.deleted_at !== null) {
        // 소프트 삭제된 사용자라면 복구
        existingUser.deleted_at = null;
        await this.usersRepository.save(existingUser);
      } else {
        // 소프트 삭제되지 않은 사용자라면 에러를 발생
        throw new ConflictException(authMessage.SIGNUP_CONFLICT_EMAIL);
      }
    } else {
      // 사용자가 존재하지 않으면 새 사용자를 생성
      const user = new User();
      Object.assign(user, { email, ...rest });
      await user.setPassword(password);

      if (categoryIds) {
        const categories = await this.categoryRepository.find({
          where: { categoryId: In(categoryIds) },
        });
        user.categories = categories;
      }
      await this.usersRepository.save(user);
    }
  }

  //* 유저 수정
  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const { password, categoryIds, ...rest } = updateUserDto;
    const user = await this.getUserById(userId);
    if (!user) throw new NotFoundException(userMessage.USER_NOTFOUND);

    // 비밀번호가 제공된 경우에만 업데이트
    if (password) {
      await user.setPassword(updateUserDto.password);
      // 비밀번호는 이미 처리되었으므로 삭제
      delete updateUserDto.password;
    }

    Object.assign(user, { ...rest });
    if (categoryIds) {
      const categories = await this.categoryRepository.find({
        where: { categoryId: In(categoryIds) },
      });
      user.categories = categories;
    }

    await this.usersRepository.save(user);
    return user;
  }

  //* 비밀번호 수정
  async updatePassword(email: string, newPassword: string): Promise<boolean> {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(userMessage.USER_NOTFOUND);
    }

    user.password = await user.setPassword(newPassword);
    const result = await this.usersRepository.save(user);

    return !!result;
  }

  //* 유저 목록 조회
  async getUserAll(pagination: PaginationDto): Promise<User[]> {
    const { perPage = 10, page = 1 } = pagination;
    const numPage = Number(page);
    const numPerPage = Number(perPage);
    const getUserAll = await this.usersRepository.find({
      skip: (numPage - 1) * numPerPage,
      take: numPerPage,
    });
    return getUserAll;
  }

  //* 유저 상세 조회
  async getUserById(userId: number): Promise<User> {
    const getUser = await this.usersRepository.findOne({
      where: { userId },
      relations: ['categories', 'meetings'],
    });
    return getUser;
  }

  //* 다른 유저 프로필 조회
  async getOtherUserById(userId: number): Promise<object> {
    const getUser = await this.usersRepository.findOne({
      where: { userId },
      relations: ['categories', 'meetings'],
    });
    const result = {
      email: getUser.email,
      nickname: getUser.nickname,
      profileImage: getUser.profileImage,
      categories: getUser.categories,
    };
    return result;
  }

  //* 이메일로 유저 조회
  async getUserByEmail(email: string): Promise<User> {
    const getUser = await this.usersRepository.findOne({
      where: { email },
      relations: ['categories', 'meetings'],
    });
    return getUser;
  }

  async checkEmail(email: string): Promise<boolean> {
    const result = await this.usersRepository.findOneBy({ email });
    return !result;
  }

  async checkNickname(nickname: string): Promise<boolean> {
    const result = await this.usersRepository.findOneBy({ nickname });
    return !result;
  }

  //* 유저 개설 모임 조회
  async getMeetingsByUser(
    user: User,
    paginationDto: PaginationDto,
  ): Promise<object[]> {
    const { page = 1, perPage = 10 } = paginationDto;
    const userId = user.userId;
    const getUser = await this.usersRepository.findOne({
      where: { userId },
      relations: [
        'likes',
        'meetings',
        'meetings.participants',
        'meetings.categories',
      ],
    });
    getUser.meetings.forEach((meeting) => {
      meeting.participants = meeting.participants.filter(
        (participant) => participant.status === 'attended',
      );
    });

    const mapMeetings = await Promise.all(
      getUser.meetings.map((meeting) => {
        const isLiked = getUser.likes.some(
          (likes) => likes.meetingId === meeting.meetingId,
        );

        return {
          meetingId: meeting.meetingId,
          title: meeting.title,
          categories: meeting.categories,
          image: meeting.image,
          description: meeting.description,
          location: meeting.location,
          meeting_date: meeting.meeting_date,
          member_limit: meeting.member_limit,
          created_at: meeting.created_at,
          host: meeting.user,
          participants_number: meeting.participants.length + 1,
          participants: meeting.participants,
          isLiked: isLiked ?? false,
        };
      }),
    );

    const numPage = Number(page);
    const numPerPage = Number(perPage);
    const start = (numPage - 1) * numPerPage;
    const end = start + numPerPage;
    const result = mapMeetings.slice(start, end);
    return result;
  }

  //* 좋아요 추가
  async addLike(userId: number, meetingId: number): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { userId },
      relations: ['likes'],
    });

    const meeting = await this.meetingRepository.findOneBy({ meetingId });
    if (!meeting) throw new NotFoundException('모임이 존재하지 않습니다.');

    if (
      user.likes &&
      !user.likes.some((like) => like.meetingId === meetingId)
    ) {
      user.likes.push(meeting);
    }

    await this.usersRepository.save(user);
  }

  //* 좋아요 삭제
  async removeLike(userId: number, meetingId: number): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { userId },
      relations: ['likes'],
    });
    user.likes = user.likes.filter((like) => like.meetingId !== meetingId);
    await this.usersRepository.save(user);
  }

  //* 좋아요 목록 조회
  async getLikes(
    userId: number,
    paginationDto?: PaginationDto,
  ): Promise<object> {
    const { perPage = 10, page = 1 } = paginationDto;
    const user = await this.usersRepository.findOne({
      where: { userId },
      relations: ['likes', 'likes.categories', 'likes.user'],
    });

    const result = await Promise.all(
      user.likes.map((like) => {
        const host = {
          userId: like.user.userId,
          email: like.user.email,
          nickname: like.user.nickname,
          profileImage: like.user.profileImage,
          categories: like.user.categories,
        };
        return {
          meetingId: like.meetingId,
          title: like.title,
          categories: like.categories,
          image: like.image,
          description: like.description,
          location: like.location,
          meeting_date: like.meeting_date,
          member_limit: like.member_limit,
          created_at: like.created_at,
          host,
          participants: like.participants,
        };
      }),
    );
    const numPage = Number(page);
    const numPerPage = Number(perPage);
    const start = (numPage - 1) * numPerPage;
    const end = start + numPerPage;
    return result.slice(start, end);
  }
}
