'use client';

import { forwardRef, type ReactNode } from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';

const tabsListVariants = cva('inline-flex items-center', {
  variants: {
    variant: {
      underline:
        'border-b border-gray-200 dark:border-gray-800 gap-0',
      pills:
        'rounded-xl bg-gray-100 p-1 dark:bg-gray-800 gap-0',
      segmented:
        'rounded-xl bg-gray-100 p-1 dark:bg-gray-800 gap-1',
    },
    fullWidth: {
      true: 'w-full',
    },
  },
  defaultVariants: {
    variant: 'underline',
  },
});

const tabsTriggerVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-gray-950',
  {
    variants: {
      variant: {
        underline:
          'px-4 py-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:text-primary-700 dark:data-[state=active]:text-primary-300',
        pills:
          'px-4 py-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-950 dark:data-[state=active]:text-gray-100',
        segmented:
          'px-4 py-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-950 dark:data-[state=active]:text-gray-100',
      },
    },
    defaultVariants: {
      variant: 'underline',
    },
  },
);

interface TabsProps extends VariantProps<typeof tabsListVariants> {
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  className?: string;
  children: ReactNode;
}

const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ className, children, variant, fullWidth, ...props }, ref) => {
    return (
      <TabsPrimitive.Root
        ref={ref}
        className={cn('w-full', className)}
        {...props}
      >
        {children}
      </TabsPrimitive.Root>
    );
  },
);
Tabs.displayName = 'Tabs';

interface TabsListProps extends VariantProps<typeof tabsListVariants> {
  className?: string;
  children: ReactNode;
}

const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, children, variant, fullWidth, ...props }, ref) => {
    return (
      <TabsPrimitive.List
        ref={ref}
        className={cn(tabsListVariants({ variant, fullWidth }), className)}
        {...props}
      >
        {children}
        {variant === 'underline' && (
          <TabsPrimitive.Trigger asChild value="">
            <span />
          </TabsPrimitive.Trigger>
        )}
      </TabsPrimitive.List>
    );
  },
);
TabsList.displayName = 'TabsList';

interface TabsTriggerProps {
  value: string;
  className?: string;
  children: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
}

const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, children, value, disabled, icon, ...props }, ref) => {
    return (
      <TabsPrimitive.Trigger
        ref={ref}
        value={value}
        disabled={disabled}
        className={cn(tabsTriggerVariants({ variant: 'pills' }), 'relative', className)}
        {...props}
      >
        {icon && <span className="mr-2 h-4 w-4">{icon}</span>}
        {children}
      </TabsPrimitive.Trigger>
    );
  },
);
TabsTrigger.displayName = 'TabsTrigger';

interface TabsContentProps {
  value: string;
  className?: string;
  children: ReactNode;
}

const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, children, value, ...props }, ref) => (
    <TabsPrimitive.Content
      ref={ref}
      value={value}
      className={cn(
        'mt-4 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:ring-offset-gray-950',
        className,
      )}
      {...props}
    >
      {children}
    </TabsPrimitive.Content>
  ),
);
TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };
export type { TabsProps, TabsListProps, TabsTriggerProps, TabsContentProps };
