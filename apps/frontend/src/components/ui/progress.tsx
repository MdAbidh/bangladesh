'use client';

import { forwardRef } from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ProgressProps {
  value?: number;
  max?: number;
  className?: string;
  barClassName?: string;
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      value = 0,
      max = 100,
      className,
      barClassName,
      showLabel = false,
      label,
      animated = true,
      size = 'md',
      variant = 'primary',
    },
    ref,
  ) => {
    const percentage = Math.min(Math.round((value / max) * 100), 100);

    const variantStyles = {
      primary: 'bg-primary-500',
      secondary: 'bg-secondary-500',
      success: 'bg-emerald-500',
      warning: 'bg-amber-500',
      danger: 'bg-red-500',
    };

    const sizeStyles = {
      sm: 'h-1.5',
      md: 'h-2.5',
      lg: 'h-4',
    };

    return (
      <div className="w-full space-y-1.5">
        {(showLabel || label) && (
          <div className="flex items-center justify-between">
            {label && (
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
              </span>
            )}
            {showLabel && (
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {percentage}%
              </span>
            )}
          </div>
        )}
        <ProgressPrimitive.Root
          ref={ref}
          className={cn(
            'relative w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800',
            sizeStyles[size],
            className,
          )}
          value={value}
          max={max}
        >
          <ProgressPrimitive.Indicator asChild>
            <motion.div
              className={cn(
                'h-full w-full flex-1 rounded-full',
                variantStyles[variant],
                barClassName,
              )}
              initial={animated ? { width: 0 } : undefined}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </ProgressPrimitive.Indicator>
        </ProgressPrimitive.Root>
      </div>
    );
  },
);
Progress.displayName = 'Progress';

export { Progress };
export type { ProgressProps };
