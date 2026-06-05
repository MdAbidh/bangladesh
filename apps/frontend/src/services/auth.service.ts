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

const USE_MOCK_AUTH = process.env.NEXT_PUBLIC_USE_MOCK_AUTH !== 'false';

const MOCK_OTPS: Record<string, { otp: string; expiresAt: number }> = {};

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'admin@ahlearning.com': {
    password: 'Admin@123456',
    user: {
      id: 'admin-1',
      firebaseUid: 'mock-admin',
      email: 'admin@ahlearning.com',
      firstName: 'Admin',
      lastName: 'User',
      displayName: 'Admin User',
      avatarUrl: null,
      role: 'ADMIN',
      phoneNumber: null,
      bio: null,
      isActive: true,
      isEmailVerified: true,
      lastLoginAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
  'teacher@ahlearning.com': {
    password: 'Teacher@123456',
    user: {
      id: 'teacher-1',
      firebaseUid: 'mock-teacher',
      email: 'teacher@ahlearning.com',
      firstName: 'Sarah',
      lastName: 'Chen',
      displayName: 'Sarah Chen',
      avatarUrl: null,
      role: 'TEACHER',
      phoneNumber: null,
      bio: null,
      isActive: true,
      isEmailVerified: true,
      lastLoginAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
  'student@ahlearning.com': {
    password: 'Student@123456',
    user: {
      id: 'student-1',
      firebaseUid: 'mock-student',
      email: 'student@ahlearning.com',
      firstName: 'Alex',
      lastName: 'Johnson',
      displayName: 'Alex Johnson',
      avatarUrl: null,
      role: 'STUDENT',
      phoneNumber: null,
      bio: null,
      isActive: true,
      isEmailVerified: true,
      lastLoginAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
};

function generateMockToken(userId: string, role: string): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: userId,
      email: '',
      role,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
      iat: Math.floor(Date.now() / 1000),
    }),
  );
  const signature = btoa('mock-signature');
  return `${header}.${payload}.${signature}`;
}

function mockAuthResponse(user: User): AuthResponse {
  return {
    user,
    accessToken: generateMockToken(user.id, user.role),
    refreshToken: generateMockToken(user.id, user.role),
  };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const authService = {
  async register(payload: RegisterPayload): Promise<ApiResponse<AuthResponse>> {
    if (USE_MOCK_AUTH) {
      await delay(500);
      const newUser: User = {
        id: `user-${Date.now()}`,
        firebaseUid: `mock-${Date.now()}`,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        displayName: `${payload.firstName} ${payload.lastName}`,
        avatarUrl: null,
        role: 'STUDENT',
        phoneNumber: null,
        bio: null,
        isActive: true,
        isEmailVerified: false,
        lastLoginAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      MOCK_USERS[payload.email] = { password: payload.password, user: newUser };
      const otp = generateOTP();
      MOCK_OTPS[payload.email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };
      console.log(`[MOCK AUTH] OTP for ${payload.email}: ${otp} (valid 5 min)`);
      return { success: true, message: 'Registration successful. Check console for OTP.', data: mockAuthResponse(newUser) };
    }
    return api.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, payload);
  },

  async login(payload: LoginPayload): Promise<ApiResponse<AuthResponse>> {
    if (USE_MOCK_AUTH) {
      await delay(500);
      const mockEntry = MOCK_USERS[payload.email];
      if (mockEntry && mockEntry.password === payload.password) {
        return { success: true, message: 'Login successful', data: mockAuthResponse(mockEntry.user) };
      }
      throw new Error('Invalid email or password');
    }
    return api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, payload);
  },

  async verifyEmail(payload: { email: string; otp: string }): Promise<ApiResponse<{ message: string }>> {
    if (USE_MOCK_AUTH) {
      await delay(500);
      const stored = MOCK_OTPS[payload.email];
      if (!stored) {
        throw new Error('No OTP found. Please request a new one.');
      }
      if (Date.now() > stored.expiresAt) {
        delete MOCK_OTPS[payload.email];
        throw new Error('OTP has expired. Please request a new one.');
      }
      if (stored.otp !== payload.otp) {
        throw new Error('Invalid OTP. Please check and try again.');
      }
      delete MOCK_OTPS[payload.email];
      const mockEntry = MOCK_USERS[payload.email];
      if (mockEntry) {
        mockEntry.user.isEmailVerified = true;
      }
      return { success: true, message: 'Email verified', data: { message: 'Email verified successfully' } };
    }
    return api.post<{ message: string }>(API_ENDPOINTS.AUTH.VERIFY_EMAIL, payload);
  },

  async resendOtp(email: string): Promise<ApiResponse<{ message: string; otp?: string }>> {
    if (USE_MOCK_AUTH) {
      await delay(300);
      const otp = generateOTP();
      MOCK_OTPS[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };
      console.log(`[MOCK AUTH] New OTP for ${email}: ${otp} (valid 5 min)`);
      return { success: true, message: 'OTP sent. Check console.', data: { message: 'OTP sent', otp } };
    }
    return api.post<{ message: string }>(API_ENDPOINTS.AUTH.SEND_OTP, { email });
  },

  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthResponse>> {
    if (USE_MOCK_AUTH) {
      await delay(200);
      const stored = typeof window !== 'undefined' ? localStorage.getItem('ah-learning-auth') : null;
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.state?.user) {
          return { success: true, message: 'Token refreshed', data: mockAuthResponse(parsed.state.user) };
        }
      }
      throw new Error('No user found');
    }
    return api.post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH_TOKEN, { refreshToken });
  },

  async logout(): Promise<ApiResponse<{ message: string }>> {
    if (USE_MOCK_AUTH) {
      await delay(200);
      return { success: true, message: 'Logged out', data: { message: 'Logged out successfully' } };
    }
    return api.post<{ message: string }>(API_ENDPOINTS.AUTH.LOGOUT);
  },

  async getProfile(): Promise<ApiResponse<User>> {
    if (USE_MOCK_AUTH) {
      await delay(200);
      const stored = typeof window !== 'undefined' ? localStorage.getItem('ah-learning-auth') : null;
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.state?.user) {
          return { success: true, message: 'Profile fetched', data: parsed.state.user };
        }
      }
      throw new Error('Not authenticated');
    }
    return api.get<User>(API_ENDPOINTS.AUTH.PROFILE);
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<ApiResponse<User>> {
    if (USE_MOCK_AUTH) {
      await delay(300);
      const stored = typeof window !== 'undefined' ? localStorage.getItem('ah-learning-auth') : null;
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.state?.user) {
          const updated = { ...parsed.state.user, ...payload };
          return { success: true, message: 'Profile updated', data: updated };
        }
      }
      throw new Error('Not authenticated');
    }
    return api.put<User>(API_ENDPOINTS.AUTH.PROFILE, payload);
  },
};
