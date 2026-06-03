'use client';

import { type ReactNode } from 'react';
import { PackageOpen, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  children?: ReactNode;
}

export function EmptyState({
  icon: Icon = PackageOpen,
  title,
  description,
  action,
  className,
  children,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white/50 p-12 text-center dark:border-gray-800 dark:bg-gray-950/50',
        className,
      )}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800"
      >
        <Icon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
      </motion.div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
      {action && (
        <Button
          variant="primary"
          size="sm"
          className="mt-6"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
      {children}
    </motion.div>
  );
}
