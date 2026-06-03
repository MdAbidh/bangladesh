'use client';

import { forwardRef, type HTMLAttributes, useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const avatarVariants = cva(
  'relative flex shrink-0 overflow-hidden rounded-full',
  {
    variants: {
      size: {
        xs: 'h-6 w-6',
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16',
        '2xl': 'h-20 w-20',
        '3xl': 'h-24 w-24',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

const statusVariants = cva(
  'absolute bottom-0 right-0 block rounded-full ring-2 ring-white dark:ring-gray-900',
  {
    variants: {
      status: {
        online: 'bg-emerald-500',
        offline: 'bg-gray-400',
        away: 'bg-amber-500',
        busy: 'bg-red-500',
      },
      size: {
        xs: 'h-1.5 w-1.5',
        sm: 'h-2 w-2',
        md: 'h-2.5 w-2.5',
        lg: 'h-3 w-3',
        xl: 'h-3.5 w-3.5',
        '2xl': 'h-4 w-4',
        '3xl': 'h-5 w-5',
      },
    },
    defaultVariants: {
      status: 'online',
    },
  },
);

interface AvatarProps
  extends VariantProps<typeof avatarVariants> {
  src?: string | null;
  alt?: string;
  fallback?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
  className?: string;
  fallbackClassName?: string;
}

const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className, size, src, alt = '', fallback, status, fallbackClassName, ...props }, ref) => {
    const [imgError, setImgError] = useState(false);

    const getInitials = (name: string) => {
      const parts = name.split(' ').filter(Boolean);
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return name.slice(0, 2).toUpperCase();
    };

    return (
      <span
        ref={ref}
        className={cn('relative inline-block', className)}
        {...props}
      >
        <AvatarPrimitive.Root
          className={cn(avatarVariants({ size }))}
        >
          <AvatarPrimitive.Image
            src={src || undefined}
            alt={alt}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
          {(imgError || !src) && (
            <AvatarPrimitive.Fallback
              className={cn(
                'flex h-full w-full items-center justify-center bg-primary-100 font-medium text-primary-700 dark:bg-primary-900/50 dark:text-primary-300',
                size === 'xs' && 'text-[8px]',
                size === 'sm' && 'text-[10px]',
                size === 'md' && 'text-xs',
                size === 'lg' && 'text-sm',
                (size === 'xl' || size === '2xl' || size === '3xl') && 'text-lg',
                fallbackClassName,
              )}
              delayMs={0}
            >
              {fallback || getInitials(alt)}
            </AvatarPrimitive.Fallback>
          )}
        </AvatarPrimitive.Root>
        {status && (
          <span
            className={cn(statusVariants({ status, size }))}
            aria-label={status}
          />
        )}
      </span>
    );
  },
);
Avatar.displayName = 'Avatar';

interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  items: (Omit<AvatarProps, 'size'> & { key?: string })[];
  max?: number;
  size?: AvatarProps['size'];
}

const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, items, max = 4, size = 'sm', ...props }, ref) => {
    const visible = items.slice(0, max);
    const remaining = items.length - max;

    return (
      <div
        ref={ref}
        className={cn('flex -space-x-2', className)}
        {...props}
      >
        {visible.map((item, i) => (
          <motion.span
            key={item.key || i}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="ring-2 ring-white dark:ring-gray-900 rounded-full"
          >
            <Avatar size={size} {...item} />
          </motion.span>
        ))}
        {remaining > 0 && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600 ring-2 ring-white dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-900">
            +{remaining}
          </div>
        )}
      </div>
    );
  },
);
AvatarGroup.displayName = 'AvatarGroup';

export { Avatar, AvatarGroup };
export type { AvatarProps, AvatarGroupProps };
