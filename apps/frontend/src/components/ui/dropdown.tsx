'use client';

import { forwardRef, type ReactNode } from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { cn } from '@/lib/utils';
import {
  motion,
  AnimatePresence,
} from 'framer-motion';

interface DropdownMenuProps {
  children: ReactNode;
  trigger: ReactNode;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
  contentClassName?: string;
}

const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(
  ({ children, trigger, align = 'end', side = 'bottom', className, contentClassName }, ref) => {
    return (
      <DropdownMenuPrimitive.Root>
        <DropdownMenuPrimitive.Trigger asChild>
          <div className={cn('inline-flex cursor-pointer', className)} ref={ref}>
            {trigger}
          </div>
        </DropdownMenuPrimitive.Trigger>
        <AnimatePresence>
          <DropdownMenuPrimitive.Portal>
            <DropdownMenuPrimitive.Content
              asChild
              align={align}
              side={side}
              sideOffset={8}
              className="z-50"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className={cn(
                  'min-w-[12rem] overflow-hidden rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl dark:border-gray-800 dark:bg-gray-900',
                  contentClassName,
                )}
              >
                {children}
              </motion.div>
            </DropdownMenuPrimitive.Content>
          </DropdownMenuPrimitive.Portal>
        </AnimatePresence>
      </DropdownMenuPrimitive.Root>
    );
  },
);
DropdownMenu.displayName = 'DropdownMenu';

const DropdownMenuItem = forwardRef<
  HTMLDivElement,
  {
    children: ReactNode;
    className?: string;
    inset?: boolean;
    disabled?: boolean;
    onClick?: () => void;
    icon?: ReactNode;
    shortcut?: string;
    destructive?: boolean;
  }
>(({ children, className, inset, disabled, onClick, icon, shortcut, destructive }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-lg px-2.5 py-2 text-sm outline-none transition-colors',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      destructive
        ? 'text-red-600 focus:bg-red-50 dark:text-red-400 dark:focus:bg-red-950/50'
        : 'text-gray-700 focus:bg-gray-100 dark:text-gray-300 dark:focus:bg-gray-800',
      inset && 'pl-8',
      className,
    )}
    disabled={disabled}
    onClick={onClick}
  >
    {icon && <span className="mr-2 h-4 w-4">{icon}</span>}
    <span className="flex-1">{children}</span>
    {shortcut && (
      <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">{shortcut}</span>
    )}
  </DropdownMenuPrimitive.Item>
));
DropdownMenuItem.displayName = 'DropdownMenuItem';

const DropdownMenuSeparator = forwardRef<
  HTMLDivElement,
  { className?: string }
>(({ className }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn('mx-1 my-1.5 h-px bg-gray-200 dark:bg-gray-800', className)}
  />
));
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';

const DropdownMenuLabel = forwardRef<
  HTMLDivElement,
  { children: ReactNode; className?: string; inset?: boolean }
>(({ children, className, inset }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      'px-2.5 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400',
      inset && 'pl-8',
      className,
    )}
  >
    {children}
  </DropdownMenuPrimitive.Label>
));
DropdownMenuLabel.displayName = 'DropdownMenuLabel';

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuCheckboxItem = forwardRef<
  HTMLDivElement,
  {
    children: ReactNode;
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    className?: string;
  }
>(({ children, checked, onCheckedChange, className }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-lg px-2.5 py-2 text-sm outline-none transition-colors text-gray-700 focus:bg-gray-100 dark:text-gray-300 dark:focus:bg-gray-800',
      className,
    )}
    checked={checked}
    onCheckedChange={onCheckedChange}
  >
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = 'DropdownMenuCheckboxItem';

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuRadioItem = forwardRef<
  HTMLDivElement,
  { children: ReactNode; value: string; className?: string }
>(({ children, value, className }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    value={value}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-lg px-2.5 py-2 text-sm outline-none transition-colors text-gray-700 focus:bg-gray-100 dark:text-gray-300 dark:focus:bg-gray-800',
      className,
    )}
  >
    {children}
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = 'DropdownMenuRadioItem';

export {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
};
export type { DropdownMenuProps };
