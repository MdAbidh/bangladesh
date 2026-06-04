'use client';

import { forwardRef, type ReactNode } from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  delayDuration?: number;
  className?: string;
  contentClassName?: string;
  asChild?: boolean;
}

const Tooltip = forwardRef<HTMLButtonElement, TooltipProps>(
  (
    {
      children,
      content,
      side = 'top',
      align = 'center',
      delayDuration = 300,
      className,
      contentClassName,
      asChild = true,
    },
    ref,
  ) => {
    return (
      <TooltipPrimitive.Provider delayDuration={delayDuration}>
        <TooltipPrimitive.Root>
          <TooltipPrimitive.Trigger asChild={asChild} ref={ref}>
            <div className={cn('inline-flex', className)}>{children}</div>
          </TooltipPrimitive.Trigger>
          <AnimatePresence>
            <TooltipPrimitive.Portal>
              <TooltipPrimitive.Content
                side={side}
                align={align}
                sideOffset={5}
                asChild
                className="z-50"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: side === 'top' ? 2 : -2 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: side === 'top' ? 2 : -2 }}
                  transition={{ duration: 0.15 }}
                  className={cn(
                    'rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-900 shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100',
                    contentClassName,
                  )}
                >
                  {content}
                  <TooltipPrimitive.Arrow className="fill-white dark:fill-gray-900" />
                </motion.div>
              </TooltipPrimitive.Content>
            </TooltipPrimitive.Portal>
          </AnimatePresence>
        </TooltipPrimitive.Root>
      </TooltipPrimitive.Provider>
    );
  },
);
Tooltip.displayName = 'Tooltip';

interface TooltipProviderProps {
  children: ReactNode;
  delayDuration?: number;
}

const TooltipProvider = forwardRef<HTMLDivElement, TooltipProviderProps>(
  ({ children, delayDuration = 300 }, ref) => (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      {children}
    </TooltipPrimitive.Provider>
  ),
);
TooltipProvider.displayName = 'TooltipProvider';

export { Tooltip, TooltipProvider };
export type { TooltipProps, TooltipProviderProps };
