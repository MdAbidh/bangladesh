import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

const reviewSelect: any = {
  id: true,
  userId: true,
  courseId: true,
  content: true,
  isEdited: true,
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
  ratings: {
    select: {
      rating: true,
    },
  },
};

@Injectable()
export class ReviewsRepository {
  private readonly logger = new Logger(ReviewsRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.courseReview.findUnique({
      where: { id },
      select: { id: true, userId: true, courseId: true, content: true, isEdited: true },
    });
  }

  async findByUserAndCourse(userId: string, courseId: string) {
    return this.prisma.courseReview.findUnique({
      where: { userId_courseId: { userId, courseId } },
      select: { id: true },
    });
  }

  async findByCourse(courseId: string) {
    return this.prisma.courseReview.findMany({
      where: { courseId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      select: {
        ...reviewSelect,
        ratings: {
          select: { rating: true },
        },
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.courseReview.findMany({
      where: { userId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      select: {
        ...reviewSelect,
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            thumbnailUrl: true,
          },
        },
      },
    });
  }

  async createWithRating(userId: string, dto: { content: string; courseId: string; rating: number }) {
    return this.prisma.$transaction(async (tx) => {
      const review = await tx.courseReview.create({
        data: {
          content: dto.content,
          userId,
          courseId: dto.courseId,
        },
        select: reviewSelect,
      });

      await tx.courseRating.upsert({
        where: { userId_courseId: { userId, courseId: dto.courseId } },
        update: { rating: dto.rating },
        create: {
          userId,
          courseId: dto.courseId,
          rating: dto.rating,
        },
      });

      return review;
    });
  }

  async update(id: string, data: { content?: string; rating?: number }) {
    if (data.rating !== undefined) {
      return this.prisma.$transaction(async (tx) => {
        const review = await tx.courseReview.findUnique({
          where: { id },
          select: { id: true, userId: true, courseId: true },
        });
        if (!review) throw new Error('Review not found');

        const updated = await tx.courseReview.update({
          where: { id },
          data: {
            content: data.content,
            isEdited: true,
          },
          select: reviewSelect,
        });

        if (data.rating !== undefined) {
          await tx.courseRating.update({
            where: { userId_courseId: { userId: review.userId, courseId: review.courseId } },
            data: { rating: data.rating },
          });
        }

        return updated;
      });
    }

    return this.prisma.courseReview.update({
      where: { id },
      data: { content: data.content, isEdited: true },
      select: reviewSelect,
    });
  }

  async delete(id: string) {
    return this.prisma.courseReview.delete({ where: { id } });
  }
}
