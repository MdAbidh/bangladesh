import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Prisma } from '@prisma/client';

const progressSelect: Prisma.ProgressSelect = {
  id: true,
  userId: true,
  lessonId: true,
  completed: true,
  watchTime: true,
  duration: true,
  completionPercentage: true,
  lastPosition: true,
  isCompleted: true,
  completedAt: true,
  metadata: true,
  createdAt: true,
  updatedAt: true,
};

const progressWithLessonSelect: Prisma.ProgressSelect = {
  ...progressSelect,
  lesson: {
    select: {
      id: true,
      title: true,
      description: true,
      lessonType: true,
      sortOrder: true,
      duration: true,
      sectionId: true,
      section: {
        select: {
          id: true,
          title: true,
          sortOrder: true,
        },
      },
    },
  },
};

@Injectable()
export class ProgressRepository {
  private readonly logger = new Logger(ProgressRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async upsert(
    userId: string,
    lessonId: string,
    data: Prisma.ProgressUpdateInput & { watchTime: number; duration: number; lastPosition: number; completionPercentage: number; completed: boolean; isCompleted: boolean },
  ) {
    return this.prisma.progress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: {
        watchTime: data.watchTime,
        duration: data.duration,
        lastPosition: data.lastPosition,
        completionPercentage: data.completionPercentage,
        completed: data.completed,
        isCompleted: data.isCompleted,
        completedAt: data.isCompleted ? new Date() : null,
      },
      create: {
        userId,
        lessonId,
        watchTime: data.watchTime,
        duration: data.duration,
        lastPosition: data.lastPosition,
        completionPercentage: data.completionPercentage,
        completed: data.completed,
        isCompleted: data.isCompleted,
        completedAt: data.isCompleted ? new Date() : null,
      },
      select: progressWithLessonSelect,
    });
  }

  async findByUserAndLesson(userId: string, lessonId: string) {
    return this.prisma.progress.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
      select: progressWithLessonSelect,
    });
  }

  async findCompletedLessonsByUserAndCourse(userId: string, courseId: string) {
    return this.prisma.progress.findMany({
      where: {
        userId,
        isCompleted: true,
        lesson: {
          section: { courseId },
        },
      },
      select: {
        lessonId: true,
        lesson: {
          select: {
            id: true,
            title: true,
            sectionId: true,
            section: {
              select: { id: true, title: true, courseId: true },
            },
          },
        },
      },
    });
  }

  async findAllProgressByUserAndCourse(userId: string, courseId: string) {
    return this.prisma.progress.findMany({
      where: {
        userId,
        lesson: {
          section: { courseId },
        },
      },
      select: progressWithLessonSelect,
      orderBy: {
        lesson: {
          sortOrder: 'asc',
        },
      },
    });
  }

  async updateEnrollmentProgress(
    enrollmentId: string,
    data: { progress: number; completedLessons: number; completedAt?: Date | null; status?: string },
  ) {
    const updateData: any = {
      progress: data.progress,
      completedLessons: data.completedLessons,
    };
    if (data.completedAt !== undefined) {
      updateData.completedAt = data.completedAt;
    }
    if (data.status !== undefined) {
      updateData.status = data.status;
    }
    return this.prisma.enrollment.update({
      where: { id: enrollmentId },
      data: updateData,
    });
  }

  async findEnrollmentByUserAndCourse(userId: string, courseId: string) {
    return this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
      select: { id: true, progress: true, completedLessons: true, totalLessons: true },
    });
  }

  async findCertificate(userId: string, courseId: string) {
    return this.prisma.certificate.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
  }

  async createCertificate(data: Prisma.CertificateCreateInput) {
    return this.prisma.certificate.create({ data });
  }

  async countCourseLessons(courseId: string) {
    return this.prisma.lesson.count({
      where: {
        section: { courseId },
        deletedAt: null,
      },
    });
  }
}
