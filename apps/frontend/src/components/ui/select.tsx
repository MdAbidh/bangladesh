'use client';

import { forwardRef, type ReactNode, useState } from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: ReactNode;
}

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  options: SelectOption[];
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  searchable?: boolean;
  clearable?: boolean;
}

const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      value,
      onValueChange,
      placeholder = 'Select...',
      options,
      label,
      error,
      disabled,
      className,
      triggerClassName,
      searchable = false,
      clearable = false,
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredOptions = searchable
      ? options.filter((opt) =>
          opt.label.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : options;

    const selectedLabel = options.find((opt) => opt.value === value)?.label;

    return (
      <div className={cn('w-full space-y-1.5', className)}>
        {label && (
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <SelectPrimitive.Root
          open={open}
          onOpenChange={(o) => {
            setOpen(o);
            if (!o) setSearchQuery('');
          }}
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
        >
          <SelectPrimitive.Trigger
            ref={ref}
            className={cn(
              'flex h-10 w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:ring-offset-gray-950',
              error && 'border-red-500 focus:ring-red-500 dark:border-red-400',
              triggerClassName,
            )}
            aria-invalid={!!error}
          >
            <div className="flex items-center gap-2">
              <SelectPrimitive.Value placeholder={placeholder} />
            </div>
            <div className="flex items-center gap-1">
              {clearable && value && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onValueChange?.('');
                  }}
                  className="rounded-full p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
              <SelectPrimitive.Icon>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </SelectPrimitive.Icon>
            </div>
          </SelectPrimitive.Trigger>

          <AnimatePresence>
            {open && (
              <SelectPrimitive.Portal>
                <SelectPrimitive.Content
                  position="popper"
                  className="relative z-50"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className={cn(
                      'mt-1 max-h-60 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900',
                    )}
                    style={{
                      width: 'var(--radix-select-trigger-width)',
                    }}
                  >
                    {searchable && (
                      <div className="border-b border-gray-200 p-2 dark:border-gray-800">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <input
                            className="h-9 w-full rounded-lg border border-gray-200 bg-transparent pl-8 pr-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-700 dark:text-gray-100"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                          />
                        </div>
                      </div>
                    )}
                    <SelectPrimitive.ScrollUpButton className="flex cursor-default items-center justify-center py-1 text-gray-400">
                      <ChevronUp className="h-4 w-4" />
                    </SelectPrimitive.ScrollUpButton>
                    <SelectPrimitive.Viewport className="p-1">
                      {filteredOptions.length === 0 ? (
                        <div className="py-6 text-center text-sm text-gray-400">
                          No results found
                        </div>
                      ) : (
                        filteredOptions.map((opt) => (
                          <SelectPrimitive.Item
                            key={opt.value}
                            value={opt.value}
                            disabled={opt.disabled}
                            className={cn(
                              'relative flex cursor-default select-none items-center rounded-lg px-2.5 py-2 text-sm outline-none transition-colors',
                              'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                              'text-gray-700 focus:bg-gray-100 dark:text-gray-300 dark:focus:bg-gray-800',
                            )}
                          >
                            <SelectPrimitive.ItemText>
                              <div className="flex items-center gap-2">
                                {opt.icon && (
                                  <span className="flex-shrink-0">{opt.icon}</span>
                                )}
                                {opt.label}
                              </div>
                            </SelectPrimitive.ItemText>
                            <SelectPrimitive.ItemIndicator className="ml-auto">
                              <Check className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                            </SelectPrimitive.ItemIndicator>
                          </SelectPrimitive.Item>
                        ))
                      )}
                    </SelectPrimitive.Viewport>
                    <SelectPrimitive.ScrollDownButton className="flex cursor-default items-center justify-center py-1 text-gray-400">
                      <ChevronDown className="h-4 w-4" />
                    </SelectPrimitive.ScrollDownButton>
                  </motion.div>
                </SelectPrimitive.Content>
              </SelectPrimitive.Portal>
            )}
          </AnimatePresence>
        </SelectPrimitive.Root>
        {error && (
          <p className="text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);
Select.displayName = 'Select';

export { Select };
export type { SelectProps };
