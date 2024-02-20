import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entity/categories.entity';
import { Repository } from 'typeorm';
import { CategoryRepository } from './categories.repository';

@Injectable()
export class CategoryService {
  constructor(
    // @InjectRepository(Category)
    // private readonly categoryRepository: Repository<Category>,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async createCategory(name: string): Promise<Category> {
    const newCategory = this.categoryRepository.create({ name });
    return await this.categoryRepository.save(newCategory);
  }

  async getAllCategories(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  async getCategoryById(categoryId: number): Promise<Category> {
    return await this.categoryRepository.findOneBy({ categoryId });
  }

  async updateCategory(categoryId: number, name: string): Promise<Category> {
    const categoryToUpdate = await this.categoryRepository.findOneBy({
      categoryId,
    });
    categoryToUpdate.name = name;
    return await this.categoryRepository.save(categoryToUpdate);
  }

  async deleteCategory(categoryId: number): Promise<void> {
    await this.categoryRepository.delete(categoryId);
  }
}
