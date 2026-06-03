'use client';

import { type ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GraduationCap, Sparkles } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
}

const floatingShapes = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  size: 60 + i * 30,
  x: 10 + (i * 15) % 80,
  y: 10 + (i * 20) % 70,
  delay: i * 0.4,
  duration: 4 + (i % 3) * 2,
}));

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Left - Illustration */}
      <div className="relative hidden flex-1 items-center justify-center overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-secondary-900 p-12 lg:flex">
        {/* Animated background shapes */}
        {floatingShapes.map((shape) => (
          <motion.div
            key={shape.id}
            className="absolute rounded-full bg-white/5"
            style={{
              width: shape.size,
              height: shape.size,
              left: `${shape.x}%`,
              top: `${shape.y}%`,
            }}
            animate={{
              x: [0, 30, -20, 0],
              y: [0, -30, 20, 0],
              scale: [1, 1.1, 0.9, 1],
            }}
            transition={{
              duration: shape.duration,
              repeat: Infinity,
              delay: shape.delay,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Gradient Orbs */}
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-accent-500/20 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-primary-500/20 blur-[120px]" />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-lg text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20">
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">A.H Learning</span>
            </Link>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl font-bold leading-tight text-white"
          >
            Empower Your
            <br />
            <span className="bg-gradient-to-r from-accent-300 via-secondary-300 to-primary-300 bg-clip-text text-transparent">
              Learning Journey
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-4 text-lg text-white/60"
          >
            Join thousands of learners and expert instructors. Access premium courses, track your progress, and earn certificates.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 flex items-center justify-center gap-6 text-white/40"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent-400" />
              <span className="text-sm">Interactive Lessons</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-secondary-400" />
              <span className="text-sm">Expert Teachers</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary-400" />
              <span className="text-sm">Certificates</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-gray-50 to-white p-4 dark:from-gray-950 dark:to-gray-900 sm:p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="mb-8 flex items-center justify-center lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white text-sm font-bold">
                AH
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                A.H Learning
              </span>
            </Link>
          </div>

          {children}
        </motion.div>
      </div>
    </div>
  );
}
