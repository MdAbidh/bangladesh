import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class RecommendationsService {
  private readonly logger = new Logger(RecommendationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getRecommendations(userId: string, limit: number = 10) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const enrollments = await this.prisma.enrollment.findMany({
      where: { userId, status: 'ACTIVE' },
      select: {
        courseId: true,
        course: {
          select: {
            categoryId: true,
            tags: {
              select: { tagId: true },
            },
          },
        },
      },
    });

    const enrolledCourseIds = enrollments.map((e) => e.courseId);
    const categoryIds = [
      ...new Set(enrollments.map((e) => e.course.categoryId).filter(Boolean)),
    ] as string[];
    const tagIds = [
      ...new Set(enrollments.flatMap((e) => e.course.tags.map((t) => t.tagId))),
    ];

    const where: any = {
      status: 'PUBLISHED',
      deletedAt: null,
      id: { notIn: enrolledCourseIds },
    };

    if (categoryIds.length > 0 || tagIds.length > 0) {
      where.OR = [];
      if (categoryIds.length > 0) {
        where.OR.push({ categoryId: { in: categoryIds } });
      }
      if (tagIds.length > 0) {
        where.OR.push({ tags: { some: { tagId: { in: tagIds } } } });
      }
    }

    const recommendations = await this.prisma.course.findMany({
      where,
      orderBy: { popularityScore: 'desc' },
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        subtitle: true,
        thumbnailUrl: true,
        price: true,
        discountPrice: true,
        isFree: true,
        level: true,
        averageRating: true,
        totalRatings: true,
        totalEnrollments: true,
        popularityScore: true,
        duration: true,
        category: { select: { id: true, name: true, slug: true } },
        teacher: {
          select: { id: true, displayName: true, avatarUrl: true, headline: true },
        },
        tags: {
          select: { tag: { select: { id: true, name: true, slug: true } } },
        },
      },
    });

    if (recommendations.length < limit) {
      const existingIds = [enrolledCourseIds, recommendations.map((r) => r.id)].flat();
      const popularCourses = await this.prisma.course.findMany({
        where: {
          status: 'PUBLISHED',
          deletedAt: null,
          id: { notIn: existingIds },
        },
        orderBy: { popularityScore: 'desc' },
        take: limit - recommendations.length,
        select: {
          id: true,
          title: true,
          slug: true,
          subtitle: true,
          thumbnailUrl: true,
          price: true,
          discountPrice: true,
          isFree: true,
          level: true,
          averageRating: true,
          totalRatings: true,
          totalEnrollments: true,
          popularityScore: true,
          duration: true,
          category: { select: { id: true, name: true, slug: true } },
          teacher: {
            select: { id: true, displayName: true, avatarUrl: true, headline: true },
          },
          tags: {
            select: { tag: { select: { id: true, name: true, slug: true } } },
          },
        },
      });
      recommendations.push(...popularCourses);
    }

    return recommendations;
  }

  async getSimilarCourses(courseId: string, limit: number = 10) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        categoryId: true,
        level: true,
        tags: { select: { tagId: true } },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const tagIds = course.tags.map((t) => t.tagId);

    const where: any = {
      status: 'PUBLISHED',
      deletedAt: null,
      id: { not: courseId },
    };

    where.OR = [];

    if (course.categoryId) {
      where.OR.push({ categoryId: course.categoryId });
    }

    if (course.level) {
      where.OR.push({ level: course.level });
    }

    if (tagIds.length > 0) {
      where.OR.push({ tags: { some: { tagId: { in: tagIds } } } });
    }

    const similar = await this.prisma.course.findMany({
      where,
      orderBy: { popularityScore: 'desc' },
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        subtitle: true,
        thumbnailUrl: true,
        price: true,
        discountPrice: true,
        isFree: true,
        level: true,
        averageRating: true,
        totalRatings: true,
        totalEnrollments: true,
        popularityScore: true,
        duration: true,
        category: { select: { id: true, name: true, slug: true } },
        teacher: {
          select: { id: true, displayName: true, avatarUrl: true, headline: true },
        },
        tags: {
          select: { tag: { select: { id: true, name: true, slug: true } } },
        },
      },
    });

    return similar;
  }
}
