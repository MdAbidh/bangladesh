import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Prisma } from '@prisma/client';

const threadSelect: Prisma.DiscussionThreadSelect = {
  id: true,
  title: true,
  content: true,
  isPinned: true,
  isResolved: true,
  courseId: true,
  lessonId: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      displayName: true,
      avatarUrl: true,
    },
  },
  _count: {
    select: { comments: true },
  },
};

const threadDetailSelect: Prisma.DiscussionThreadSelect = {
  ...threadSelect,
  comments: {
    where: { deletedAt: null },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      content: true,
      parentId: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          displayName: true,
          avatarUrl: true,
        },
      },
      replies: {
        where: { deletedAt: null },
        orderBy: { createdAt: 'asc' },
        select: {
          id: true,
          content: true,
          parentId: true,
          userId: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              displayName: true,
              avatarUrl: true,
            },
          },
        },
      },
    },
  },
};

@Injectable()
export class DiscussionsRepository {
  private readonly logger = new Logger(DiscussionsRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async createThread(data: Prisma.DiscussionThreadCreateInput) {
    return this.prisma.discussionThread.create({
      data,
      select: threadSelect,
    });
  }

  async findThreadsByCourse(courseId: string) {
    return this.prisma.discussionThread.findMany({
      where: { courseId, deletedAt: null },
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
      select: threadSelect,
    });
  }

  async findThreadById(id: string) {
    return this.prisma.discussionThread.findUnique({
      where: { id },
      select: threadDetailSelect,
    });
  }

  async updateThread(id: string, data: Prisma.DiscussionThreadUpdateInput) {
    return this.prisma.discussionThread.update({
      where: { id },
      data,
      select: threadSelect,
    });
  }

  async deleteThread(id: string) {
    return this.prisma.discussionThread.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async createComment(data: Prisma.DiscussionCommentCreateInput) {
    return this.prisma.discussionComment.create({ data });
  }
}
