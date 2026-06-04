'use client';

import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { authService } from '@/services/auth.service';
import type { LoginPayload, RegisterPayload, UpdateProfilePayload } from './types';

interface AuthActions {
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

function getRoleRedirect(role?: string): string {
  switch (role) {
    case 'ADMIN':
      return '/admin/dashboard';
    case 'TEACHER':
      return '/teacher';
    default:
      return '/dashboard';
  }
}

export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, setUser, clearUser, setLoading } = useAuthStore();

  const refreshProfile = useCallback(async () => {
    try {
      const response = await authService.getProfile();
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch {
      clearUser();
    }
  }, [setUser, clearUser]);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token && !user) {
      refreshProfile();
    } else {
      setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(
    async (payload: LoginPayload) => {
      setLoading(true);
      try {
        const response = await authService.login({
          email: payload.email,
          password: payload.password,
        });
        if (response.success && response.data) {
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          setUser(response.data.user);
          const redirectPath = getRoleRedirect(response.data.user?.role);
          router.push(redirectPath);
        }
      } finally {
        setLoading(false);
      }
    },
    [router, setUser, setLoading],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      setLoading(true);
      try {
        const response = await authService.register({
          email: payload.email,
          password: payload.password,
          firstName: payload.firstName,
          lastName: payload.lastName,
        });
        if (response.success && response.data) {
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          setUser(response.data.user);
          router.push('/dashboard');
        }
      } finally {
        setLoading(false);
      }
    },
    [router, setUser, setLoading],
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Proceed with local logout even if API call fails
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      clearUser();
      router.push('/login');
    }
  }, [router, clearUser]);

  const updateProfile = useCallback(
    async (payload: UpdateProfilePayload) => {
      const response = await authService.updateProfile(payload);
      if (response.success && response.data) {
        setUser(response.data);
      }
    },
    [setUser],
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    refreshProfile,
  } satisfies AuthActions & {
    user: typeof user;
    isAuthenticated: typeof isAuthenticated;
    isLoading: typeof isLoading;
    refreshProfile: () => Promise<void>;
  };
}
