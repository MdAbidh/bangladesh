'use client';

import { forwardRef, type ReactNode } from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  id?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: { root: 'h-5 w-9', thumb: 'h-3.5 w-3.5 data-[state=checked]:translate-x-4' },
  md: { root: 'h-6 w-11', thumb: 'h-5 w-5 data-[state=checked]:translate-x-5' },
  lg: { root: 'h-7 w-14', thumb: 'h-6 w-6 data-[state=checked]:translate-x-7' },
};

const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked, defaultChecked, onCheckedChange, disabled, label, description, id, className, size = 'md' }, ref) => {
    const switchId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={cn('flex items-center gap-3', className)}>
        <SwitchPrimitive.Root
          ref={ref}
          id={switchId}
          checked={checked}
          defaultChecked={defaultChecked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          className={cn(
            'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-gray-950',
            'data-[state=checked]:bg-primary-600 data-[state=unchecked]:bg-gray-200 dark:data-[state=unchecked]:bg-gray-800',
            sizeMap[size].root,
          )}
        >
          <SwitchPrimitive.Thumb asChild>
            <motion.span
              layout
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={cn(
                'pointer-events-none block rounded-full bg-white shadow-lg ring-0',
                sizeMap[size].thumb,
              )}
            />
          </SwitchPrimitive.Thumb>
        </SwitchPrimitive.Root>
        {(label || description) && (
          <div className="grid gap-0.5">
            {label && (
              <label
                htmlFor={switchId}
                className="text-sm font-medium leading-none text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-300"
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    );
  },
);
Switch.displayName = 'Switch';

export { Switch };
export type { SwitchProps };
