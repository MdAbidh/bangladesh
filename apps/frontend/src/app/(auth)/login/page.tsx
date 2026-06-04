'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, LogIn, Shield } from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

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

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    try {
      await login({ email: data.email, password: data.password });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid email or password. Please try again.');
    }
  };

  const fillAdminCredentials = () => {
    setValue('email', 'admin@ahlearning.com');
    setValue('password', 'Admin@123456');
  };

  const fillTeacherCredentials = () => {
    setValue('email', 'teacher@ahlearning.com');
    setValue('password', 'Teacher@123456');
  };

  const fillStudentCredentials = () => {
    setValue('email', 'student@ahlearning.com');
    setValue('password', 'Student@123456');
  };

  const quickLogin = async (email: string, password: string) => {
    setError(null);
    try {
      setValue('email', email);
      setValue('password', password);
      await login({ email, password });
    } catch (err: any) {
      setError(err?.message || 'Invalid email or password. Please try again.');
    }
  };

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <motion.div variants={fadeItem} className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Sign in to continue your learning journey
        </p>
      </motion.div>

      <motion.form
        variants={fadeItem}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
        noValidate
      >
        <div className="rounded-2xl border border-gray-200/50 bg-white/50 p-6 backdrop-blur-xl dark:border-gray-800/50 dark:bg-gray-900/50">
          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              icon={<Mail className="h-4 w-4" />}
              {...register('email')}
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              error={errors.password?.message}
              icon={<Lock className="h-4 w-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
              {...register('password')}
            />
          </div>

          {error && (
            <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                {...register('rememberMe')}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
            </label>
            <Link
              href={ROUTES.FORGOT_PASSWORD}
              className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors dark:text-primary-400"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="xl"
          fullWidth
          loading={isLoading}
        >
          {!isLoading && <LogIn className="h-4 w-4" />}
          Sign In
        </Button>
      </motion.form>

      {/* Admin Quick Login */}
      <motion.div variants={fadeItem} className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-gray-400 dark:bg-gray-950 dark:text-gray-500">
            Or
          </span>
        </div>
      </motion.div>

      <motion.div variants={fadeItem} className="space-y-2">
        <p className="text-center text-xs font-medium text-gray-500 dark:text-gray-400">
          Quick Demo Logins (click to sign in instantly)
        </p>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => quickLogin('admin@ahlearning.com', 'Admin@123456')}
            disabled={isLoading}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-100 disabled:opacity-50 dark:border-amber-800/50 dark:bg-amber-900/20 dark:text-amber-400 dark:hover:bg-amber-900/30"
          >
            <Shield className="h-3.5 w-3.5" />
            Admin
          </button>
          <button
            type="button"
            onClick={() => quickLogin('teacher@ahlearning.com', 'Teacher@123456')}
            disabled={isLoading}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50 px-3 py-2.5 text-xs font-semibold text-purple-700 transition-colors hover:bg-purple-100 disabled:opacity-50 dark:border-purple-800/50 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/30"
          >
            <Shield className="h-3.5 w-3.5" />
            Teacher
          </button>
          <button
            type="button"
            onClick={() => quickLogin('student@ahlearning.com', 'Student@123456')}
            disabled={isLoading}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2.5 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100 disabled:opacity-50 dark:border-blue-800/50 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
          >
            <Shield className="h-3.5 w-3.5" />
            Student
          </button>
        </div>
        <div className="flex justify-center gap-3 pt-1 text-[10px] text-gray-400">
          <button type="button" onClick={fillAdminCredentials} className="hover:text-gray-600 dark:hover:text-gray-300">
            Fill Admin
          </button>
          <span>•</span>
          <button type="button" onClick={fillTeacherCredentials} className="hover:text-gray-600 dark:hover:text-gray-300">
            Fill Teacher
          </button>
          <span>•</span>
          <button type="button" onClick={fillStudentCredentials} className="hover:text-gray-600 dark:hover:text-gray-300">
            Fill Student
          </button>
        </div>
      </motion.div>

      <motion.p
        variants={fadeItem}
        className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400"
      >
        Don&apos;t have an account?{' '}
        <Link
          href={ROUTES.REGISTER}
          className="font-semibold text-primary-600 hover:text-primary-700 transition-colors dark:text-primary-400"
        >
          Create one
        </Link>
      </motion.p>
    </motion.div>
  );
}
