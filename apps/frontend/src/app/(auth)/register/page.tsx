'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  UserPlus,
  GraduationCap,
  Presentation,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

const registerSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required').max(50),
    lastName: z.string().min(1, 'Last name is required').max(50),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'At least 8 characters')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/[a-z]/, 'Must contain a lowercase letter')
      .regex(/[0-9]/, 'Must contain a number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    role: z.enum(['STUDENT', 'TEACHER'], { required_error: 'Select a role' }),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms and conditions' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const fadeItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function PasswordStrengthBar({ password }: { password: string }) {
  const strength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return Math.min(score, 5);
  }, [password]);

  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const colors = ['', 'danger', 'warning', 'warning', 'success', 'success'];

  if (!password) return null;

  return (
    <div className="space-y-1.5">
      <Progress value={(strength / 5) * 100} size="sm" variant={colors[strength] as 'danger' | 'warning' | 'success'} />
      <p className={cn(
        'text-xs font-medium',
        strength <= 1 && 'text-red-500',
        strength === 2 && 'text-amber-500',
        strength === 3 && 'text-amber-500',
        strength >= 4 && 'text-emerald-500',
      )}>
        {labels[strength]}
      </p>
    </div>
  );
}

function PasswordCriteria({ meets, label }: { meets: boolean; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs">
      {meets ? (
        <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
      ) : (
        <XCircle className="h-3.5 w-3.5 text-gray-300 dark:text-gray-600" />
      )}
      <span className={meets ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'}>
        {label}
      </span>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'STUDENT',
      acceptTerms: false as unknown as true,
    },
  });

  const password = watch('password');
  const role = watch('role');

  const passwordChecks = {
    minChars: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    router.push(ROUTES.VERIFY_EMAIL);
  };

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <motion.div variants={fadeItem} className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
          Create an account
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Start your learning journey today
        </p>
      </motion.div>

      <motion.form
        variants={fadeItem}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
        noValidate
      >
        <div className="rounded-2xl border border-gray-200/50 bg-white/50 p-6 backdrop-blur-xl dark:border-gray-800/50 dark:bg-gray-900/50">
          {/* Role Selection */}
          <div className="mb-5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              I want to join as
            </label>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <label
                className={cn(
                  'flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 p-3 text-sm font-medium transition-all',
                  role === 'STUDENT'
                    ? 'border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-500 dark:bg-primary-950/30 dark:text-primary-300'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600',
                )}
              >
                <input
                  type="radio"
                  value="STUDENT"
                  className="sr-only"
                  {...register('role')}
                />
                <GraduationCap className="h-5 w-5" />
                Student
              </label>
              <label
                className={cn(
                  'flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 p-3 text-sm font-medium transition-all',
                  role === 'TEACHER'
                    ? 'border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-500 dark:bg-primary-950/30 dark:text-primary-300'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600',
                )}
              >
                <input
                  type="radio"
                  value="TEACHER"
                  className="sr-only"
                  {...register('role')}
                />
                <Presentation className="h-5 w-5" />
                Teacher
              </label>
            </div>
            {errors.role && (
              <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>
            )}
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="John"
              error={errors.firstName?.message}
              icon={<User className="h-4 w-4" />}
              {...register('firstName')}
            />
            <Input
              label="Last Name"
              placeholder="Doe"
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>

          <div className="mt-4 space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              icon={<Mail className="h-4 w-4" />}
              {...register('email')}
            />

            <div>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
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
              {password && (
                <div className="mt-2 space-y-2">
                  <PasswordStrengthBar password={password} />
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <PasswordCriteria meets={passwordChecks.minChars} label="At least 8 chars" />
                    <PasswordCriteria meets={passwordChecks.hasUpper} label="Uppercase letter" />
                    <PasswordCriteria meets={passwordChecks.hasLower} label="Lowercase letter" />
                    <PasswordCriteria meets={passwordChecks.hasNumber} label="A number" />
                  </div>
                </div>
              )}
            </div>

            <Input
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Repeat your password"
              error={errors.confirmPassword?.message}
              icon={<Lock className="h-4 w-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
              {...register('confirmPassword')}
            />
          </div>

          {/* Terms */}
          <div className="mt-5">
            <label className="flex cursor-pointer items-start gap-2">
              <input
                type="checkbox"
                {...register('acceptTerms')}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                I agree to the{' '}
                <Link href="/terms" className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.acceptTerms && (
              <p className="mt-1 text-sm text-red-500">{errors.acceptTerms.message}</p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="xl"
          fullWidth
          loading={isLoading}
        >
          {!isLoading && <UserPlus className="h-4 w-4" />}
          Create Account
        </Button>
      </motion.form>

      <motion.div variants={fadeItem} className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-gray-400 dark:bg-gray-950 dark:text-gray-500">
            Or sign up with
          </span>
        </div>
      </motion.div>

      <motion.div variants={fadeItem}>
        <Button
          variant="outline"
          size="xl"
          fullWidth
          leftIcon={<GraduationCap className="h-5 w-5" />}
          onClick={() => {}}
        >
          Continue with Google
        </Button>
      </motion.div>

      <motion.p
        variants={fadeItem}
        className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400"
      >
        Already have an account?{' '}
        <Link
          href={ROUTES.LOGIN}
          className="font-semibold text-primary-600 hover:text-primary-700 transition-colors dark:text-primary-400"
        >
          Sign in
        </Link>
      </motion.p>
    </motion.div>
  );
}
