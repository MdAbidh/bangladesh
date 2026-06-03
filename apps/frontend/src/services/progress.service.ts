import { api } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import type { ApiResponse, Progress } from '@/types';

interface TrackProgressPayload {
  enrollmentId: string;
  lessonId: string;
  completionPercentage: number;
  lastPosition: number;
  timeSpent: number;
}

export const progressService = {
  async trackProgress(payload: TrackProgressPayload): Promise<ApiResponse<Progress>> {
    return api.post<Progress>(API_ENDPOINTS.PROGRESS.TRACK, payload);
  },

  async markComplete(progressId: string): Promise<ApiResponse<Progress>> {
    return api.patch<Progress>(API_ENDPOINTS.PROGRESS.MARK_COMPLETE(progressId));
  },

  async getCourseProgress(enrollmentId: string): Promise<ApiResponse<Progress[]>> {
    return api.get<Progress[]>(API_ENDPOINTS.PROGRESS.COURSE(enrollmentId));
  },

  async getLessonProgress(
    enrollmentId: string,
    lessonId: string,
  ): Promise<ApiResponse<Progress>> {
    return api.get<Progress>(API_ENDPOINTS.PROGRESS.LESSON(enrollmentId, lessonId));
  },
};
