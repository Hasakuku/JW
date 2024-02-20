import {
  ConflictException,
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

@Injectable()
export class UserService {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly meetingRepository: MeetingRepository,
  ) {}

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

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.getUserById(userId);
    if (!user) throw new NotFoundException(userMessage.USER_NOTFOUND);

    // 비밀번호가 제공된 경우에만 업데이트
    if (updateUserDto.password) {
      await user.setPassword(updateUserDto.password);
      // 비밀번호는 이미 처리되었으므로 삭제
      delete updateUserDto.password;
    }

    Object.assign(user, updateUserDto);

    await this.usersRepository.save(user);
    return user;
  }

  async updatePassword(email: string, newPassword: string): Promise<boolean> {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(userMessage.USER_NOTFOUND);
    }

    user.password = await user.setPassword(newPassword);
    const result = await this.usersRepository.save(user);

    return !!result;
  }

  async getUserAll(): Promise<User[]> {
    const getUserAll = await this.usersRepository.findBy({});
    return getUserAll;
  }

  async getUserById(userId: number): Promise<User> {
    const getUser = await this.usersRepository.findOne({
      where: { userId },
      relations: ['categories', 'meetings'],
    });
    return getUser;
  }

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

  async getMeetingsByUser(user: User): Promise<object[]> {
    const userId = user.userId;
    const getUser = await this.usersRepository.findOne({
      where: { userId },
      relations: ['meetings'],
    });
    return getUser.meetings;
  }
}
