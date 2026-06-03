import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Lesson, Prisma } from '@prisma/client';

const lessonDetailSelect: Prisma.LessonSelect = {
  id: true,
  title: true,
  description: true,
  content: true,
  lessonType: true,
  sortOrder: true,
  duration: true,
  isFree: true,
  isPublished: true,
  allowDownload: true,
  sectionId: true,
  videoId: true,
  createdAt: true,
  updatedAt: true,
  video: {
    select: {
      id: true,
      title: true,
      description: true,
      duration: true,
      thumbnailUrl: true,
      hlsUrl: true,
      signedUrl: true,
      status: true,
    },
  },
  resources: {
    where: { deletedAt: null },
    select: {
      id: true,
      title: true,
      description: true,
      fileName: true,
      originalName: true,
      mimeType: true,
      size: true,
      firebaseUrl: true,
      signedUrl: true,
      type: true,
      isFree: true,
    },
  },
};

const lessonListSelect: Prisma.LessonSelect = {
  id: true,
  title: true,
  description: true,
  lessonType: true,
  sortOrder: true,
  duration: true,
  isFree: true,
  isPublished: true,
  allowDownload: true,
  sectionId: true,
  videoId: true,
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class LessonsRepository {
  private readonly logger = new Logger(LessonsRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.lesson.findFirst({
      where: { id, deletedAt: null },
      select: lessonDetailSelect,
    });
  }

  async findBySectionId(sectionId: string) {
    return this.prisma.lesson.findMany({
      where: { sectionId, deletedAt: null },
      orderBy: { sortOrder: 'asc' },
      select: lessonListSelect,
    });
  }

  async create(data: Prisma.LessonCreateInput): Promise<Lesson> {
    return this.prisma.lesson.create({ data }) as Promise<Lesson>;
  }

  async update(id: string, data: Prisma.LessonUpdateInput): Promise<Lesson> {
    return this.prisma.lesson.update({
      where: { id },
      data,
    }) as Promise<Lesson>;
  }

  async softDelete(id: string): Promise<Lesson> {
    return this.prisma.lesson.update({
      where: { id },
      data: { deletedAt: new Date() },
    }) as Promise<Lesson>;
  }

  async getMaxSortOrder(sectionId: string): Promise<number> {
    const lastLesson = await this.prisma.lesson.findFirst({
      where: { sectionId, deletedAt: null },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    });
    return lastLesson?.sortOrder ?? 0;
  }

  async findRawById(id: string) {
    return this.prisma.lesson.findFirst({
      where: { id, deletedAt: null },
    });
  }
}
