import { Module } from '@nestjs/common';
import { MeetingsModule } from './apis/meetings/meetings.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { AuthModule } from './apis/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './apis/users/users.module';
import { ReportsModule } from './apis/reports/reports.module';
import { AdminModule } from './apis/admin/admin.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MeetingsModule,
    AuthModule,
    UsersModule,
    ReportsModule,
    AdminModule,
  ],
})
export class AppModule {}
