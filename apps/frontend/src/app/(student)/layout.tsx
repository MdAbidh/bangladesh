'use client';

import { type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Award,
  Bookmark,
  User,
  Bell,
  ChevronLeft,
  LogOut,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { StudentLayout as AppStudentLayout } from '@/components/layout/student-layout';
import { useAuth } from '@/hooks/use-auth';
import { motion } from 'framer-motion';

const sidebarLinks = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Courses', href: '/courses', icon: BookOpen },
  { label: 'My Learning', href: '/my-learning', icon: GraduationCap },
  { label: 'Certificates', href: '/certificates', icon: Award },
  { label: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
  { label: 'Profile', href: '/profile', icon: User },
  { label: 'Notifications', href: '/notifications', icon: Bell },
];

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <AppStudentLayout>
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Sidebar */}
        <aside className="hidden w-56 flex-shrink-0 lg:block">
          <div className="sticky top-24 space-y-1 rounded-2xl border border-gray-200/80 bg-white/60 p-2 backdrop-blur-xl dark:border-gray-800/80 dark:bg-gray-950/60">
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
                        ? 'bg-gradient-to-r from-primary-500/10 to-primary-500/5 text-primary-700 dark:text-primary-300'
                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/50',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-500"
                      />
                    )}
                  </motion.span>
                </Link>
              );
            })}
            <div className="my-2 border-t border-gray-200 dark:border-gray-800" />
            <Link href="/settings">
              <span className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/50">
                <Settings className="h-4 w-4" />
                Settings
              </span>
            </Link>
            <button
              type="button"
              onClick={() => logout()}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/50"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="min-w-0 flex-1">
          {children}
        </main>
      </div>
    </AppStudentLayout>
  );
}
