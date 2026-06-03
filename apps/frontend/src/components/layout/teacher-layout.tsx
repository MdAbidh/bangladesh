'use client';

import { type ReactNode } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  DollarSign,
  BarChart3,
  MessageSquare,
  Settings,
  PlusCircle,
} from 'lucide-react';
import { Sidebar } from './sidebar';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';
import { ROUTES } from '@/lib/constants';

interface TeacherLayoutProps {
  children: ReactNode;
  className?: string;
}

const teacherSections = [
  {
    label: 'Main',
    items: [
      { label: 'Dashboard', href: ROUTES.TEACHER.DASHBOARD, icon: LayoutDashboard },
      { label: 'My Courses', href: ROUTES.TEACHER.COURSES, icon: BookOpen },
      { label: 'Create Course', href: ROUTES.TEACHER.CREATE_COURSE, icon: PlusCircle },
    ],
  },
  {
    label: 'Management',
    items: [
      { label: 'Students', href: ROUTES.TEACHER.STUDENTS, icon: Users },
      { label: 'Earnings', href: ROUTES.TEACHER.EARNINGS, icon: DollarSign },
      { label: 'Analytics', href: '/teacher/analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'Settings',
    items: [
      { label: 'Discussions', href: '/teacher/discussions', icon: MessageSquare },
      { label: 'Settings', href: ROUTES.SETTINGS, icon: Settings },
    ],
  },
];

export function TeacherLayout({ children, className }: TeacherLayoutProps) {
  const { user } = useAuthStore();

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar
        sections={teacherSections}
        user={
          user
            ? {
                name: user.displayName,
                email: user.email,
                avatarUrl: user.avatarUrl,
                role: user.role,
              }
            : null
        }
        header={
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 text-white text-xs font-bold">
              AH
            </div>
            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">Teacher</span>
          </div>
        }
      />
      <main className={cn('flex-1 transition-all duration-300', className)}>
        {children}
      </main>
    </div>
  );
}
