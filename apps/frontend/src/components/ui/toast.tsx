'use client';

import { Toaster as SonnerToaster, toast as sonnerToast } from 'sonner';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import type { ReactNode } from 'react';

interface ToastOptions {
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const toast = {
  success: (options: ToastOptions) => {
    sonnerToast.custom((t) => (
      <ToastContent
        icon={<CheckCircle className="h-5 w-5 text-emerald-500" />}
        title={options.title}
        description={options.description}
        action={options.action}
        onDismiss={() => sonnerToast.dismiss(t)}
      />
    ));
  },
  error: (options: ToastOptions) => {
    sonnerToast.custom((t) => (
      <ToastContent
        icon={<XCircle className="h-5 w-5 text-red-500" />}
        title={options.title}
        description={options.description}
        action={options.action}
        onDismiss={() => sonnerToast.dismiss(t)}
      />
    ));
  },
  warning: (options: ToastOptions) => {
    sonnerToast.custom((t) => (
      <ToastContent
        icon={<AlertTriangle className="h-5 w-5 text-amber-500" />}
        title={options.title}
        description={options.description}
        action={options.action}
        onDismiss={() => sonnerToast.dismiss(t)}
      />
    ));
  },
  info: (options: ToastOptions) => {
    sonnerToast.custom((t) => (
      <ToastContent
        icon={<Info className="h-5 w-5 text-blue-500" />}
        title={options.title}
        description={options.description}
        action={options.action}
        onDismiss={() => sonnerToast.dismiss(t)}
      />
    ));
  },
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    },
  ) => {
    sonnerToast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    });
  },
  dismiss: (id?: string | number) => sonnerToast.dismiss(id),
};

function ToastContent({
  icon,
  title,
  description,
  action,
  onDismiss,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  onDismiss?: () => void;
}) {
  return (
    <div
      className={cn(
        'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-gray-900',
      )}
    >
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </p>
        {description && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
        {action && (
          <button
            onClick={action.onClick}
            className="mt-2 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            {action.label}
          </button>
        )}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors dark:hover:bg-gray-800 dark:hover:text-gray-300"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      gap={8}
      toastOptions={{
        duration: 4000,
        style: {
          background: 'transparent',
          border: 'none',
          boxShadow: 'none',
          padding: 0,
        },
      }}
    />
  );
}

export { Toaster, toast };
