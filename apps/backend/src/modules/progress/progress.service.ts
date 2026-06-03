import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { ProgressRepository } from './progress.repository';
import { TrackProgressDto } from './dto/track-progress.dto';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ProgressService {
  private readonly logger = new Logger(ProgressService.name);

  constructor(
    private readonly progressRepository: ProgressRepository,
    private readonly prisma: PrismaService,
  ) {}

  async trackProgress(userId: string, lessonId: string, dto: TrackProgressDto) {
    const lesson = await this.prisma.lesson.findFirst({
      where: { id: lessonId, deletedAt: null },
      select: {
        id: true,
        duration: true,
        section: {
          select: { courseId: true },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    const enrollment = await this.progressRepository.findEnrollmentByUserAndCourse(
      userId,
      lesson.section.courseId,
    );

    if (!enrollment) {
      throw new BadRequestException('You are not enrolled in this course');
    }

    const watchTime = dto.watchTime;
    const duration = dto.duration || lesson.duration;
    const lastPosition = dto.lastPosition ?? 0;
    const completionPercentage = duration > 0 ? Math.round((watchTime / duration) * 100) : 0;
    const isCompleted = dto.completed === true || completionPercentage >= 90;

    const progress = await this.progressRepository.upsert(userId, lessonId, {
      watchTime,
      duration,
      lastPosition,
      completionPercentage: Math.min(completionPercentage, 100),
      completed: isCompleted,
      isCompleted,
    });

    if (isCompleted) {
      await this.updateCourseProgress(userId, lesson.section.courseId, enrollment.id);
    }

    this.logger.log(`Progress tracked: user ${userId}, lesson ${lessonId}, ${completionPercentage}%`);
    return progress;
  }

  async markComplete(userId: string, lessonId: string) {
    const lesson = await this.prisma.lesson.findFirst({
      where: { id: lessonId, deletedAt: null },
      select: {
        id: true,
        duration: true,
        section: {
          select: { courseId: true },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    const enrollment = await this.progressRepository.findEnrollmentByUserAndCourse(
      userId,
      lesson.section.courseId,
    );

    if (!enrollment) {
      throw new BadRequestException('You are not enrolled in this course');
    }

    const progress = await this.progressRepository.upsert(userId, lessonId, {
      watchTime: lesson.duration,
      duration: lesson.duration,
      lastPosition: lesson.duration,
      completionPercentage: 100,
      completed: true,
      isCompleted: true,
    });

    await this.updateCourseProgress(userId, lesson.section.courseId, enrollment.id);

    const courseProgress = await this.calculateCourseProgress(userId, lesson.section.courseId);
    const certificateEligible = await this.checkCertificateEligibility(userId, lesson.section.courseId);

    this.logger.log(`Lesson marked complete: ${lessonId} by user ${userId}`);
    return {
      progress,
      courseProgress,
      certificateEligible,
    };
  }

  async getCourseProgress(userId: string, courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, totalLessons: true },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const enrollment = await this.progressRepository.findEnrollmentByUserAndCourse(userId, courseId);
    if (!enrollment) {
      throw new BadRequestException('You are not enrolled in this course');
    }

    const allProgress = await this.progressRepository.findAllProgressByUserAndCourse(userId, courseId);
    const totalLessons = await this.progressRepository.countCourseLessons(courseId);
    const completedLessons = allProgress.filter((p) => p.isCompleted).length;
    const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return {
      courseId,
      totalLessons,
      completedLessons,
      overallProgress,
      lessons: allProgress,
    };
  }

  async getLessonProgress(userId: string, lessonId: string) {
    const lesson = await this.prisma.lesson.findFirst({
      where: { id: lessonId, deletedAt: null },
      select: { id: true },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    const progress = await this.progressRepository.findByUserAndLesson(userId, lessonId);
    if (!progress) {
      return {
        lessonId,
        completed: false,
        isCompleted: false,
        watchTime: 0,
        duration: 0,
        completionPercentage: 0,
        lastPosition: 0,
      };
    }

    return progress;
  }

  private async updateCourseProgress(userId: string, courseId: string, enrollmentId: string) {
    const totalLessons = await this.progressRepository.countCourseLessons(courseId);
    const completedLessons = await this.progressRepository.findCompletedLessonsByUserAndCourse(userId, courseId);
    const completedCount = completedLessons.length;
    const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    const updateData: any = {
      progress: progressPercent,
      completedLessons: completedCount,
    };

    if (completedCount >= totalLessons && totalLessons > 0) {
      updateData.completedAt = new Date();
      updateData.status = 'COMPLETED';
    }

    await this.progressRepository.updateEnrollmentProgress(enrollmentId, updateData);
  }

  async calculateCourseProgress(userId: string, courseId: string) {
    const totalLessons = await this.progressRepository.countCourseLessons(courseId);
    const completedLessons = await this.progressRepository.findCompletedLessonsByUserAndCourse(userId, courseId);
    const completedCount = completedLessons.length;
    const overallProgress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    return {
      courseId,
      totalLessons,
      completedLessons: completedCount,
      overallProgress,
      isCompleted: completedCount >= totalLessons && totalLessons > 0,
    };
  }

  async checkCertificateEligibility(userId: string, courseId: string) {
    const totalLessons = await this.progressRepository.countCourseLessons(courseId);
    const completedLessons = await this.progressRepository.findCompletedLessonsByUserAndCourse(userId, courseId);
    const completedCount = completedLessons.length;

    const allCompleted = completedCount >= totalLessons && totalLessons > 0;
    if (!allCompleted) {
      return { eligible: false, reason: 'Not all lessons completed' };
    }

    const existingCertificate = await this.progressRepository.findCertificate(userId, courseId);
    if (existingCertificate) {
      return { eligible: true, certificate: existingCertificate };
    }

    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: { title: true },
    });

    const certificate = await this.progressRepository.createCertificate({
      title: course?.title ?? 'Course Certificate',
      certificateId: `CERT-${userId.slice(0, 8)}-${courseId.slice(0, 8)}-${Date.now()}`,
      status: 'GENERATED',
      user: { connect: { id: userId } },
      course: { connect: { id: courseId } },
    });

    this.logger.log(`Certificate generated: ${certificate.id} for user ${userId}, course ${courseId}`);
    return { eligible: true, certificate };
  }
}
