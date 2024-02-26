import { Module } from '@nestjs/common';
import { MeetingsModule } from './apis/meetings/meetings.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { AuthModule } from './apis/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './apis/users/users.module';
import { ReportsModule } from './apis/reports/reports.module';
import { AdminModule } from './apis/admin/admin.module';
import { ParticipantModule } from './apis/participants/participant.module';
import { CategoryModule } from './apis/categories/categories.module';
import { ChatModule } from './apis/chat/chat.module';
import { DistStorageModule } from './apis/files/files.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DistStorageModule,
    CategoryModule,
    ParticipantModule,
    MeetingsModule,
    AuthModule,
    UsersModule,
    ReportsModule,
    AdminModule,
    ChatModule,
  ],
})
export class AppModule {}
