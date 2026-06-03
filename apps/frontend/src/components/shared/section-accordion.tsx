'use client';

import { useState, type ReactNode } from 'react';
import { ChevronDown, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LessonItem } from './lesson-item';
import { motion, AnimatePresence } from 'framer-motion';
import type { Section, Lesson } from '@/types';

interface SectionAccordionProps {
  section: Section;
  completedLessonIds?: string[];
  currentLessonId?: string;
  locked?: boolean;
  defaultOpen?: boolean;
  className?: string;
}

export function SectionAccordion({
  section,
  completedLessonIds = [],
  currentLessonId,
  locked = false,
  defaultOpen = false,
  className,
}: SectionAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const completedCount = section.lessons.filter((l) => completedLessonIds.includes(l.id)).length;
  const totalDuration = section.lessons.reduce((acc, l) => acc + l.duration, 0);
  const progress = section.lessons.length > 0 ? (completedCount / section.lessons.length) * 100 : 0;

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}min`;
  };

  return (
    <div className={cn('rounded-2xl border border-gray-200 bg-white overflow-hidden dark:border-gray-800 dark:bg-gray-900', className)}>
      {/* Section Header */}
      <button
        onClick={() => !locked && setIsOpen(!isOpen)}
        className={cn(
          'flex w-full items-center gap-3 px-4 py-4 text-left transition-colors',
          'hover:bg-gray-50 dark:hover:bg-gray-800/50',
          locked && 'opacity-50 cursor-not-allowed',
        )}
        aria-expanded={isOpen}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800"
        >
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </motion.div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Section {section.sortOrder}: {section.title}
          </h3>
          <p className="mt-0.5 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span>{section.lessons.length} lessons</span>
            <span>&middot;</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDuration(totalDuration)}
            </span>
          </p>
        </div>

        {/* Progress */}
        {completedCount > 0 && (
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-16 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-primary-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {completedCount}/{section.lessons.length}
            </span>
          </div>
        )}
      </button>

      {/* Lessons List */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-100 px-3 py-2 space-y-1 dark:border-gray-800">
              {section.lessons.map((lesson, index) => (
                <LessonItem
                  key={lesson.id}
                  lesson={lesson}
                  isCompleted={completedLessonIds.includes(lesson.id)}
                  isCurrent={lesson.id === currentLessonId}
                  isLocked={index > 0 && !completedLessonIds.includes(section.lessons[index - 1]?.id || '') && !lesson.isFree}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
