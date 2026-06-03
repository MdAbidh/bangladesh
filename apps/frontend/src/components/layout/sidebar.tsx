'use client';

import { type ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronDown,
  ChevronLeft,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/ui-store';
import { Avatar } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarSection {
  label: string;
  items: SidebarItem[];
  collapsible?: boolean;
}

interface SidebarItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
}

interface SidebarProps {
  sections: SidebarSection[];
  user?: {
    name: string;
    email: string;
    avatarUrl: string | null;
    role: string;
  } | null;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function Sidebar({ sections, user, header, footer, className }: SidebarProps) {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (label: string) => {
    setCollapsedSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 flex h-full flex-col border-r border-gray-200 bg-white transition-all duration-300 dark:border-gray-800 dark:bg-gray-950 lg:static lg:z-0',
          sidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-16',
          className,
        )}
      >
        {/* Header */}
        {header && (
          <div className={cn('flex h-16 items-center border-b border-gray-200 px-4 dark:border-gray-800', !sidebarOpen && 'lg:justify-center lg:px-0')}>
            {header}
          </div>
        )}

        {/* User Info */}
        {user && (
          <div className={cn(
            'flex items-center gap-3 border-b border-gray-200 p-4 dark:border-gray-800',
            !sidebarOpen && 'lg:justify-center lg:px-0',
          )}>
            <Avatar
              src={user.avatarUrl}
              alt={user.name}
              fallback={user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              size="sm"
            />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role.toLowerCase()}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-4">
          {sections.map((section) => (
            <div key={section.label}>
              <button
                onClick={() => section.collapsible && toggleSection(section.label)}
                className={cn(
                  'flex w-full items-center gap-2 px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300',
                  !sidebarOpen && 'lg:justify-center',
                )}
              >
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1 text-left"
                    >
                      {section.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {section.collapsible && sidebarOpen && (
                  <ChevronDown
                    className={cn(
                      'h-3 w-3 transition-transform',
                      collapsedSections[section.label] && '-rotate-180',
                    )}
                  />
                )}
              </button>
              <AnimatePresence>
                {(!collapsedSections[section.label] || !section.collapsible) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-1 space-y-1 overflow-hidden"
                  >
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                            !sidebarOpen && 'lg:justify-center lg:px-2',
                            active
                              ? 'bg-primary-50 text-primary-700 dark:bg-primary-950/50 dark:text-primary-300'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100',
                          )}
                        >
                          <Icon className={cn('h-5 w-5 flex-shrink-0', active ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300')} />
                          <AnimatePresence>
                            {sidebarOpen && (
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex-1 truncate text-left"
                              >
                                {item.label}
                              </motion.span>
                            )}
                          </AnimatePresence>
                          {item.badge && sidebarOpen && (
                            <span className="rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-medium text-primary-700 dark:bg-primary-900/50 dark:text-primary-300">
                              {item.badge}
                            </span>
                          )}
                          {active && (
                            <motion.span
                              layoutId="sidebar-active"
                              className="absolute inset-0 rounded-lg bg-primary-50 dark:bg-primary-950/50"
                              style={{ zIndex: -1 }}
                              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                            />
                          )}
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Footer */}
        {footer && (
          <div className="border-t border-gray-200 p-3 dark:border-gray-800">
            {footer}
          </div>
        )}

        {/* Collapse Toggle (Desktop) */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden h-10 items-center justify-center border-t border-gray-200 text-gray-400 hover:text-gray-600 transition-colors lg:flex dark:border-gray-800 dark:hover:text-gray-300"
        >
          <ChevronLeft className={cn('h-4 w-4 transition-transform', !sidebarOpen && 'rotate-180')} />
        </button>
      </aside>
    </>
  );
}
