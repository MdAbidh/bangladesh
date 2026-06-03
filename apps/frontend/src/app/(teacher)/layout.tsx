'use client';

import { type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Upload,
  BarChart3,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  Bell,
  PlusCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TeacherLayout as AppTeacherLayout } from '@/components/layout/teacher-layout';
import { motion } from 'framer-motion';

const sidebarLinks = [
  { label: 'Dashboard', href: '/teacher', icon: LayoutDashboard },
  { label: 'My Courses', href: '/teacher/courses', icon: BookOpen },
  { label: 'Create Course', href: '/teacher/courses/new', icon: PlusCircle },
  { label: 'Upload Center', href: '/teacher/upload', icon: Upload },
  { label: 'Analytics', href: '/teacher/analytics', icon: BarChart3 },
  { label: 'Students', href: '/teacher/students', icon: Users },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AppTeacherLayout>
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <aside className="hidden w-56 flex-shrink-0 lg:block">
          <nav className="sticky top-24 space-y-1 rounded-2xl border border-purple-200/40 bg-white/60 backdrop-blur-xl p-2 dark:border-purple-900/30 dark:bg-gray-950/60">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Link key={link.href} href={link.href}>
                  <motion.span
                    whileHover={{ x: 4 }}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-gradient-to-r from-purple-500/10 to-indigo-500/5 text-purple-700 dark:text-purple-300'
                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/50',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="teacher-sidebar-active"
                        className="ml-auto h-1.5 w-1.5 rounded-full bg-purple-500"
                      />
                    )}
                  </motion.span>
                </Link>
              );
            })}
            <div className="my-2 border-t border-gray-200 dark:border-gray-800" />
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/50">
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </nav>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </AppTeacherLayout>
  );
}
