'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, BookOpen, GraduationCap, Clock, PlayCircle, Filter, SlidersHorizontal } from 'lucide-react';
import { CourseCard } from '@/components/shared/course-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import type { Course } from '@/types';

const MOCK_ENROLLMENTS = Array.from({ length: 12 }).map((_, i) => ({
  id: `enr-${i}`,
  course: {
    id: String(i), slug: `course-${i}`,
    title: ['Advanced React Patterns', 'TypeScript Mastery', 'Node.js Backend', 'Python for Data Science', 'UI/UX Design', 'AWS Cloud Practitioner', 'GraphQL API Design', 'Docker & Kubernetes', 'Machine Learning', 'Flutter Mobile', 'Go Programming', 'Rust Systems'][i],
    shortDescription: 'Comprehensive course on modern development practices.',
    thumbnailUrl: null,
    category: { id: `cat${i % 6}`, name: ['Frontend', 'Backend', 'Data Science', 'DevOps', 'Mobile', 'Cloud'][i % 6], slug: '', description: null, icon: null, parentId: null, children: [], courseCount: 0, sortOrder: 0, createdAt: '', updatedAt: '' },
    tags: [], level: (['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const)[i % 3],
    language: 'English', duration: Math.floor(Math.random() * 20 + 5),
    totalLessons: Math.floor(Math.random() * 50 + 10), totalSections: Math.floor(Math.random() * 8 + 3),
    totalEnrollments: Math.floor(Math.random() * 3000 + 100), averageRating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
    totalReviews: Math.floor(Math.random() * 300 + 10), price: [0, 49.99, 79.99][i % 3],
    discountedPrice: i === 2 ? 29.99 : null, isFree: i % 3 === 0, isPublished: true, isFeatured: false,
    status: 'PUBLISHED' as const,
    teacher: { id: `t${i}`, firebaseUid: '', email: '', firstName: 'John', lastName: 'Doe', displayName: 'John Doe', avatarUrl: null, role: 'TEACHER', phoneNumber: null, bio: null, isActive: true, isEmailVerified: true, lastLoginAt: null, createdAt: '', updatedAt: '' },
    sections: [], prerequisites: [], learningObjectives: [], requirements: [], targetAudience: [], certificateEnabled: true, passingGrade: 80, createdAt: '', updatedAt: '',
  } as Course,
  status: (['ACTIVE', 'COMPLETED', 'ACTIVE'] as const)[i % 3],
  progress: Math.floor(Math.random() * 100),
  completedLessons: Math.floor(Math.random() * 30),
  totalLessons: Math.floor(Math.random() * 50 + 10),
  enrolledAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  completedAt: i % 3 === 1 ? new Date().toISOString() : null,
  expiresAt: null,
  createdAt: '', updatedAt: '',
}));

export default function MyLearningPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('in-progress');

  const filtered = useMemo(() => {
    let result = MOCK_ENROLLMENTS;
    if (activeTab === 'in-progress') result = result.filter(e => e.status === 'ACTIVE');
    else if (activeTab === 'completed') result = result.filter(e => e.status === 'COMPLETED');
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(e => e.course.title.toLowerCase().includes(q));
    }
    return result;
  }, [search, activeTab]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Learning</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Track and continue your learning journey</p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search your courses..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <SlidersHorizontal className="h-4 w-4" />
          <span>{filtered.length} courses</span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} variant="pills">
        <TabsList variant="pills">
          <TabsTrigger value="in-progress">
            <PlayCircle className="h-4 w-4" />
            In Progress
          </TabsTrigger>
          <TabsTrigger value="completed">
            <GraduationCap className="h-4 w-4" />
            Completed
          </TabsTrigger>
          <TabsTrigger value="all">
            <BookOpen className="h-4 w-4" />
            All Courses
          </TabsTrigger>
        </TabsList>

        {['in-progress', 'completed', 'all'].map(tab => (
          <TabsContent key={tab} value={tab}>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white/50 p-12 text-center dark:border-gray-800 dark:bg-gray-950/50">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
                  <BookOpen className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {tab === 'in-progress' ? 'No courses in progress' : tab === 'completed' ? 'No completed courses' : 'No courses yet'}
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {tab === 'in-progress' ? 'Start learning something new today!' : tab === 'completed' ? 'Complete a course to see it here.' : 'Enroll in a course to get started.'}
                </p>
                <Link href="/courses">
                  <Button variant="primary" size="sm" className="mt-4">Browse Courses</Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((enrollment, i) => (
                  <motion.div
                    key={enrollment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <CourseCard course={enrollment.course} progress={enrollment.progress} />
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
