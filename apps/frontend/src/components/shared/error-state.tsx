'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
  variant?: 'default' | 'full-screen' | 'inline';
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again.',
  onRetry,
  className,
  variant = 'default',
}: ErrorStateProps) {
  if (variant === 'inline') {
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        className={cn(
          'flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/50',
          className,
        )}
      >
        <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-500" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-red-800 dark:text-red-300">{title}</p>
          {description && (
            <p className="text-sm text-red-600 dark:text-red-400">{description}</p>
          )}
        </div>
        {onRetry && (
          <Button variant="ghost" size="sm" onClick={onRetry} className="text-red-600 hover:text-red-700 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-950">
            <RefreshCw className="h-4 w-4 mr-1" />
            Retry
          </Button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl p-12 text-center',
        variant === 'full-screen' && 'fixed inset-0 z-50 bg-white dark:bg-gray-950',
        className,
      )}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-950/50"
      >
        <AlertTriangle className="h-8 w-8 text-red-500" />
      </motion.div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
      {onRetry && (
        <Button
          variant="primary"
          size="md"
          className="mt-6"
          onClick={onRetry}
          leftIcon={<RefreshCw className="h-4 w-4" />}
        >
          Try Again
        </Button>
      )}
    </motion.div>
  );
}
