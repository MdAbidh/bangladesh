'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary:
          'bg-primary-600 text-white shadow-lg shadow-primary-500/25 hover:bg-primary-700 hover:shadow-primary-500/30',
        secondary:
          'bg-secondary-600 text-white shadow-lg shadow-secondary-500/25 hover:bg-secondary-700 hover:shadow-secondary-500/30',
        ghost:
          'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
        outline:
          'border-2 border-gray-200 bg-transparent text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800',
        danger:
          'bg-red-600 text-white shadow-lg shadow-red-500/25 hover:bg-red-700 hover:shadow-red-500/30',
        success:
          'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-700 hover:shadow-emerald-500/30',
        'glass-primary':
          'bg-primary-500/10 text-primary-700 backdrop-blur-xl border border-primary-200/50 hover:bg-primary-500/20 dark:text-primary-300 dark:border-primary-800/50',
        'glass-secondary':
          'bg-secondary-500/10 text-secondary-700 backdrop-blur-xl border border-secondary-200/50 hover:bg-secondary-500/20 dark:text-secondary-300 dark:border-secondary-800/50',
      },
      size: {
        sm: 'h-8 gap-1.5 px-3 text-xs',
        md: 'h-10 gap-2 px-4 text-sm',
        lg: 'h-12 gap-2.5 px-6 text-base',
        xl: 'h-14 gap-3 px-8 text-lg',
        icon: 'h-10 w-10 p-0',
        'icon-sm': 'h-8 w-8 p-0',
        'icon-lg': 'h-12 w-12 p-0',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      asChild = false,
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!loading && rightIcon}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
export type { ButtonProps };
