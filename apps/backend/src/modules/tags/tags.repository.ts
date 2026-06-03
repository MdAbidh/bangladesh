import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Prisma } from '@prisma/client';

const tagSelect = {
  id: true,
  name: true,
  slug: true,
  createdAt: true,
  _count: {
    select: { courses: true },
  },
};

@Injectable()
export class TagsRepository {
  private readonly logger = new Logger(TagsRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.tag.findMany({
      orderBy: { name: 'asc' },
      select: tagSelect,
    });
  }

  async findById(id: string) {
    return this.prisma.tag.findUnique({
      where: { id },
      select: { id: true, name: true, slug: true },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.tag.findUnique({ where: { slug } });
  }

  async findPopular(limit: number) {
    return this.prisma.tag.findMany({
      orderBy: { courses: { _count: 'desc' } },
      take: limit,
      select: tagSelect,
    });
  }

  async create(data: Prisma.TagCreateInput) {
    return this.prisma.tag.create({ data, select: tagSelect });
  }

  async delete(id: string) {
    return this.prisma.tag.delete({ where: { id } });
  }
}
