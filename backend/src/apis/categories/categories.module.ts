import { Module } from '@nestjs/common';
import { CategoryService } from './categories.service';
import { CategoryController } from './categories.controller';
import { Category } from './entity/categories.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryRepository } from './categories.repository';

@Module({
  // imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryRepository],
})
export class CategoryModule {}
