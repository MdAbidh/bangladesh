import { Injectable, Logger, ConflictException, NotFoundException } from '@nestjs/common';
import { TagsRepository } from './tags.repository';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TagsService {
  private readonly logger = new Logger(TagsService.name);

  constructor(private readonly tagsRepository: TagsRepository) {}

  async findAll() {
    return this.tagsRepository.findAll();
  }

  async findPopular() {
    return this.tagsRepository.findPopular(20);
  }

  async create(dto: CreateTagDto) {
    const slug = this.slugify(dto.name);
    const existing = await this.tagsRepository.findBySlug(slug);
    if (existing) {
      throw new ConflictException('Tag already exists');
    }

    const tag = await this.tagsRepository.create({ name: dto.name, slug });
    this.logger.log(`Tag created: ${tag.id} - ${tag.name}`);
    return tag;
  }

  async delete(id: string) {
    const tag = await this.tagsRepository.findById(id);
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }
    await this.tagsRepository.delete(id);
    this.logger.log(`Tag deleted: ${id}`);
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
