import { Injectable, Logger, NotFoundException, ConflictException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { EnrollmentStatus } from '@prisma/client';
import { EnrollmentsRepository } from './enrollments.repository';
import { EnrollDto } from './dto/enroll.dto';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class EnrollmentsService {
  private readonly logger = new Logger(EnrollmentsService.name);

  constructor(
    private readonly enrollmentsRepository: EnrollmentsRepository,
    private readonly prisma: PrismaService,
  ) {}

  async enroll(userId: string, dto: EnrollDto) {
    const course = await this.prisma.course.findUnique({
      where: { id: dto.courseId },
      select: { id: true, status: true, totalLessons: true },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.status !== 'PUBLISHED') {
      throw new BadRequestException('Cannot enroll in a course that is not published');
    }

    const existing = await this.enrollmentsRepository.findByUserAndCourse(userId, dto.courseId);
    if (existing && existing.status === 'ACTIVE') {
      throw new ConflictException('You are already enrolled in this course');
    }

    if (existing && existing.status === 'CANCELLED') {
      const updated = await this.enrollmentsRepository.update(existing.id, {
        status: EnrollmentStatus.ACTIVE,
        enrolledAt: new Date(),
        progress: 0,
        completedLessons: 0,
        totalLessons: course.totalLessons,
        completedAt: null,
      });
      await this.enrollmentsRepository.incrementCourseEnrollments(dto.courseId);
      this.logger.log(`Enrollment re-activated: ${updated.id} for user ${userId}`);
      return updated;
    }

    const enrollment = await this.enrollmentsRepository.create({
      status: EnrollmentStatus.ACTIVE,
      totalLessons: course.totalLessons,
      user: { connect: { id: userId } },
      course: { connect: { id: dto.courseId } },
    });

    await this.enrollmentsRepository.incrementCourseEnrollments(dto.courseId);

    this.logger.log(`User ${userId} enrolled in course ${dto.courseId}`);
    return enrollment;
  }

  async findMyEnrollments(userId: string) {
    const enrollments = await this.enrollmentsRepository.findByUser(userId);

    const enriched = await Promise.all(
      enrollments.map(async (enrollment) => {
        const totalLessons = enrollment.course.totalLessons;
        const completedLessons = enrollment.completedLessons;
        const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

        return {
          ...enrollment,
          progress,
        };
      }),
    );

    return enriched;
  }

  async findCourseEnrollments(courseId: string, userId: string, userRole: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, teacherId: true },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (userRole !== 'ADMIN' && course.teacherId !== userId) {
      throw new ForbiddenException('You can only view enrollments for your own courses');
    }

    return this.enrollmentsRepository.findByCourse(courseId);
  }

  async findById(id: string) {
    const enrollment = await this.enrollmentsRepository.findById(id);
    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }
    return enrollment;
  }

  async cancelEnrollment(id: string, userId: string, userRole: string) {
    const enrollment = await this.enrollmentsRepository.findById(id);
    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    if (userRole !== 'ADMIN' && enrollment.userId !== userId) {
      throw new ForbiddenException('You can only cancel your own enrollments');
    }

    const updated = await this.enrollmentsRepository.update(id, {
      status: EnrollmentStatus.CANCELLED,
    });

    this.logger.log(`Enrollment cancelled: ${id} by user ${userId}`);
    return updated;
  }

  async checkEnrollment(userId: string, courseId: string) {
    const enrollment = await this.enrollmentsRepository.findByUserAndCourse(userId, courseId);
    return {
      isEnrolled: !!enrollment && enrollment.status === 'ACTIVE',
      enrollment,
    };
  }
}
