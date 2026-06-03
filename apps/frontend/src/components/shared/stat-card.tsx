'use client';

import { type ReactNode } from 'react';
import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  className?: string;
  children?: ReactNode;
  onClick?: () => void;
}

const variantStyles = {
  default: {
    iconBg: 'bg-gray-100 dark:bg-gray-800',
    iconColor: 'text-gray-600 dark:text-gray-400',
    border: 'border-gray-200 dark:border-gray-800',
  },
  primary: {
    iconBg: 'bg-primary-100 dark:bg-primary-950/50',
    iconColor: 'text-primary-600 dark:text-primary-400',
    border: 'border-primary-200 dark:border-primary-900/50',
  },
  secondary: {
    iconBg: 'bg-secondary-100 dark:bg-secondary-950/50',
    iconColor: 'text-secondary-600 dark:text-secondary-400',
    border: 'border-secondary-200 dark:border-secondary-900/50',
  },
  success: {
    iconBg: 'bg-emerald-100 dark:bg-emerald-950/50',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-900/50',
  },
  warning: {
    iconBg: 'bg-amber-100 dark:bg-amber-950/50',
    iconColor: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-900/50',
  },
  danger: {
    iconBg: 'bg-red-100 dark:bg-red-950/50',
    iconColor: 'text-red-600 dark:text-red-400',
    border: 'border-red-200 dark:border-red-900/50',
  },
};

export function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  variant = 'default',
  className,
  children,
  onClick,
}: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <motion.div
      whileHover={onClick ? { y: -2, scale: 1.01 } : undefined}
      onClick={onClick}
      className={cn(
        'rounded-2xl border bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md dark:bg-gray-900',
        styles.border,
        onClick && 'cursor-pointer',
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', styles.iconBg)}>
            <Icon className={cn('h-5 w-5', styles.iconColor)} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
          </div>
        </div>

        {trend && (
          <div className="flex items-center gap-1">
            {trend.isPositive ? (
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span
              className={cn(
                'text-sm font-medium',
                trend.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400',
              )}
            >
              {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
            </span>
            {trend.label && (
              <span className="text-xs text-gray-400 dark:text-gray-500">{trend.label}</span>
            )}
          </div>
        )}
      </div>
      {children && <div className="mt-4">{children}</div>}
    </motion.div>
  );
}
