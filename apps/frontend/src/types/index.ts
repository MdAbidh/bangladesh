export interface User {
  id: string;
  firebaseUid: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatarUrl: string | null;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
  phoneNumber: string | null;
  bio: string | null;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description?: string;
  shortDescription: string;
  thumbnailUrl: string | null;
  category: Category;
  tags: string[];
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVELS';
  language: string;
  duration: number;
  totalLessons: number;
  totalSections: number;
  totalEnrollments: number;
  averageRating: number;
  totalReviews: number;
  price: number;
  discountedPrice: number | null;
  isFree: boolean;
  isPublished: boolean;
  isFeatured: boolean;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  teacher: User;
  sections: Section[];
  prerequisites: string[];
  learningObjectives: string[];
  requirements: string[];
  targetAudience: string[];
  certificateEnabled: boolean;
  passingGrade: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  parentId: string | null;
  children: Category[];
  courseCount: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Section {
  id: string;
  title: string;
  description: string | null;
  sortOrder: number;
  lessons: Lesson[];
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string | null;
  lessonType: 'VIDEO' | 'ARTICLE' | 'QUIZ' | 'ASSIGNMENT' | 'RESOURCE';
  duration: number;
  sortOrder: number;
  video: Video | null;
  content: string | null;
  resources: Resource[];
  isFree: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Video {
  id: string;
  title: string;
  description: string | null;
  status: 'PROCESSING' | 'READY' | 'FAILED';
  firebaseUrl: string | null;
  hlsUrl: string | null;
  thumbnailUrl: string | null;
  duration: number;
  fileSize: number | null;
  mimeType: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Resource {
  id: string;
  title: string;
  type: 'PDF' | 'DOC' | 'IMAGE' | 'VIDEO' | 'LINK' | 'CODE' | 'OTHER';
  url: string;
  fileSize: number | null;
  createdAt: string;
}

export interface Enrollment {
  id: string;
  course: Course;
  user: User;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED';
  progress: number;
  completedLessons: number;
  totalLessons: number;
  enrolledAt: string;
  completedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Progress {
  id: string;
  enrollment: Enrollment;
  lesson: Lesson;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  completionPercentage: number;
  lastPosition: number;
  timeSpent: number;
  attempts: number;
  score: number | null;
  isPassed: boolean | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Certificate {
  id: string;
  user: User;
  course: Course;
  certificateUrl: string;
  issuedAt: string;
  expiryDate: string | null;
  certificateNumber: string;
  grade: string | null;
  createdAt: string;
}

export interface Review {
  id: string;
  course: Course;
  user: User;
  rating: number;
  content: string | null;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Rating {
  average: number;
  count: number;
  distribution: { 1: number; 2: number; 3: number; 4: number; 5: number };
}

export interface Bookmark {
  id: string;
  user: User;
  course: Course | null;
  lesson: Lesson | null;
  note: string | null;
  createdAt: string;
}

export interface DiscussionThread {
  id: string;
  course: Course;
  lesson: Lesson | null;
  user: User;
  title: string;
  content: string;
  isPinned: boolean;
  isResolved: boolean;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DiscussionComment {
  id: string;
  thread: DiscussionThread;
  user: User;
  content: string;
  isSolution: boolean;
  parentId: string | null;
  replies: DiscussionComment[];
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  user: User;
  type: 'ENROLLMENT' | 'PROGRESS' | 'CERTIFICATE' | 'REVIEW' | 'DISCUSSION' | 'SYSTEM';
  title: string;
  message: string;
  data: Record<string, unknown> | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface DashboardStats {
  totalEnrollments: number;
  activeCourses: number;
  completedLessons: number;
  averageScore: number;
  totalTimeSpent: number;
  recentActivity: {
    courseTitle: string;
    lessonTitle: string;
    timestamp: string;
    type: string;
  }[];
  enrollmentTrend: { date: string; count: number }[];
  progressByCourse: { courseTitle: string; progress: number }[];
}

export interface CourseAnalytics {
  totalEnrollments: number;
  totalReviews: number;
  averageRating: number;
  completionRate: number;
  totalRevenue: number;
  lessonCompletions: { lessonTitle: string; completions: number }[];
  enrollmentTrend: { date: string; count: number }[];
  ratingDistribution: { rating: number; count: number }[];
  studentProgress: { progress: number; count: number }[];
}

export interface AdminAnalytics {
  totalUsers: number;
  totalTeachers: number;
  totalStudents: number;
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  totalCertificates: number;
  activeUsersToday: number;
  newUsersThisMonth: number;
  revenueThisMonth: number;
  topCourses: { title: string; enrollments: number; revenue: number }[];
  userGrowth: { date: string; count: number }[];
  revenueTrend: { date: string; amount: number }[];
  courseDistribution: { category: string; count: number }[];
}
