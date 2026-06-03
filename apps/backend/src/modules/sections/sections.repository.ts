import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Section, Prisma } from '@prisma/client';

const sectionWithLessonsSelect: Prisma.SectionSelect = {
  id: true,
  title: true,
  description: true,
  sortOrder: true,
  isPublished: true,
  courseId: true,
  createdAt: true,
  updatedAt: true,
  lessons: {
    where: { deletedAt: null },
    orderBy: { sortOrder: 'asc' },
    select: {
      id: true,
      title: true,
      description: true,
      lessonType: true,
      sortOrder: true,
      duration: true,
      isFree: true,
      isPublished: true,
      allowDownload: true,
      videoId: true,
    },
  },
};

@Injectable()
export class SectionsRepository {
  private readonly logger = new Logger(SectionsRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.section.findFirst({
      where: { id, deletedAt: null },
      select: sectionWithLessonsSelect,
    });
  }

  async findByCourseId(courseId: string) {
    return this.prisma.section.findMany({
      where: { courseId, deletedAt: null },
      orderBy: { sortOrder: 'asc' },
      select: sectionWithLessonsSelect,
    });
  }

  async create(data: Prisma.SectionCreateInput): Promise<Section> {
    return this.prisma.section.create({ data }) as Promise<Section>;
  }

  async update(id: string, data: Prisma.SectionUpdateInput): Promise<Section> {
    return this.prisma.section.update({
      where: { id },
      data,
    }) as Promise<Section>;
  }

  async softDelete(id: string): Promise<Section> {
    return this.prisma.section.update({
      where: { id },
      data: { deletedAt: new Date() },
    }) as Promise<Section>;
  }

  async getMaxSortOrder(courseId: string): Promise<number> {
    const lastSection = await this.prisma.section.findFirst({
      where: { courseId, deletedAt: null },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    });
    return lastSection?.sortOrder ?? 0;
  }

  async findRawById(id: string) {
    return this.prisma.section.findFirst({
      where: { id, deletedAt: null },
    });
  }
}
