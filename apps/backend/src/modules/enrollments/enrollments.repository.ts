import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Prisma } from '@prisma/client';

const enrollmentWithCourseSelect: Prisma.EnrollmentSelect = {
  id: true,
  userId: true,
  courseId: true,
  status: true,
  progress: true,
  completedLessons: true,
  totalLessons: true,
  enrolledAt: true,
  completedAt: true,
  expiresAt: true,
  metadata: true,
  createdAt: true,
  updatedAt: true,
  course: {
    select: {
      id: true,
      title: true,
      slug: true,
      subtitle: true,
      description: true,
      thumbnailUrl: true,
      price: true,
      discountPrice: true,
      level: true,
      language: true,
      duration: true,
      totalLessons: true,
      totalSections: true,
      totalDuration: true,
      status: true,
      isFree: true,
      averageRating: true,
      totalRatings: true,
      totalEnrollments: true,
      categoryId: true,
      teacherId: true,
      createdAt: true,
      category: {
        select: { id: true, name: true, slug: true },
      },
      teacher: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          displayName: true,
          avatarUrl: true,
          headline: true,
        },
      },
    },
  },
};

const enrollmentSelect: Prisma.EnrollmentSelect = {
  id: true,
  userId: true,
  courseId: true,
  status: true,
  progress: true,
  completedLessons: true,
  totalLessons: true,
  enrolledAt: true,
  completedAt: true,
  expiresAt: true,
  metadata: true,
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class EnrollmentsRepository {
  private readonly logger = new Logger(EnrollmentsRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.EnrollmentCreateInput) {
    return this.prisma.enrollment.create({ data, select: enrollmentWithCourseSelect });
  }

  async findById(id: string) {
    return this.prisma.enrollment.findUnique({
      where: { id },
      select: enrollmentWithCourseSelect,
    });
  }

  async findByUserAndCourse(userId: string, courseId: string) {
    return this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
      select: enrollmentSelect,
    });
  }

  async findByUser(userId: string) {
    return this.prisma.enrollment.findMany({
      where: { userId },
      orderBy: { enrolledAt: 'desc' },
      select: {
        ...enrollmentWithCourseSelect,
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            subtitle: true,
            description: true,
            thumbnailUrl: true,
            price: true,
            discountPrice: true,
            level: true,
            language: true,
            duration: true,
            totalLessons: true,
            totalSections: true,
            totalDuration: true,
            status: true,
            isFree: true,
            averageRating: true,
            totalRatings: true,
            totalEnrollments: true,
            categoryId: true,
            teacherId: true,
            createdAt: true,
            category: {
              select: { id: true, name: true, slug: true },
            },
            teacher: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                displayName: true,
                avatarUrl: true,
                headline: true,
              },
            },
          },
        },
      },
    });
  }

  async findByCourse(courseId: string) {
    return this.prisma.enrollment.findMany({
      where: { courseId, status: 'ACTIVE' },
      orderBy: { enrolledAt: 'desc' },
      select: {
        id: true,
        userId: true,
        courseId: true,
        status: true,
        progress: true,
        completedLessons: true,
        totalLessons: true,
        enrolledAt: true,
        completedAt: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            displayName: true,
            avatarUrl: true,
            email: true,
          },
        },
      },
    });
  }

  async update(id: string, data: Prisma.EnrollmentUpdateInput) {
    return this.prisma.enrollment.update({
      where: { id },
      data,
      select: enrollmentWithCourseSelect,
    });
  }

  async incrementCourseEnrollments(courseId: string) {
    return this.prisma.course.update({
      where: { id: courseId },
      data: { totalEnrollments: { increment: 1 } },
    });
  }

  async getCourseTotalLessons(courseId: string) {
    const result = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: { totalLessons: true },
    });
    return result?.totalLessons ?? 0;
  }
}
