import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IsNull, Not } from 'typeorm';
import { User } from './entities/user.entity';
import { authMessage, userMessage } from 'src/constant/messages/message-type';
import { UserRepository } from './users.repository';

@Injectable()
export class UserService {
  constructor(private readonly usersRepository: UserRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<void> {
    // const { email, password, ...rest } = createUserDto;
    // const existingUser = await this.entityManager.findOneBy(User, { email });
    // if (existingUser)
    //   throw new ConflictException(authMessage.SIGNUP_CONFLICT_EMAIL);
    // const user = new User();
    // Object.assign(user, { email, ...rest });
    // await user.setPassword(password);
    // console.log(user);
    // await this.entityManager.save(user);
    const { email, password, ...rest } = createUserDto;

    // 기존에 삭제된 사용자를 찾습니다.
    const deletedUser = await this.usersRepository.findOne({
      where: { email, deleted_at: Not(IsNull()) },
      withDeleted: true,
    });

    // console.log(email, deletedUser);
    if (deletedUser) {
      // 삭제된 사용자를 복구합니다.
      deletedUser.deleted_at = null;
      await this.usersRepository.save(deletedUser);
    } else {
      // 새 사용자를 생성합니다.
      const existingUser = await this.usersRepository.findOneBy({ email });
      if (existingUser)
        throw new ConflictException(authMessage.SIGNUP_CONFLICT_EMAIL);
      const user = new User();
      Object.assign(user, { email, ...rest });
      await user.setPassword(password);
      // console.log(user);
      await this.usersRepository.save(user);
    }
  }

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.getUserById(userId);
    if (!user) throw new NotFoundException(userMessage.USER_NOTFOUND);

    user.username = updateUserDto.username ?? user.username;
    user.nickname = updateUserDto.nickname ?? user.nickname;
    if (updateUserDto.password) {
      await user.setPassword(updateUserDto.password);
    }
    user.gender = updateUserDto.gender ?? user.gender;
    user.profileImage = updateUserDto.profileImage ?? user.profileImage;

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
    const getUser = await this.usersRepository.findOneBy({ userId });
    return getUser;
  }

  async getUserByEmail(email: string): Promise<User> {
    const getUser = await this.usersRepository.findOneBy({ email });
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
}
