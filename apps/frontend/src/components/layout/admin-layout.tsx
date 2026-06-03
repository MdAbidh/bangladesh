'use client';

import { type ReactNode } from 'react';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FolderTree,
  MessageSquare,
  BarChart3,
  Settings as SettingsIcon,
  Shield,
} from 'lucide-react';
import { Sidebar } from './sidebar';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';
import { ROUTES } from '@/lib/constants';

interface AdminLayoutProps {
  children: ReactNode;
  className?: string;
}

const adminSections = [
  {
    label: 'Main',
    items: [
      { label: 'Dashboard', href: ROUTES.ADMIN.DASHBOARD, icon: LayoutDashboard },
      { label: 'Analytics', href: ROUTES.ADMIN.ANALYTICS, icon: BarChart3 },
    ],
  },
  {
    label: 'Management',
    items: [
      { label: 'Users', href: ROUTES.ADMIN.USERS, icon: Users },
      { label: 'Courses', href: ROUTES.ADMIN.COURSES, icon: BookOpen },
      { label: 'Categories', href: ROUTES.ADMIN.CATEGORIES, icon: FolderTree },
      { label: 'Reviews', href: ROUTES.ADMIN.REVIEWS, icon: MessageSquare },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Settings', href: ROUTES.ADMIN.SETTINGS, icon: SettingsIcon },
      { label: 'Roles & Permissions', href: '/admin/roles', icon: Shield },
    ],
  },
];

export function AdminLayout({ children, className }: AdminLayoutProps) {
  const { user } = useAuthStore();

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar
        sections={adminSections}
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
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-amber-500 text-white text-xs font-bold">
              AH
            </div>
            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">Admin</span>
          </div>
        }
      />
      <main className={cn('flex-1 transition-all duration-300', className)}>
        {children}
      </main>
    </div>
  );
}
