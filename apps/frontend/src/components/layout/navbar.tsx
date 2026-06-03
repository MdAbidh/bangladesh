'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  User,
  BookOpen,
  Home,
  GraduationCap,
  LayoutDashboard,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { useAuthStore } from '@/store/auth-store';
import { useUIStore } from '@/store/ui-store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { motion, AnimatePresence } from 'framer-motion';

interface NavLink {
  label: string;
  href: string;
  icon: ReactNode;
}

const navLinks: NavLink[] = [
  { label: 'Home', href: ROUTES.HOME, icon: <Home className="h-4 w-4" /> },
  { label: 'Courses', href: ROUTES.COURSES, icon: <BookOpen className="h-4 w-4" /> },
  { label: 'My Learning', href: ROUTES.MY_LEARNING, icon: <GraduationCap className="h-4 w-4" /> },
  { label: 'Dashboard', href: ROUTES.DASHBOARD, icon: <LayoutDashboard className="h-4 w-4" /> },
];

interface NavbarProps {
  className?: string;
  onSearchOpen?: () => void;
  notificationCount?: number;
}

export function Navbar({ className, onSearchOpen, notificationCount = 0 }: NavbarProps) {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();
  const { mobileMenuOpen, toggleMobileMenu, setMobileMenuOpen } = useUIStore();
  const [scrolled, setScrolled] = useState(false);

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setScrolled(window.scrollY > 10);
    }, { passive: true });
  }

  const isActive = (href: string) => {
    if (href === ROUTES.HOME) return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        scrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50 dark:bg-gray-950/80 dark:border-gray-800/50'
          : 'bg-transparent',
        className,
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href={ROUTES.HOME} className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white text-sm font-bold">
            AH
          </div>
          <span className="hidden text-lg font-bold text-gray-900 sm:inline dark:text-gray-100">
            A.H Learning
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive(link.href)
                  ? 'text-primary-700 dark:text-primary-300'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800',
              )}
            >
              {link.icon}
              {link.label}
              {isActive(link.href) && (
                <motion.span
                  layoutId="navbar-active"
                  className="absolute inset-0 rounded-lg bg-primary-50 dark:bg-primary-950/50"
                  style={{ zIndex: -1 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <button
            onClick={onSearchOpen}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors dark:hover:bg-gray-800 dark:hover:text-gray-300"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          {isAuthenticated && user ? (
            <>
              {/* Notifications */}
              <button
                className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors dark:hover:bg-gray-800 dark:hover:text-gray-300"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <Badge variant="danger" size="sm" className="absolute -right-0.5 -top-0.5 px-1 py-0 min-w-[1.1rem]">
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </Badge>
                )}
              </button>

              {/* User Menu */}
              <DropdownMenu
                trigger={
                  <button className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-gray-100 transition-colors dark:hover:bg-gray-800">
                    <Avatar
                      src={user.avatarUrl}
                      alt={user.displayName}
                      fallback={`${user.firstName[0]}${user.lastName[0]}`}
                      size="sm"
                    />
                    <span className="hidden text-sm font-medium text-gray-700 lg:inline dark:text-gray-300">
                      {user.firstName}
                    </span>
                    <ChevronDown className="hidden h-4 w-4 text-gray-400 lg:block" />
                  </button>
                }
                align="end"
                contentClassName="w-56"
              >
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {user.displayName}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{user.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem icon={<User className="h-4 w-4" />}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem icon={<LayoutDashboard className="h-4 w-4" />}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem icon={<BookOpen className="h-4 w-4" />}>
                  My Courses
                </DropdownMenuItem>
                <DropdownMenuItem icon={<Settings className="h-4 w-4" />}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem icon={<LogOut className="h-4 w-4" />} destructive>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href={ROUTES.LOGIN}>
                <Button variant="ghost" size="sm">
                  Log In
                </Button>
              </Link>
              <Link href={ROUTES.REGISTER}>
                <Button variant="primary" size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMobileMenu}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors md:hidden dark:hover:bg-gray-800 dark:hover:text-gray-300"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-gray-200 bg-white/95 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/95 md:hidden"
          >
            <div className="space-y-1 px-4 py-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive(link.href)
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-950/50 dark:text-primary-300'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800',
                  )}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </div>
            {!isAuthenticated && (
              <div className="flex gap-2 border-t border-gray-200 px-4 py-3 dark:border-gray-800">
                <Link href={ROUTES.LOGIN} className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="md" fullWidth>
                    Log In
                  </Button>
                </Link>
                <Link href={ROUTES.REGISTER} className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="md" fullWidth>
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
