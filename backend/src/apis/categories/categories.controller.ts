import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './categories.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { TransformInterceptor } from 'src/common/interceptors/response-type.interceptor';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(TransformInterceptor)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: '카테고리 생성' })
  @ApiBody({
    description: '카테고리 생성',
    examples: { test: { value: { name: 'hello' } } },
  })
  async create(@Body('name') name: string): Promise<object> {
    const result = await this.categoryService.createCategory(name);
    return { result };
  }

  @Get()
  @UseInterceptors(TransformInterceptor)
  @ApiOperation({ summary: '카테고리 목록 조회' })
  async findAll(): Promise<object> {
    const result = await this.categoryService.getAllCategories();
    return { result };
  }

  @Get(':id')
  @UseInterceptors(TransformInterceptor)
  @ApiOperation({ summary: '카테고리 상세 조회' })
  @ApiParam({ name: 'id', description: '카테고리 ID', example: 1 })
  async findOne(@Param('id') id: number): Promise<object> {
    const result = await this.categoryService.getCategoryById(id);
    return { result };
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @UseInterceptors(TransformInterceptor)
  @ApiOperation({ summary: '카테고리 수정' })
  @ApiBearerAuth('jwt')
  @ApiParam({ name: 'id', description: '카테고리 ID', example: 1 })
  async update(
    @Param('id') id: number,
    @Body('name') name: string,
  ): Promise<object> {
    const result = await this.categoryService.updateCategory(id, name);
    return { result };
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @UseInterceptors(TransformInterceptor)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: '카테고리 삭제' })
  @ApiParam({ name: 'id', description: '카테고리 ID', example: 1 })
  async remove(@Param('id') id: number): Promise<void> {
    await this.categoryService.deleteCategory(id);
  }
}
