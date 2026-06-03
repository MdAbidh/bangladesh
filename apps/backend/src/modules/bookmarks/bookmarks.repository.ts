import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Prisma } from '@prisma/client';

const bookmarkSelect: Prisma.BookmarkSelect = {
  id: true,
  userId: true,
  lessonId: true,
  note: true,
  createdAt: true,
  lesson: {
    select: {
      id: true,
      title: true,
      lessonType: true,
      duration: true,
      section: {
        select: {
          id: true,
          title: true,
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
              thumbnailUrl: true,
            },
          },
        },
      },
    },
  },
};

@Injectable()
export class BookmarksRepository {
  private readonly logger = new Logger(BookmarksRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findByUserAndLesson(userId: string, lessonId: string) {
    return this.prisma.bookmark.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.bookmark.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: bookmarkSelect,
    });
  }

  async create(data: Prisma.BookmarkCreateInput) {
    return this.prisma.bookmark.create({ data, select: bookmarkSelect });
  }

  async delete(id: string) {
    return this.prisma.bookmark.delete({ where: { id } });
  }
}
