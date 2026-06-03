import { api } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import type { ApiResponse, Course, PaginatedResponse } from '@/types';

interface CourseFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  level?: string;
  language?: string;
  sortBy?: string;
  isFree?: boolean;
  priceMin?: number;
  priceMax?: number;
}

interface CreateCoursePayload {
  title: string;
  description: string;
  shortDescription: string;
  categoryId: string;
  level: string;
  language: string;
  price: number;
  thumbnailUrl?: string;
  prerequisites?: string[];
  learningObjectives?: string[];
  requirements?: string[];
  targetAudience?: string[];
}

interface UpdateCoursePayload extends Partial<CreateCoursePayload> {
  isPublished?: boolean;
  isFeatured?: boolean;
  status?: string;
}

export const courseService = {
  async getCourses(filters: CourseFilters = {}): Promise<ApiResponse<PaginatedResponse<Course>>> {
    return api.get<PaginatedResponse<Course>>(API_ENDPOINTS.COURSES.BASE, { params: filters });
  },

  async getFeaturedCourses(): Promise<ApiResponse<Course[]>> {
    return api.get<Course[]>(API_ENDPOINTS.COURSES.FEATURED);
  },

  async getPopularCourses(limit: number = 6): Promise<ApiResponse<Course[]>> {
    return api.get<Course[]>(API_ENDPOINTS.COURSES.POPULAR, { params: { limit } });
  },

  async getCourseBySlug(slug: string): Promise<ApiResponse<Course>> {
    return api.get<Course>(API_ENDPOINTS.COURSES.BY_SLUG(slug));
  },

  async createCourse(payload: CreateCoursePayload): Promise<ApiResponse<Course>> {
    return api.post<Course>(API_ENDPOINTS.COURSES.BASE, payload);
  },

  async updateCourse(id: string, payload: UpdateCoursePayload): Promise<ApiResponse<Course>> {
    return api.patch<Course>(API_ENDPOINTS.COURSES.BY_ID(id), payload);
  },

  async deleteCourse(id: string): Promise<ApiResponse<{ message: string }>> {
    return api.delete<{ message: string }>(API_ENDPOINTS.COURSES.BY_ID(id));
  },

  async getMyCourses(): Promise<ApiResponse<Course[]>> {
    return api.get<Course[]>(API_ENDPOINTS.COURSES.MY_COURSES);
  },

  async getCategories(): Promise<ApiResponse<unknown[]>> {
    return api.get<unknown[]>(API_ENDPOINTS.COURSES.CATEGORIES);
  },
};
