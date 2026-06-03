'use client';

import { Play, FileText, HelpCircle, ClipboardList, FileType, CheckCircle, Lock, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDuration } from '@/lib/utils';
import { motion } from 'framer-motion';
import type { Lesson } from '@/types';

interface LessonItemProps {
  lesson: Lesson;
  isCompleted?: boolean;
  isLocked?: boolean;
  isCurrent?: boolean;
  onClick?: () => void;
  className?: string;
  progress?: number;
}

const typeConfig = {
  VIDEO: { icon: Play, color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400' },
  ARTICLE: { icon: FileText, color: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400' },
  QUIZ: { icon: HelpCircle, color: 'text-amber-500 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400' },
  ASSIGNMENT: { icon: ClipboardList, color: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400' },
  RESOURCE: { icon: FileType, color: 'text-gray-500 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400' },
};

export function LessonItem({
  lesson,
  isCompleted = false,
  isLocked = false,
  isCurrent = false,
  onClick,
  className,
}: LessonItemProps) {
  const TypeIcon = typeConfig[lesson.lessonType]?.icon || Play;

  return (
    <motion.button
      onClick={isLocked ? undefined : onClick}
      whileHover={isLocked ? undefined : { x: 4 }}
      className={cn(
        'flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-200',
        isCurrent
          ? 'bg-primary-50 border border-primary-200 dark:bg-primary-950/50 dark:border-primary-800'
          : 'hover:bg-gray-50 dark:hover:bg-gray-800/50',
        isLocked && 'opacity-50 cursor-not-allowed',
        isCompleted && 'opacity-80',
        className,
      )}
      disabled={isLocked}
      aria-current={isCurrent ? 'true' : undefined}
      aria-disabled={isLocked}
    >
      {/* Icon */}
      <div className={cn(
        'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg',
        typeConfig[lesson.lessonType]?.color || 'bg-gray-100 text-gray-500',
        isCurrent && 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-gray-950',
      )}>
        <TypeIcon className="h-4 w-4" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn(
            'text-sm font-medium truncate',
            isCurrent
              ? 'text-primary-700 dark:text-primary-300'
              : 'text-gray-700 dark:text-gray-300',
            isCompleted && 'line-through text-gray-400 dark:text-gray-500',
          )}>
            {lesson.title}
          </span>
          {lesson.isFree && !isLocked && (
            <span className="text-[10px] font-medium text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded dark:bg-emerald-900/30 dark:text-emerald-400">
              Free
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
          {lesson.lessonType} &middot; {formatDuration(lesson.duration)}
        </p>
      </div>

      {/* Status */}
      <div className="flex-shrink-0">
        {isCompleted ? (
          <CheckCircle className="h-5 w-5 text-emerald-500" />
        ) : isLocked ? (
          <Lock className="h-4 w-4 text-gray-300 dark:text-gray-600" />
        ) : isCurrent ? (
          <PlayCircle className="h-5 w-5 text-primary-600 dark:text-primary-400" />
        ) : null}
      </div>
    </motion.button>
  );
}
