'use client';

import Link from 'next/link';
import { Star, Clock, Users, PlayCircle, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import type { Course } from '@/types';

interface CourseCardProps {
  course: Course;
  progress?: number;
  href?: string;
  className?: string;
  variant?: 'default' | 'compact' | 'horizontal';
}

const levelColors: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
  BEGINNER: 'success',
  INTERMEDIATE: 'warning',
  ADVANCED: 'danger',
  ALL_LEVELS: 'info',
};

export function CourseCard({ course, progress, href, className, variant = 'default' }: CourseCardProps) {
  const linkHref = href || `/courses/${course.slug}`;
  const priceDisplay = course.isFree ? 'Free' : course.discountedPrice ? `$${course.discountedPrice}` : `$${course.price}`;
  const hasDiscount = course.discountedPrice && course.discountedPrice < course.price;

  if (variant === 'horizontal') {
    return (
      <Link href={linkHref}>
        <motion.div
          whileHover={{ y: -2 }}
          className={cn(
            'group flex gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900',
            className,
          )}
        >
          <div className="relative h-24 w-40 flex-shrink-0 overflow-hidden rounded-xl">
            {course.thumbnailUrl ? (
              <img
                src={course.thumbnailUrl}
                alt={course.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-500 to-secondary-500 text-white text-lg font-bold">
                {course.title.charAt(0)}
              </div>
            )}
            {course.isFeatured && (
              <Badge variant="warning" size="sm" className="absolute left-2 top-2">
                Featured
              </Badge>
            )}
          </div>
          <div className="flex flex-1 flex-col justify-between min-w-0">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant={levelColors[course.level]} size="sm">{course.level}</Badge>
                {hasDiscount && (
                  <span className="text-xs line-through text-gray-400">${course.price}</span>
                )}
              </div>
              <h3 className="mt-1 text-sm font-semibold text-gray-900 line-clamp-1 dark:text-gray-100">
                {course.title}
              </h3>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  {course.averageRating.toFixed(1)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {course.duration}h
                </span>
              </div>
              <span className="font-semibold text-primary-600 dark:text-primary-400">
                {priceDisplay}
              </span>
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link href={linkHref}>
      <motion.div
        whileHover={{ y: -4 }}
        className={cn(
          'group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900',
          variant === 'compact' ? '' : '',
          className,
        )}
      >
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          {course.thumbnailUrl ? (
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 text-white text-3xl font-bold">
              {course.title.charAt(0)}
            </div>
          )}
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {course.isFeatured && (
              <Badge variant="warning" size="sm">Featured</Badge>
            )}
            <Badge variant={levelColors[course.level]} size="sm">{course.level}</Badge>
          </div>

          {/* Price Badge */}
          <div className="absolute right-3 top-3">
            <Badge variant="glass" size="sm">
              {priceDisplay}
            </Badge>
          </div>

          {/* Play Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm">
              <PlayCircle className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {variant !== 'compact' && course.category && (
            <p className="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider">
              {course.category.name}
            </p>
          )}

          <h3 className={cn(
            'mt-1 font-semibold text-gray-900 line-clamp-2 dark:text-gray-100',
            variant === 'compact' ? 'text-sm' : 'text-base',
          )}>
            {course.title}
          </h3>

          {variant !== 'compact' && (
            <p className="mt-1 text-sm text-gray-500 line-clamp-2 dark:text-gray-400">
              {course.shortDescription}
            </p>
          )}

          {/* Instructor */}
          <div className="mt-3 flex items-center gap-2">
            <Avatar
              src={course.teacher?.avatarUrl}
              alt={course.teacher?.displayName || ''}
              size="xs"
              fallback={course.teacher?.displayName?.split(' ').map(n => n[0]).join('') || '?'}
            />
            <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
              {course.teacher?.displayName || 'Instructor'}
            </span>
          </div>

          {/* Meta */}
          <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {course.averageRating.toFixed(1)}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {course.totalEnrollments}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {course.duration}h
              </span>
            </div>
          </div>

          {/* Progress */}
          {typeof progress === 'number' && (
            <div className="mt-3">
              <Progress value={progress} size="sm" showLabel />
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
