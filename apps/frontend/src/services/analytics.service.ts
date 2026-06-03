import { api } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import type { AdminAnalytics, ApiResponse, CourseAnalytics, DashboardStats } from '@/types';

export const analyticsService = {
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return api.get<DashboardStats>(API_ENDPOINTS.ANALYTICS.DASHBOARD);
  },

  async getCourseAnalytics(courseId: string): Promise<ApiResponse<CourseAnalytics>> {
    return api.get<CourseAnalytics>(API_ENDPOINTS.ANALYTICS.COURSE(courseId));
  },

  async getAdminAnalytics(): Promise<ApiResponse<AdminAnalytics>> {
    return api.get<AdminAnalytics>(API_ENDPOINTS.ANALYTICS.ADMIN);
  },
};
