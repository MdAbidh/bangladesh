import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async findAll() {
    return this.categoriesRepository.findAll();
  }

  async findBySlug(slug: string) {
    const category = await this.categoriesRepository.findBySlug(slug);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async create(dto: CreateCategoryDto) {
    const slug = this.slugify(dto.name);

    const existing = await this.categoriesRepository.findBySlug(slug);
    if (existing) {
      throw new ConflictException('A category with this name already exists');
    }

    const data: any = {
      name: dto.name,
      slug,
      description: dto.description,
      icon: dto.icon,
      color: dto.color,
      sortOrder: dto.sortOrder ?? 0,
    };

    if (dto.parentId) {
      data.parent = { connect: { id: dto.parentId } };
    }

    const category = await this.categoriesRepository.create(data);
    this.logger.log(`Category created: ${category.id} - ${category.name}`);
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.categoriesRepository.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const data: any = {};
    if (dto.name !== undefined) {
      data.name = dto.name;
      data.slug = this.slugify(dto.name);
    }
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.icon !== undefined) data.icon = dto.icon;
    if (dto.color !== undefined) data.color = dto.color;
    if (dto.sortOrder !== undefined) data.sortOrder = dto.sortOrder;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;
    if (dto.parentId !== undefined) {
      data.parent = dto.parentId ? { connect: { id: dto.parentId } } : { disconnect: true };
    }

    return this.categoriesRepository.update(id, data);
  }

  async delete(id: string) {
    const category = await this.categoriesRepository.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.categoriesRepository.delete(id);
    this.logger.log(`Category deleted: ${id}`);
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
