'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const fadeItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setSent(true);
  };

  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.div
          key="success"
          variants={stagger}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, y: -20 }}
          className="w-full text-center"
        >
          <motion.div variants={fadeItem}>
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/30">
              <CheckCircle className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Check your email
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              We&apos;ve sent a password reset link to your email address. Please check your inbox and follow the instructions.
            </p>
            <div className="mt-4 flex items-center justify-center gap-1.5 text-sm font-medium text-gray-900 dark:text-gray-100">
              <Mail className="h-4 w-4 text-gray-400" />
              <span>Check your inbox</span>
            </div>
          </motion.div>

          <motion.div variants={fadeItem} className="mt-8 space-y-3">
            <Link href={ROUTES.LOGIN}>
              <Button variant="primary" size="xl" fullWidth>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="md"
              fullWidth
              onClick={() => setSent(false)}
            >
              Send again
            </Button>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          key="form"
          variants={stagger}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, y: -20 }}
          className="w-full"
        >
          <motion.div variants={fadeItem} className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
              Forgot password?
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              No worries. Enter your email and we&apos;ll send you a reset link.
            </p>
          </motion.div>

          <motion.form
            variants={fadeItem}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
          >
            <div className="rounded-2xl border border-gray-200/50 bg-white/50 p-6 backdrop-blur-xl dark:border-gray-800/50 dark:bg-gray-900/50">
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                icon={<Mail className="h-4 w-4" />}
                {...register('email')}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="xl"
              fullWidth
              loading={isLoading}
            >
              {!isLoading && <Send className="h-4 w-4" />}
              Send Reset Link
            </Button>
          </motion.form>

          <motion.div variants={fadeItem} className="mt-6 text-center">
            <Link
              href={ROUTES.LOGIN}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors dark:text-gray-400 dark:hover:text-gray-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Sign In
            </Link>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
