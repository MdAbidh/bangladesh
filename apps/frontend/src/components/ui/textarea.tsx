'use client';

import { forwardRef, useRef, useEffect, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  autoResize?: boolean;
  helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, autoResize = true, helperText, id, ...props }, forwardedRef) => {
    const innerRef = useRef<HTMLTextAreaElement | null>(null);
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    const resize = () => {
      if (autoResize && innerRef.current) {
        innerRef.current.style.height = 'auto';
        innerRef.current.style.height = `${innerRef.current.scrollHeight}px`;
      }
    };

    useEffect(() => {
      resize();
    }, [props.value]);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          className={cn(
            'flex min-h-[80px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:ring-offset-gray-950',
            error && 'border-red-500 focus-visible:ring-red-500 dark:border-red-400',
            autoResize && 'overflow-hidden resize-none',
            className,
          )}
          ref={(node) => {
            innerRef.current = node;
            if (typeof forwardedRef === 'function') forwardedRef(node);
            else if (forwardedRef) forwardedRef.current = node;
          }}
          aria-invalid={!!error}
          aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
          onChange={(e) => {
            resize();
            props.onChange?.(e);
          }}
          {...props}
        />
        {error && (
          <p id={`${textareaId}-error`} className="text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${textareaId}-helper`} className="text-sm text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
export type { TextareaProps };
