import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AnalyticsRepository {
  private readonly logger = new Logger(AnalyticsRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findCourseOwner(courseId: string) {
    return this.prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, teacherId: true },
    });
  }

  async findCourseAnalytics(courseId: string) {
    let analytics = await this.prisma.courseAnalytics.findUnique({
      where: { courseId },
    });

    if (!analytics) {
      analytics = await this.prisma.courseAnalytics.create({
        data: { courseId },
      });
    }

    return analytics;
  }

  async incrementWatchTime(courseId: string, duration: number) {
    await this.prisma.courseAnalytics.upsert({
      where: { courseId },
      update: {
        totalWatchTime: { increment: duration },
        averageWatchTime: { increment: duration },
      },
      create: {
        courseId,
        totalWatchTime: duration,
        averageWatchTime: duration,
      },
    });
  }

  async recordView(courseId: string) {
    await this.prisma.courseAnalytics.upsert({
      where: { courseId },
      update: { totalViews: { increment: 1 } },
      create: { courseId, totalViews: 1 },
    });
  }

  async incrementEnrollment(courseId: string) {
    await this.prisma.courseAnalytics.upsert({
      where: { courseId },
      update: { totalEnrollments: { increment: 1 } },
      create: { courseId, totalEnrollments: 1 },
    });
  }

  async incrementCompletion(courseId: string) {
    await this.prisma.courseAnalytics.upsert({
      where: { courseId },
      update: { totalCompletions: { increment: 1 } },
      create: { courseId, totalCompletions: 1 },
    });
  }

  async countUserEnrollments(userId: string) {
    return this.prisma.enrollment.count({
      where: { userId },
    });
  }

  async countUserCompletedCourses(userId: string) {
    return this.prisma.enrollment.count({
      where: { userId, status: 'COMPLETED' },
    });
  }

  async getUserTotalWatchTime(userId: string) {
    const result = await this.prisma.progress.aggregate({
      where: { userId },
      _sum: { watchTime: true },
    });
    return result._sum.watchTime || 0;
  }

  async countUserCertificates(userId: string) {
    return this.prisma.certificate.count({
      where: { userId, status: 'GENERATED' },
    });
  }

  async findTeacherCourses(teacherId: string) {
    return this.prisma.course.findMany({
      where: { teacherId, deletedAt: null },
      select: { id: true },
    });
  }

  async countTotalStudentsForCourses(courseIds: string[]) {
    return this.prisma.enrollment.count({
      where: { courseId: { in: courseIds }, status: 'ACTIVE' },
    });
  }

  async getTotalRevenueForCourses(courseIds: string[]) {
    const result = await this.prisma.course.aggregate({
      where: { id: { in: courseIds } },
      _sum: { price: true },
    });
    return Number(result._sum.price || 0);
  }

  async getAverageRatingForCourses(courseIds: string[]) {
    const result = await this.prisma.course.aggregate({
      where: { id: { in: courseIds }, deletedAt: null },
      _avg: { averageRating: true },
    });
    return Number(result._avg.averageRating || 0);
  }

  async getTotalReviewsForCourses(courseIds: string[]) {
    return this.prisma.courseReview.count({
      where: { courseId: { in: courseIds }, deletedAt: null },
    });
  }

  async countAllUsers() {
    return this.prisma.user.count();
  }

  async countAllCourses() {
    return this.prisma.course.count({ where: { deletedAt: null } });
  }

  async countAllEnrollments() {
    return this.prisma.enrollment.count();
  }

  async getTotalRevenue() {
    const result = await this.prisma.course.aggregate({
      where: { deletedAt: null },
      _sum: { price: true },
    });
    return Number(result._sum.price || 0);
  }

  async countActiveUsersToday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.prisma.watchHistory.count({
      where: { watchedAt: { gte: today } },
    });
  }

  async countActiveUsersThisWeek() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);
    return this.prisma.watchHistory.count({
      where: { watchedAt: { gte: startOfWeek } },
    });
  }

  async countActiveUsersThisMonth() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return this.prisma.watchHistory.count({
      where: { watchedAt: { gte: startOfMonth } },
    });
  }

  async countAllCompletions() {
    return this.prisma.enrollment.count({
      where: { status: 'COMPLETED' },
    });
  }

  async findPopularCourses(limit: number) {
    return this.prisma.course.findMany({
      where: { status: 'PUBLISHED', deletedAt: null },
      orderBy: { popularityScore: 'desc' },
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        totalEnrollments: true,
        averageRating: true,
        popularityScore: true,
      },
    });
  }

  async countNewUsersInRange(start: Date, end: Date) {
    return this.prisma.user.count({
      where: { createdAt: { gte: start, lte: end } },
    });
  }

  async countNewEnrollmentsInRange(start: Date, end: Date) {
    return this.prisma.enrollment.count({
      where: { enrolledAt: { gte: start, lte: end } },
    });
  }

  async countNewCoursesInRange(start: Date, end: Date) {
    return this.prisma.course.count({
      where: { createdAt: { gte: start, lte: end }, deletedAt: null },
    });
  }

  async countActiveUsersInRange(start: Date, end: Date) {
    return this.prisma.watchHistory.count({
      where: { watchedAt: { gte: start, lte: end } },
    });
  }

  async getRevenueInRange(start: Date, end: Date) {
    const result = await this.prisma.enrollment.aggregate({
      where: { enrolledAt: { gte: start, lte: end } },
      _count: true,
    });
    return result._count;
  }

  async saveSystemMetric(metric: string, value: string) {
    return this.prisma.systemMetric.create({
      data: { metric, value: 0, metadata: { report: value } },
    });
  }
}
