import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { authMessage, userMessage } from 'src/constant/messages/message-type';

@Injectable()
export class UserService {
  constructor(
    // @InjectRepository(User)
    // private readonly usersRepository: Repository<User>,
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<void> {
    const { email, password, ...rest } = createUserDto;
    const existingUser = await this.entityManager.findOneBy(User, { email });
    if (existingUser)
      throw new ConflictException(authMessage.SIGNUP_CONFLICT_EMAIL);
    const user = new User();
    Object.assign(user, { email, ...rest });
    await user.setPassword(password);
    console.log(user);
    await this.entityManager.save(user);
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
    // user.resetPasswordCode =
    //   updateUserDto.resetPasswordCode ?? user.resetPasswordCode;

    await this.entityManager.save(user);
    return user;
  }

  async updatePassword(
    email: string,
    newPassword: string,
    // codeExpirationTime?: Date,
  ): Promise<boolean> {
    const user = await this.entityManager.findOneBy(User, { email });
    if (!user) {
      throw new NotFoundException(userMessage.USER_NOTFOUND);
    }

    user.password = await user.setPassword(newPassword);
    // user.resetPasswordCode = null; // Clear the reset token
    // user.codeExpirationTime = codeExpirationTime ?? null;
    const result = await this.entityManager.save(user);

    return !!result;
  }

  async getUserAll(): Promise<User[]> {
    const getUserAll = await User.findBy({});
    return getUserAll;
  }

  async getUserById(userId: number): Promise<User> {
    const getUser = await User.findOneBy({ userId });
    return getUser;
  }

  async getUserByEmail(email: string): Promise<User> {
    const getUser = await User.findOneBy({ email });
    return getUser;
  }

  async checkEmail(email: string): Promise<boolean> {
    const result = await User.findOneBy({ email });
    return !result;
  }

  async checkNickname(nickname: string): Promise<boolean> {
    const result = await User.findOneBy({ nickname });
    return !result;
  }
}
