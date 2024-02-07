import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApplicationStatus } from '../entity/application.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApplicationDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  meetingId: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ example: 'pending' })
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;
}
