import { Injectable, Logger, ForbiddenException, NotFoundException } from '@nestjs/common';
import { AnalyticsRepository } from './analytics.repository';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private readonly analyticsRepository: AnalyticsRepository) {}

  async trackEvent(event: {
    eventType: string;
    courseId?: string;
    userId?: string;
    metadata?: Record<string, unknown>;
  }) {
    this.logger.log(`Tracking event: ${event.eventType}`);
    if (event.eventType === 'watch_time' && event.courseId) {
      await this.analyticsRepository.incrementWatchTime(event.courseId, (event.metadata?.duration as number) || 0);
    }
    if (event.eventType === 'view' && event.courseId) {
      await this.analyticsRepository.recordView(event.courseId);
    }
    if (event.eventType === 'enrollment' && event.courseId) {
      await this.analyticsRepository.incrementEnrollment(event.courseId);
    }
    if (event.eventType === 'completion' && event.courseId) {
      await this.analyticsRepository.incrementCompletion(event.courseId);
    }
  }

  async getDashboardStats(userId: string, role: string) {
    if (role === 'STUDENT') {
      return this.getStudentDashboard(userId);
    }
    if (role === 'TEACHER') {
      return this.getTeacherDashboard(userId);
    }
    return this.getAdminAnalytics();
  }

  private async getStudentDashboard(userId: string) {
    const [
      enrollments,
      completedCourses,
      totalWatchTime,
      certificates,
    ] = await Promise.all([
      this.analyticsRepository.countUserEnrollments(userId),
      this.analyticsRepository.countUserCompletedCourses(userId),
      this.analyticsRepository.getUserTotalWatchTime(userId),
      this.analyticsRepository.countUserCertificates(userId),
    ]);

    const inProgress = enrollments - completedCourses;

    return {
      totalEnrollments: enrollments,
      completedCourses,
      inProgress,
      totalWatchTime,
      certificates,
    };
  }

  private async getTeacherDashboard(userId: string) {
    const courses = await this.analyticsRepository.findTeacherCourses(userId);
    const courseIds = courses.map((c: { id: string }) => c.id);

    const [
      totalStudents,
      totalRevenue,
      averageRating,
      totalReviews,
    ] = await Promise.all([
      this.analyticsRepository.countTotalStudentsForCourses(courseIds),
      this.analyticsRepository.getTotalRevenueForCourses(courseIds),
      this.analyticsRepository.getAverageRatingForCourses(courseIds),
      this.analyticsRepository.getTotalReviewsForCourses(courseIds),
    ]);

    return {
      totalCourses: courses.length,
      totalStudents,
      totalRevenue,
      averageRating,
      totalReviews,
    };
  }

  async getCourseAnalytics(courseId: string, userId: string, userRole: string) {
    const course = await this.analyticsRepository.findCourseOwner(courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (userRole !== 'ADMIN' && course.teacherId !== userId) {
      throw new ForbiddenException('You can only view analytics for your own courses');
    }

    const dbAnalytics = await this.analyticsRepository.findCourseAnalytics(courseId);
    return dbAnalytics;
  }

  async getAdminAnalytics() {
    const [
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalRevenue,
      activeToday,
      activeThisWeek,
      activeThisMonth,
      popularCourses,
      totalCompletions,
    ] = await Promise.all([
      this.analyticsRepository.countAllUsers(),
      this.analyticsRepository.countAllCourses(),
      this.analyticsRepository.countAllEnrollments(),
      this.analyticsRepository.getTotalRevenue(),
      this.analyticsRepository.countActiveUsersToday(),
      this.analyticsRepository.countActiveUsersThisWeek(),
      this.analyticsRepository.countActiveUsersThisMonth(),
      this.analyticsRepository.findPopularCourses(10),
      this.analyticsRepository.countAllCompletions(),
    ]);

    return {
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalRevenue,
      dau: activeToday,
      wau: activeThisWeek,
      mau: activeThisMonth,
      popularCourses,
      totalCompletions,
    };
  }

  async generateReport(period: 'daily' | 'weekly' | 'monthly', date: Date) {
    const now = new Date(date);
    let startDate: Date;

    switch (period) {
      case 'daily':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'weekly':
        const dayOfWeek = now.getDay();
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }

    const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const [
      newUsers,
      newEnrollments,
      newCourses,
      activeUsers,
      revenue,
    ] = await Promise.all([
      this.analyticsRepository.countNewUsersInRange(startDate, endDate),
      this.analyticsRepository.countNewEnrollmentsInRange(startDate, endDate),
      this.analyticsRepository.countNewCoursesInRange(startDate, endDate),
      this.analyticsRepository.countActiveUsersInRange(startDate, endDate),
      this.analyticsRepository.getRevenueInRange(startDate, endDate),
    ]);

    const report = {
      period,
      startDate,
      endDate,
      metrics: {
        newUsers,
        newEnrollments,
        newCourses,
        activeUsers,
        revenue,
      },
    };

    await this.analyticsRepository.saveSystemMetric(`report_${period}`, JSON.stringify(report));

    return report;
  }
}
