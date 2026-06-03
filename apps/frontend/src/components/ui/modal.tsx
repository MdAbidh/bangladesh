'use client';

import { forwardRef, type ReactNode, useEffect, useState } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';

const dialogOverlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const dialogContentVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 10 },
};

const modalSizes = cva('fixed left-1/2 top-1/2 z-50 flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900', {
  variants: {
    size: {
      sm: 'w-full max-w-sm',
      md: 'w-full max-w-md',
      lg: 'w-full max-w-lg',
      xl: 'w-full max-w-xl',
      '2xl': 'w-full max-w-2xl',
      '3xl': 'w-full max-w-3xl',
      full: 'fixed inset-4 m-0 max-w-none rounded-2xl',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

interface ModalProps extends VariantProps<typeof modalSizes> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
  className?: string;
  showClose?: boolean;
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ open, onOpenChange, children, className, size, showClose = true }, ref) => {
    return (
      <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
        <AnimatePresence>
          {open && (
            <DialogPrimitive.Portal forceMount>
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <DialogPrimitive.Overlay asChild forceMount>
                  <motion.div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                    variants={dialogOverlayVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={{ duration: 0.2 }}
                  />
                </DialogPrimitive.Overlay>
                <DialogPrimitive.Content asChild forceMount>
                  <motion.div
                    ref={ref}
                    className={cn(modalSizes({ size }), className)}
                    variants={dialogContentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  >
                    {showClose && (
                      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors dark:hover:bg-gray-800 dark:hover:text-gray-300">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                      </DialogPrimitive.Close>
                    )}
                    {children}
                  </motion.div>
                </DialogPrimitive.Content>
              </div>
            </DialogPrimitive.Portal>
          )}
        </AnimatePresence>
      </DialogPrimitive.Root>
    );
  },
);
Modal.displayName = 'Modal';

const ModalHeader = forwardRef<HTMLDivElement, { className?: string; children: ReactNode }>(
  ({ className, children }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6 pb-0', className)}>
      {children}
    </div>
  ),
);
ModalHeader.displayName = 'ModalHeader';

const ModalTitle = forwardRef<HTMLHeadingElement, { className?: string; children: ReactNode }>(
  ({ className, children }, ref) => (
    <DialogPrimitive.Title
      ref={ref}
      className={cn('text-lg font-semibold leading-none tracking-tight text-gray-900 dark:text-gray-100', className)}
    >
      {children}
    </DialogPrimitive.Title>
  ),
);
ModalTitle.displayName = 'ModalTitle';

const ModalDescription = forwardRef<HTMLParagraphElement, { className?: string; children: ReactNode }>(
  ({ className, children }, ref) => (
    <DialogPrimitive.Description
      ref={ref}
      className={cn('text-sm text-gray-500 dark:text-gray-400', className)}
    >
      {children}
    </DialogPrimitive.Description>
  ),
);
ModalDescription.displayName = 'ModalDescription';

const ModalBody = forwardRef<HTMLDivElement, { className?: string; children: ReactNode }>(
  ({ className, children }, ref) => (
    <div ref={ref} className={cn('overflow-y-auto p-6', className)}>
      {children}
    </div>
  ),
);
ModalBody.displayName = 'ModalBody';

const ModalFooter = forwardRef<HTMLDivElement, { className?: string; children: ReactNode }>(
  ({ className, children }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col-reverse sm:flex-row sm:justify-end gap-2 p-6 pt-0',
        className,
      )}
    >
      {children}
    </div>
  ),
);
ModalFooter.displayName = 'ModalFooter';

export { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter };
export type { ModalProps };
