import { api } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import type { ApiResponse, Enrollment, PaginatedResponse } from '@/types';

interface EnrollmentFilters {
  page?: number;
  limit?: number;
  status?: string;
}

export const enrollmentService = {
  async enroll(courseId: string): Promise<ApiResponse<Enrollment>> {
    return api.post<Enrollment>(API_ENDPOINTS.ENROLLMENTS.BASE, { courseId });
  },

  async getMyEnrollments(
    filters: EnrollmentFilters = {},
  ): Promise<ApiResponse<PaginatedResponse<Enrollment>>> {
    return api.get<PaginatedResponse<Enrollment>>(API_ENDPOINTS.ENROLLMENTS.MY_ENROLLMENTS, {
      params: filters,
    });
  },

  async cancelEnrollment(id: string): Promise<ApiResponse<Enrollment>> {
    return api.patch<Enrollment>(API_ENDPOINTS.ENROLLMENTS.BY_ID(id), {
      status: 'CANCELLED',
    });
  },
};
