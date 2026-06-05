export const APP_NAME = 'A.H Learning App';

export const ROLES = {
  ADMIN: 'ADMIN' as const,
  TEACHER: 'TEACHER' as const,
  STUDENT: 'STUDENT' as const,
} as const;

export const COURSE_LEVELS = {
  BEGINNER: 'BEGINNER' as const,
  INTERMEDIATE: 'INTERMEDIATE' as const,
  ADVANCED: 'ADVANCED' as const,
  ALL_LEVELS: 'ALL_LEVELS' as const,
} as const;

export const COURSE_STATUS = {
  DRAFT: 'DRAFT' as const,
  PUBLISHED: 'PUBLISHED' as const,
  ARCHIVED: 'ARCHIVED' as const,
} as const;

export const ENROLLMENT_STATUS = {
  ACTIVE: 'ACTIVE' as const,
  COMPLETED: 'COMPLETED' as const,
  CANCELLED: 'CANCELLED' as const,
  EXPIRED: 'EXPIRED' as const,
} as const;

export const LESSON_TYPES = {
  VIDEO: 'VIDEO' as const,
  ARTICLE: 'ARTICLE' as const,
  QUIZ: 'QUIZ' as const,
  ASSIGNMENT: 'ASSIGNMENT' as const,
  RESOURCE: 'RESOURCE' as const,
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  COURSES: '/courses',
  COURSE_DETAIL: (slug: string) => `/courses/${slug}`,
  LESSON: (courseSlug: string, lessonId: string) => `/courses/${courseSlug}/lessons/${lessonId}`,
  DASHBOARD: '/dashboard',
  MY_COURSES: '/courses',
  MY_LEARNING: '/my-learning',
  PROGRESS: '/my-learning',
  CERTIFICATES: '/certificates',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  TEACHER: {
    DASHBOARD: '/teacher',
    COURSES: '/teacher/courses',
    CREATE_COURSE: '/teacher/courses/create',
    EDIT_COURSE: (id: string) => `/teacher/courses/${id}/edit`,
    COURSE_ANALYTICS: (id: string) => `/teacher/courses/${id}/analytics`,
    STUDENTS: '/teacher/students',
    EARNINGS: '/teacher/earnings',
  },
  ADMIN: {
    DASHBOARD: '/admin',
    USERS: '/admin/users',
    COURSES: '/admin/courses',
    CATEGORIES: '/admin/categories',
    REVIEWS: '/admin/reviews',
    ANALYTICS: '/admin/analytics',
    SETTINGS: '/admin/settings',
  },
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_OTP: '/auth/send-otp',
    SEND_OTP: '/auth/send-otp',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    PROFILE: '/users/profile',
    ME: '/auth/me',
  },
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
  },
  COURSES: {
    BASE: '/courses',
    FEATURED: '/courses/featured',
    POPULAR: '/courses/popular',
    BY_SLUG: (slug: string) => `/courses/${slug}`,
    BY_ID: (id: string) => `/courses/${id}`,
    MY_COURSES: '/courses/my',
    CATEGORIES: '/courses/categories',
  },
  ENROLLMENTS: {
    BASE: '/enrollments',
    MY_ENROLLMENTS: '/enrollments/my',
    BY_ID: (id: string) => `/enrollments/${id}`,
  },
  PROGRESS: {
    BASE: '/progress',
    COURSE: (enrollmentId: string) => `/progress/course/${enrollmentId}`,
    LESSON: (enrollmentId: string, lessonId: string) =>
      `/progress/${enrollmentId}/lessons/${lessonId}`,
    TRACK: '/progress/track',
    MARK_COMPLETE: (progressId: string) => `/progress/${progressId}/complete`,
  },
  REVIEWS: {
    BASE: '/reviews',
    BY_COURSE: (courseId: string) => `/reviews/course/${courseId}`,
  },
  CERTIFICATES: {
    BASE: '/certificates',
    MY_CERTIFICATES: '/certificates/my',
    VERIFY: (code: string) => `/certificates/verify/${code}`,
  },
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    COURSE: (courseId: string) => `/analytics/courses/${courseId}`,
    ADMIN: '/analytics/admin',
    TEACHER: '/analytics/teacher',
  },
  NOTIFICATIONS: {
    BASE: '/notifications',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
  },
  UPLOAD: {
    BASE: '/upload',
    VIDEO: '/upload/video',
    IMAGE: '/upload/image',
    FILE: '/upload/file',
  },
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  GRID_LIMIT: 12,
  LIST_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  STORAGE_KEY: 'ah-learning-theme',
} as const;

export const TOAST_DURATION = 4000;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;
