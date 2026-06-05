'use client';

import { type ReactNode } from 'react';
import { BookOpen, GraduationCap, LayoutDashboard, User, Settings, Award, BarChart3 } from 'lucide-react';
import { Navbar } from './navbar';
import { Footer } from './footer';
import { cn } from '@/lib/utils';

interface StudentLayoutProps {
  children: ReactNode;
  className?: string;
  hideFooter?: boolean;
  notificationCount?: number;
}

const studentSections = [
  {
    label: 'Main',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { label: 'My Courses', href: '/courses', icon: BookOpen },
      { label: 'My Learning', href: '/my-learning', icon: GraduationCap },
    ],
  },
  {
    label: 'Achievements',
    items: [
      { label: 'Progress', href: '/my-learning', icon: BarChart3 },
      { label: 'Certificates', href: '/certificates', icon: Award },
    ],
  },
  {
    label: 'Account',
    items: [
      { label: 'Profile', href: '/profile', icon: User },
      { label: 'Settings', href: '/settings', icon: Settings },
    ],
  },
];

export function StudentLayout({ children, className, hideFooter, notificationCount }: StudentLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar notificationCount={notificationCount} />
      <main className={cn('pt-16', className)}>
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}
