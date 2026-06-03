import { api } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import type { ApiResponse, User } from '@/types';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatarUrl?: string;
  phoneNumber?: string;
  bio?: string;
}

export const authService = {
  async register(payload: RegisterPayload): Promise<ApiResponse<AuthResponse>> {
    return api.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, payload);
  },

  async login(payload: LoginPayload): Promise<ApiResponse<AuthResponse>> {
    return api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, payload);
  },

  async verifyEmail(token: string): Promise<ApiResponse<{ message: string }>> {
    return api.post<{ message: string }>(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token });
  },

  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthResponse>> {
    return api.post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH_TOKEN, { refreshToken });
  },

  async logout(): Promise<ApiResponse<{ message: string }>> {
    return api.post<{ message: string }>(API_ENDPOINTS.AUTH.LOGOUT);
  },

  async getProfile(): Promise<ApiResponse<User>> {
    return api.get<User>(API_ENDPOINTS.AUTH.PROFILE);
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<ApiResponse<User>> {
    return api.patch<User>(API_ENDPOINTS.AUTH.PROFILE, payload);
  },
};
