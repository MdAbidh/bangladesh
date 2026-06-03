'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const skeletonVariants = cva('animate-pulse rounded-md bg-gray-200 dark:bg-gray-800', {
  variants: {
    variant: {
      text: 'h-4 w-full',
      'text-sm': 'h-3 w-3/4',
      'text-lg': 'h-6 w-2/3',
      title: 'h-8 w-1/2',
      card: 'h-48 w-full rounded-2xl',
      avatar: 'h-12 w-12 rounded-full',
      'avatar-sm': 'h-8 w-8 rounded-full',
      'avatar-lg': 'h-16 w-16 rounded-full',
      button: 'h-10 w-24 rounded-lg',
      'button-sm': 'h-8 w-20 rounded-lg',
      'button-lg': 'h-12 w-32 rounded-lg',
      image: 'aspect-video w-full rounded-2xl',
      thumbnail: 'h-40 w-full rounded-xl',
      badge: 'h-6 w-16 rounded-full',
      table: 'h-10 w-full',
      'table-row': 'h-12 w-full',
    },
  },
  defaultVariants: {
    variant: 'text',
  },
});

interface SkeletonProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  asChild?: boolean;
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(skeletonVariants({ variant }), className)}
        aria-hidden="true"
        {...props}
      />
    );
  },
);
Skeleton.displayName = 'Skeleton';

function SkeletonCard() {
  return (
    <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <Skeleton variant="thumbnail" />
      <Skeleton variant="title" />
      <Skeleton variant="text" />
      <Skeleton variant="text-sm" />
      <div className="flex items-center gap-3 pt-2">
        <Skeleton variant="avatar-sm" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text-sm" />
          <Skeleton variant="text-sm" className="w-1/2" />
        </div>
      </div>
    </div>
  );
}

function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <Skeleton variant="table" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} variant="table-row" />
      ))}
    </div>
  );
}

function SkeletonProfile() {
  return (
    <div className="flex items-center gap-4 p-6">
      <Skeleton variant="avatar-lg" />
      <div className="flex-1 space-y-3">
        <Skeleton variant="title" />
        <Skeleton variant="text-sm" />
      </div>
    </div>
  );
}

export { Skeleton, SkeletonCard, SkeletonTable, SkeletonProfile };
export type { SkeletonProps };
