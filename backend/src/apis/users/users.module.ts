import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UsersController } from './users.controller';
import { ApplicationService } from '../applications/application.service';
import { ApplicationModule } from '../applications/application.module';

@Module({
  imports: [ApplicationModule],
  controllers: [UsersController],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}
