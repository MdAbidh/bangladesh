'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  GraduationCap,
  Clock,
  Award,
  TrendingUp,
  Flame,
  ChevronRight,
  PlayCircle,
  Calendar,
  Target,
  ArrowRight,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { StatCard } from '@/components/shared/stat-card';
import { CourseCard } from '@/components/shared/course-card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';
import type { Course } from '@/types';

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.06 } } },
  item: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  },
};

const MOCK_USER = { firstName: 'Alex', lastName: 'Johnson' };
const MOCK_STREAK = { current: 7, longest: 23, days: [true, true, true, true, false, false, true, true, true, true, true, false, false, true] };
const MOCK_GOAL = { current: 8, target: 10 };

const MOCK_CONTINUE: Course[] = [
  { id: '1', title: 'Advanced React Patterns', slug: 'advanced-react', shortDescription: 'Master compound components and render props', thumbnailUrl: null, category: { id: 'c1', name: 'Frontend', slug: 'frontend', description: null, icon: null, parentId: null, children: [], courseCount: 0, sortOrder: 0, createdAt: '', updatedAt: '' }, tags: [], level: 'ADVANCED', language: 'English', duration: 12, totalLessons: 48, totalSections: 6, totalEnrollments: 1234, averageRating: 4.8, totalReviews: 234, price: 79.99, discountedPrice: 49.99, isFree: false, isPublished: true, isFeatured: true, status: 'PUBLISHED', teacher: { id: 't1', firebaseUid: '', email: 'sarah@example.com', firstName: 'Sarah', lastName: 'Chen', displayName: 'Sarah Chen', avatarUrl: null, role: 'TEACHER', phoneNumber: null, bio: null, isActive: true, isEmailVerified: true, lastLoginAt: null, createdAt: '', updatedAt: '' }, sections: [], prerequisites: [], learningObjectives: [], requirements: [], targetAudience: [], certificateEnabled: true, passingGrade: 80, createdAt: '', updatedAt: '' },
  { id: '2', title: 'TypeScript Mastery', slug: 'typescript-mastery', shortDescription: 'From basics to advanced generics', thumbnailUrl: null, category: { id: 'c2', name: 'Languages', slug: 'languages', description: null, icon: null, parentId: null, children: [], courseCount: 0, sortOrder: 0, createdAt: '', updatedAt: '' }, tags: [], level: 'INTERMEDIATE', language: 'English', duration: 8, totalLessons: 32, totalSections: 4, totalEnrollments: 2341, averageRating: 4.9, totalReviews: 456, price: 59.99, discountedPrice: null, isFree: false, isPublished: true, isFeatured: true, status: 'PUBLISHED', teacher: { id: 't2', firebaseUid: '', email: 'marcus@example.com', firstName: 'Marcus', lastName: 'Lee', displayName: 'Marcus Lee', avatarUrl: null, role: 'TEACHER', phoneNumber: null, bio: null, isActive: true, isEmailVerified: true, lastLoginAt: null, createdAt: '', updatedAt: '' }, sections: [], prerequisites: [], learningObjectives: [], requirements: [], targetAudience: [], certificateEnabled: true, passingGrade: 80, createdAt: '', updatedAt: '' },
  { id: '3', title: 'Node.js Backend Development', slug: 'nodejs-backend', shortDescription: 'Build scalable APIs with Express', thumbnailUrl: null, category: { id: 'c3', name: 'Backend', slug: 'backend', description: null, icon: null, parentId: null, children: [], courseCount: 0, sortOrder: 0, createdAt: '', updatedAt: '' }, tags: [], level: 'BEGINNER', language: 'English', duration: 15, totalLessons: 60, totalSections: 8, totalEnrollments: 3456, averageRating: 4.7, totalReviews: 567, price: 0, discountedPrice: null, isFree: true, isPublished: true, isFeatured: false, status: 'PUBLISHED', teacher: { id: 't3', firebaseUid: '', email: 'emma@example.com', firstName: 'Emma', lastName: 'Wilson', displayName: 'Emma Wilson', avatarUrl: null, role: 'TEACHER', phoneNumber: null, bio: null, isActive: true, isEmailVerified: true, lastLoginAt: null, createdAt: '', updatedAt: '' }, sections: [], prerequisites: [], learningObjectives: [], requirements: [], targetAudience: [], certificateEnabled: true, passingGrade: 80, createdAt: '', updatedAt: '' },
];

const MOCK_RECOMMENDED: Course[] = [
  { id: '4', title: 'Python for Data Science', slug: 'python-data-science', shortDescription: 'NumPy, Pandas, and visualization', thumbnailUrl: null, category: { id: 'c4', name: 'Data Science', slug: 'data-science', description: null, icon: null, parentId: null, children: [], courseCount: 0, sortOrder: 0, createdAt: '', updatedAt: '' }, tags: [], level: 'BEGINNER', language: 'English', duration: 10, totalLessons: 40, totalSections: 5, totalEnrollments: 5432, averageRating: 4.6, totalReviews: 765, price: 89.99, discountedPrice: 69.99, isFree: false, isPublished: true, isFeatured: false, status: 'PUBLISHED', teacher: { id: 't4', firebaseUid: '', email: 'david@example.com', firstName: 'David', lastName: 'Kim', displayName: 'David Kim', avatarUrl: null, role: 'TEACHER', phoneNumber: null, bio: null, isActive: true, isEmailVerified: true, lastLoginAt: null, createdAt: '', updatedAt: '' }, sections: [], prerequisites: [], learningObjectives: [], requirements: [], targetAudience: [], certificateEnabled: true, passingGrade: 80, createdAt: '', updatedAt: '' },
  { id: '5', title: 'UI/UX Design Fundamentals', slug: 'ui-ux-design', shortDescription: 'Design thinking and Figma mastery', thumbnailUrl: null, category: { id: 'c5', name: 'Design', slug: 'design', description: null, icon: null, parentId: null, children: [], courseCount: 0, sortOrder: 0, createdAt: '', updatedAt: '' }, tags: [], level: 'ALL_LEVELS', language: 'English', duration: 6, totalLessons: 24, totalSections: 3, totalEnrollments: 1234, averageRating: 4.5, totalReviews: 345, price: 0, discountedPrice: null, isFree: true, isPublished: true, isFeatured: false, status: 'PUBLISHED', teacher: { id: 't5', firebaseUid: '', email: 'lisa@example.com', firstName: 'Lisa', lastName: 'Park', displayName: 'Lisa Park', avatarUrl: null, role: 'TEACHER', phoneNumber: null, bio: null, isActive: true, isEmailVerified: true, lastLoginAt: null, createdAt: '', updatedAt: '' }, sections: [], prerequisites: [], learningObjectives: [], requirements: [], targetAudience: [], certificateEnabled: true, passingGrade: 80, createdAt: '', updatedAt: '' },
  { id: '6', title: 'AWS Cloud Practitioner', slug: 'aws-cloud', shortDescription: 'Pass the AWS CCP exam', thumbnailUrl: null, category: { id: 'c6', name: 'Cloud', slug: 'cloud', description: null, icon: null, parentId: null, children: [], courseCount: 0, sortOrder: 0, createdAt: '', updatedAt: '' }, tags: [], level: 'BEGINNER', language: 'English', duration: 20, totalLessons: 80, totalSections: 10, totalEnrollments: 6789, averageRating: 4.8, totalReviews: 890, price: 129.99, discountedPrice: 79.99, isFree: false, isPublished: true, isFeatured: true, status: 'PUBLISHED', teacher: { id: 't6', firebaseUid: '', email: 'james@example.com', firstName: 'James', lastName: 'Brown', displayName: 'James Brown', avatarUrl: null, role: 'TEACHER', phoneNumber: null, bio: null, isActive: true, isEmailVerified: true, lastLoginAt: null, createdAt: '', updatedAt: '' }, sections: [], prerequisites: [], learningObjectives: [], requirements: [], targetAudience: [], certificateEnabled: true, passingGrade: 80, createdAt: '', updatedAt: '' },
];

const MOCK_ACTIVITY = [
  { type: 'lesson', course: 'Advanced React Patterns', lesson: 'Compound Components', time: '2 hours ago' },
  { type: 'quiz', course: 'TypeScript Mastery', lesson: 'Generics Quiz', time: 'Yesterday', score: 90 },
  { type: 'certificate', course: 'Node.js Backend Development', time: '3 days ago' },
  { type: 'enroll', course: 'AWS Cloud Practitioner', time: '5 days ago' },
];

export default function StudentDashboardPage() {
  const [isLoading] = useState(false);

  return (
    <motion.div variants={stagger.container} initial="initial" animate="animate" className="space-y-8">
      {/* Welcome Section */}
      <motion.div variants={stagger.item}>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-400 p-6 shadow-xl sm:p-8">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-sm font-medium text-white/80">
                Welcome back,
              </motion.p>
              <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="mt-1 text-2xl font-bold text-white sm:text-3xl">
                {MOCK_USER.firstName} {MOCK_USER.lastName}!
              </motion.h1>
              <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="mt-2 text-sm text-white/70 max-w-md">
                Keep pushing forward — every lesson brings you one step closer to mastery. You&apos;re doing great!
              </motion.p>
            </div>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 backdrop-blur-sm">
                <Flame className="h-5 w-5 text-amber-300" />
                <span className="text-sm font-semibold text-white">{MOCK_STREAK.current} day streak</span>
              </div>
              <Link href="/courses">
                <Button variant="glass-primary" size="md" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Browse Courses
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div variants={stagger.item} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)
        ) : (
          <>
            <StatCard icon={BookOpen} label="Enrolled Courses" value="12" variant="primary" trend={{ value: 16, isPositive: true, label: 'vs last month' }} />
            <StatCard icon={GraduationCap} label="Completed Courses" value="5" variant="success" trend={{ value: 25, isPositive: true, label: 'completion rate' }} />
            <StatCard icon={Clock} label="Hours Watched" value="128" variant="secondary" trend={{ value: 8, isPositive: true, label: 'this week' }} />
            <StatCard icon={Award} label="Certificates Earned" value="4" variant="warning" />
          </>
        )}
      </motion.div>

      {/* Weekly Goal + Streak Row */}
      <motion.div variants={stagger.item} className="grid gap-4 md:grid-cols-2">
        {/* Weekly Goal */}
        <Card glass className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4 text-primary-500" />
              Weekly Learning Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{MOCK_GOAL.current}<span className="text-lg font-normal text-gray-400">/{MOCK_GOAL.target}</span></p>
                <p className="text-sm text-gray-500 dark:text-gray-400">lessons this week</p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-950/50">
                <Zap className="h-7 w-7 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <Progress value={(MOCK_GOAL.current / MOCK_GOAL.target) * 100} variant="primary" size="lg" className="mt-4" />
          </CardContent>
        </Card>

        {/* Streak Calendar */}
        <Card glass>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Flame className="h-4 w-4 text-amber-500" />
              Learning Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{MOCK_STREAK.current} days</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Best: {MOCK_STREAK.longest} days</p>
              </div>
            </div>
            <div className="mt-4 flex gap-1.5">
              {MOCK_STREAK.days.map((active, i) => (
                <div key={i} className={cn(
                  'h-7 flex-1 rounded-md transition-colors',
                  active ? 'bg-primary-500 shadow-sm shadow-primary-500/30' : 'bg-gray-100 dark:bg-gray-800',
                )} title={active ? `Day ${i + 1} - Active` : `Day ${i + 1}`} />
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Continue Learning */}
      <motion.div variants={stagger.item}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Continue Learning</h2>
          <Link href="/my-learning" className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-4 flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
          {MOCK_CONTINUE.map((course, idx) => {
            const progress = [35, 62, 18][idx] || 30;
            return (
            <motion.div key={course.id} whileHover={{ y: -4 }} className="min-w-[280px] flex-shrink-0">
              <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
                <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary-500 to-secondary-500">
                  <div className="flex h-full items-center justify-center text-3xl font-bold text-white/50">
                    {course.title.charAt(0)}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <Badge variant="glass" size="sm" className="absolute left-3 top-3">
                    {progress}% complete
                  </Badge>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">{course.title}</h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-1 dark:text-gray-400">{course.shortDescription}</p>
                  <Progress value={progress} size="sm" className="mt-3" />
                  <Link href={`/courses/${course.slug}`}>
                    <Button variant="glass-primary" size="sm" fullWidth className="mt-3" leftIcon={<PlayCircle className="h-4 w-4" />}>
                      Resume
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={stagger.item} className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card glass>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4 text-primary-500" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {MOCK_ACTIVITY.map((act, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <div className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-xl',
                      act.type === 'lesson' ? 'bg-primary-100 text-primary-600 dark:bg-primary-950/50 dark:text-primary-400' :
                      act.type === 'quiz' ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400' :
                      act.type === 'certificate' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400' :
                      'bg-purple-100 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400',
                    )}>
                      {act.type === 'lesson' ? <PlayCircle className="h-4 w-4" /> :
                       act.type === 'quiz' ? <CheckCircle2 className="h-4 w-4" /> :
                       act.type === 'certificate' ? <Award className="h-4 w-4" /> :
                       <TrendingUp className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {act.type === 'lesson' && `Completed "${act.lesson}"`}
                        {act.type === 'quiz' && `Scored ${act.score}% on "${act.lesson}"`}
                        {act.type === 'certificate' && 'Earned a certificate'}
                        {act.type === 'enroll' && 'Enrolled in a new course'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{act.course} &middot; {act.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming / Calendar */}
        <Card glass>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4 text-primary-500" />
              Upcoming
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: 'Quiz: TypeScript Generics', date: 'Tomorrow, 10:00 AM' },
                { label: 'Live Session: React Hooks Deep Dive', date: 'Fri, 2:00 PM' },
                { label: 'Assignment Due: UI Project', date: 'Next Monday' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-xl border border-gray-100 bg-gray-50/50 p-3 dark:border-gray-800 dark:bg-gray-800/30"
                >
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.label}</p>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{item.date}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recommended Courses */}
      <motion.div variants={stagger.item}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recommended for You</h2>
          <Link href="/courses" className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
            Browse All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_RECOMMENDED.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
