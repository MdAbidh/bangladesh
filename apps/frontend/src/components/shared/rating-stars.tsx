'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface RatingStarsProps {
  value: number;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
  count?: number;
  showValue?: boolean;
  totalReviews?: number;
  className?: string;
  disabled?: boolean;
}

const sizeMap = {
  sm: 'h-3.5 w-3.5',
  md: 'h-5 w-5',
  lg: 'h-7 w-7',
};

export function RatingStars({
  value,
  onChange,
  size = 'md',
  count = 5,
  showValue = false,
  totalReviews,
  className,
  disabled = false,
}: RatingStarsProps) {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);
  const displayValue = hoveredValue ?? value;

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {Array.from({ length: count }).map((_, i) => {
          const starValue = i + 1;
          const filled = starValue <= Math.floor(displayValue);
          const halfFilled = !filled && starValue - 0.5 <= displayValue;

          return (
            <motion.button
              key={i}
              whileHover={disabled ? undefined : { scale: 1.2 }}
              whileTap={disabled ? undefined : { scale: 0.9 }}
              onClick={() => {
                if (!disabled && onChange) {
                  onChange(starValue === value ? 0 : starValue);
                }
              }}
              onMouseEnter={() => !disabled && setHoveredValue(starValue)}
              onMouseLeave={() => !disabled && setHoveredValue(null)}
              disabled={disabled}
              className={cn(
                'transition-colors',
                disabled ? 'cursor-default' : 'cursor-pointer',
              )}
              type="button"
              aria-label={`Rate ${starValue} star${starValue !== 1 ? 's' : ''}`}
            >
              <Star
                className={cn(
                  sizeMap[size],
                  'transition-colors',
                  filled
                    ? 'fill-amber-400 text-amber-400'
                    : halfFilled
                      ? 'fill-amber-400/50 text-amber-400'
                      : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700',
                )}
              />
            </motion.button>
          );
        })}
      </div>
      {showValue && (
        <span className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          {value.toFixed(1)}
        </span>
      )}
      {totalReviews !== undefined && (
        <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
          ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  );
}
