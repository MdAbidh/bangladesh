'use client';

import { forwardRef, type ReactNode } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from '@/components/ui/modal';
import { motion } from 'framer-motion';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
}

const variantConfig = {
  danger: {
    icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
    iconBg: 'bg-red-100 dark:bg-red-950/50',
    buttonVariant: 'danger' as const,
  },
  warning: {
    icon: <AlertTriangle className="h-6 w-6 text-amber-500" />,
    iconBg: 'bg-amber-100 dark:bg-amber-950/50',
    buttonVariant: 'primary' as const,
  },
  info: {
    icon: <AlertTriangle className="h-6 w-6 text-blue-500" />,
    iconBg: 'bg-blue-100 dark:bg-blue-950/50',
    buttonVariant: 'primary' as const,
  },
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title = 'Are you sure?',
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'danger',
  isLoading = false,
  icon,
  children,
  className,
}: ConfirmDialogProps) {
  const config = variantConfig[variant];

  return (
    <Modal open={open} onOpenChange={onOpenChange} size="sm">
      <ModalBody className={cn('text-center', className)}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={cn(
            'mx-auto flex h-14 w-14 items-center justify-center rounded-2xl',
            config.iconBg,
          )}
        >
          {icon || config.icon}
        </motion.div>
        <ModalTitle className="mt-4 text-center">{title}</ModalTitle>
        {description && (
          <ModalDescription className="mt-2 text-center">{description}</ModalDescription>
        )}
        {children}
      </ModalBody>
      <ModalFooter className="gap-2">
        <Button
          variant="ghost"
          size="md"
          onClick={() => {
            onCancel?.();
            onOpenChange(false);
          }}
          disabled={isLoading}
          fullWidth
        >
          {cancelLabel}
        </Button>
        <Button
          variant={config.buttonVariant}
          size="md"
          onClick={() => {
            onConfirm();
            onOpenChange(false);
          }}
          loading={isLoading}
          fullWidth
        >
          {confirmLabel}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
