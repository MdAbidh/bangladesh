'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, ShieldCheck, ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { Button } from '@/components/ui/button';

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

const RESEND_COOLDOWN = 30;

const steps = [
  { label: 'Create Account', completed: true },
  { label: 'Verify Email', completed: false },
  { label: 'Start Learning', completed: false },
];

export default function VerifyEmailPage() {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);
  const [verified, setVerified] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const email = 'user@example.com';

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (!canResend && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer, canResend]);

  const handleChange = useCallback(
    (index: number, value: string) => {
      if (!/^\d*$/.test(value)) return;
      const newOtp = [...otp];
      newOtp[index] = value.slice(-1);
      setOtp(newOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [otp],
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      if (e.key === 'ArrowLeft' && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      if (e.key === 'ArrowRight' && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [otp],
  );

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = pasted.split('').concat(Array(6 - pasted.length).fill(''));
    setOtp(newOtp);
    const nextIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();
  }, []);

  const handleResend = useCallback(() => {
    if (!canResend) return;
    setTimer(RESEND_COOLDOWN);
    setCanResend(false);
    setOtp(Array(6).fill(''));
    inputRefs.current[0]?.focus();
  }, [canResend]);

  const handleVerify = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setVerified(true);
    setTimeout(() => router.push(ROUTES.DASHBOARD), 2000);
  };

  const otpComplete = otp.every((d) => d !== '');

  if (verified) {
    return (
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="w-full text-center"
      >
        <motion.div variants={fadeItem}>
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/30">
            <CheckCircle className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Email Verified!
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Redirecting to your dashboard...
          </p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      {/* Progress Steps */}
      <motion.div variants={fadeItem} className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, i) => (
            <div key={step.label} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all',
                    step.completed
                      ? 'bg-primary-600 text-white'
                      : 'border-2 border-gray-300 text-gray-400 dark:border-gray-600 dark:text-gray-500',
                    !step.completed && i === 1 && 'border-primary-500 bg-primary-50 text-primary-600 dark:border-primary-500 dark:bg-primary-950/30 dark:text-primary-400',
                  )}
                >
                  {step.completed ? <CheckCircle className="h-4 w-4" /> : i + 1}
                </div>
                <span className={cn(
                  'mt-1.5 text-[10px] font-medium whitespace-nowrap',
                  step.completed ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500',
                  i === 1 && !step.completed && 'text-primary-600 dark:text-primary-400',
                )}>
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    'mx-2 mt-[-1.5rem] h-0.5 flex-1 rounded',
                    step.completed ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700',
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeItem} className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-900/30">
          <ShieldCheck className="h-8 w-8 text-primary-600 dark:text-primary-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Verify your email
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          We sent a verification code to
        </p>
        <div className="mt-1 flex items-center justify-center gap-1.5 text-sm font-medium text-gray-900 dark:text-gray-100">
          <Mail className="h-4 w-4 text-gray-400" />
          {email}
        </div>
      </motion.div>

      <motion.div variants={fadeItem} className="mt-8">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Enter verification code
        </label>
        <div className="mt-3 flex items-center justify-center gap-2 sm:gap-3">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              className={cn(
                'h-12 w-10 rounded-xl border-2 text-center text-lg font-bold transition-all focus:outline-none sm:h-14 sm:w-12 sm:text-xl',
                digit
                  ? 'border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-500 dark:bg-primary-950/30 dark:text-primary-300'
                  : 'border-gray-200 bg-white text-gray-900 focus:border-primary-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-primary-500',
              )}
              autoFocus={i === 0}
            />
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeItem} className="mt-8">
        <Button
          variant="primary"
          size="xl"
          fullWidth
          loading={isLoading}
          disabled={!otpComplete}
          onClick={handleVerify}
        >
          {!isLoading && <ShieldCheck className="h-4 w-4" />}
          Verify Email
        </Button>
      </motion.div>

      <motion.div variants={fadeItem} className="mt-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Didn&apos;t receive the code?{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend}
            className={cn(
              'inline-flex items-center gap-1 font-medium transition-colors',
              canResend
                ? 'text-primary-600 hover:text-primary-700 dark:text-primary-400'
                : 'text-gray-400 cursor-not-allowed dark:text-gray-600',
            )}
          >
            <RefreshCw className={cn('h-3.5 w-3.5', !canResend && 'animate-spin-slow')} />
            {canResend ? 'Resend code' : `Resend in ${timer}s`}
          </button>
        </p>
      </motion.div>

      <motion.div variants={fadeItem} className="mt-6 text-center">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors dark:hover:text-gray-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to registration
        </button>
      </motion.div>
    </motion.div>
  );
}
