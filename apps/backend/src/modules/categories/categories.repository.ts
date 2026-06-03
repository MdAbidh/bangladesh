import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Prisma } from '@prisma/client';

const categorySelect: Prisma.CategorySelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  icon: true,
  color: true,
  parentId: true,
  sortOrder: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  _count: {
    select: { courses: true },
  },
};

const categoryWithChildrenSelect: Prisma.CategorySelect = {
  ...categorySelect,
  children: {
    where: { isActive: true, deletedAt: null },
    orderBy: { sortOrder: 'asc' },
    select: categorySelect,
  },
  parent: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
};

@Injectable()
export class CategoriesRepository {
  private readonly logger = new Logger(CategoriesRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      where: { parentId: null, isActive: true, deletedAt: null },
      orderBy: { sortOrder: 'asc' },
      select: categoryWithChildrenSelect,
    });
  }

  async findById(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
      select: { id: true, name: true, slug: true, sortOrder: true },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.category.findUnique({
      where: { slug },
      select: categoryWithChildrenSelect,
    });
  }

  async create(data: Prisma.CategoryCreateInput) {
    return this.prisma.category.create({
      data,
      select: categorySelect,
    });
  }

  async update(id: string, data: Prisma.CategoryUpdateInput) {
    return this.prisma.category.update({
      where: { id },
      data,
      select: categorySelect,
    });
  }

  async delete(id: string) {
    return this.prisma.category.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
  }
}
