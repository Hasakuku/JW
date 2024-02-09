import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Meeting } from './entities/meeting.entity';

@Injectable()
export class MeetingsService {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  async createMeetings(createMeetingDto: CreateMeetingDto): Promise<Meeting> {
    const {
      title,
      tag,
      location,
      period,
      category,
      member_limit,
      description,
    } = createMeetingDto;
    try {
      const result = await this.entityManager.query(
        `INSERT INTO meeting (title, tag, location, period, category, member_limit, description) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [title, tag, location, period, category, member_limit, description],
      );

      return result;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getMeetingById(meetingId: number): Promise<Meeting> {
    return await this.entityManager.findOne(Meeting, {
      where: { meetingId },
      // relations: ['participants'],
    });
  }

  // async createBoards(createBoardDto: CreateBoardDto): Promise<Board> {
  //   const { title, description } = createBoardDto;

  //   const result = await this.entityManager.query(
  //     `INSERT INTO board (title, description, status) VALUES ($1, $2, $3) RETURNING *`,
  //     [title, description, BoardStatus.PUBLIC],
  //   );

  //   return result[0];
  // }

  // async getBoardById(id: number): Promise<Board> {
  //   const result = await this.entityManager.query(
  //     `SELECT * FROM board WHERE id = $1`,
  //     [id],
  //   );

  //   if (result.length === 0)
  //     throw new NotFoundException(`Can't find Board with id: ${id}`);

  //   return result[0];
  // }

  // async deleteBoard(id: number): Promise<void> {
  //   const result = await this.entityManager.query(
  //     `DELETE FROM board WHERE id = $1 RETURNING *`,
  //     [id],
  //   );

  //   if (result.length === 0)
  //     throw new NotFoundException(`Can't find Board with id: ${id}`);
  // }

  // async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
  //   const board = await this.getBoardById(id);

  //   const result = await this.entityManager.query(
  //     `UPDATE board SET status = $1 WHERE id = $2 RETURNING *`,
  //     [status, id],
  //   );

  //   return result[0];
  // }

  // async getAllBoards(): Promise<Board[]> {
  //   const result = await this.entityManager.query(`SELECT * FROM board`);
  //   return result;
  // }
}
