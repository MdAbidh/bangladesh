'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Play, Clock, Users, BookOpen, Star, ChevronDown, Check, Globe, BarChart3, Award,
  Download, Share2, Heart, MessageCircle, Calendar, Monitor,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { SectionAccordion } from '@/components/shared/section-accordion';
import { RatingStars } from '@/components/shared/rating-stars';
import { CourseCard } from '@/components/shared/course-card';
import { cn } from '@/lib/utils';
import { formatDate, formatNumber } from '@/lib/utils';
import { motion } from 'framer-motion';
import type { Course, Section, Review } from '@/types';

const MOCK_COURSE: Course = {
  id: '1', title: 'Advanced React Patterns', slug: 'advanced-react',
  description: 'Master advanced React patterns including compound components, render props, higher-order components, and hooks. This comprehensive course will take your React skills to the next level.',
  shortDescription: 'Master compound components, render props, and advanced hooks patterns',
  thumbnailUrl: null, category: { id: 'c1', name: 'Frontend', slug: 'frontend', description: null, icon: null, parentId: null, children: [], courseCount: 0, sortOrder: 0, createdAt: '', updatedAt: '' },
  tags: ['React', 'TypeScript', 'Frontend', 'Hooks'],
  level: 'ADVANCED', language: 'English', duration: 12, totalLessons: 48, totalSections: 6, totalEnrollments: 1234, averageRating: 4.8, totalReviews: 234,
  price: 79.99, discountedPrice: 49.99, isFree: false, isPublished: true, isFeatured: true, status: 'PUBLISHED',
  teacher: { id: 't1', firebaseUid: '', email: 'sarah@example.com', firstName: 'Sarah', lastName: 'Chen', displayName: 'Sarah Chen', avatarUrl: null, role: 'TEACHER', phoneNumber: null, bio: 'Senior Frontend Engineer with 10+ years of experience. Passionate about React and TypeScript.', isActive: true, isEmailVerified: true, lastLoginAt: null, createdAt: '', updatedAt: '' },
  sections: [
    { id: 's1', title: 'Getting Started with React Patterns', description: null, sortOrder: 1, lessons: [
      { id: 'l1', title: 'Introduction to Design Patterns', description: 'Overview of design patterns in React', lessonType: 'VIDEO', duration: 900, sortOrder: 1, video: { id: 'v1', title: '', description: null, status: 'READY', firebaseUrl: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', hlsUrl: null, thumbnailUrl: null, duration: 900, fileSize: null, mimeType: null, createdAt: '', updatedAt: '' }, content: null, resources: [], isFree: true, isPublished: true, createdAt: '', updatedAt: '' },
      { id: 'l2', title: 'Setting Up Your Development Environment', description: null, lessonType: 'ARTICLE', duration: 600, sortOrder: 2, video: null, content: 'Content here...', resources: [], isFree: true, isPublished: true, createdAt: '', updatedAt: '' },
      { id: 'l3', title: 'Understanding Component Architecture', description: null, lessonType: 'VIDEO', duration: 1200, sortOrder: 3, video: null, content: null, resources: [], isFree: false, isPublished: true, createdAt: '', updatedAt: '' },
    ], createdAt: '', updatedAt: '' },
    { id: 's2', title: 'Compound Components', description: null, sortOrder: 2, lessons: [
      { id: 'l4', title: 'The Compound Component Pattern', description: null, lessonType: 'VIDEO', duration: 1500, sortOrder: 1, video: null, content: null, resources: [], isFree: false, isPublished: true, createdAt: '', updatedAt: '' },
      { id: 'l5', title: 'Building a Flexible Tabs Component', description: null, lessonType: 'VIDEO', duration: 1800, sortOrder: 2, video: null, content: null, resources: [], isFree: false, isPublished: true, createdAt: '', updatedAt: '' },
      { id: 'l6', title: 'Quiz: Compound Components', description: null, lessonType: 'QUIZ', duration: 600, sortOrder: 3, video: null, content: null, resources: [], isFree: false, isPublished: true, createdAt: '', updatedAt: '' },
    ], createdAt: '', updatedAt: '' },
    { id: 's3', title: 'Render Props Pattern', description: null, sortOrder: 3, lessons: [
      { id: 'l7', title: 'Understanding Render Props', description: null, lessonType: 'VIDEO', duration: 1200, sortOrder: 1, video: null, content: null, resources: [], isFree: false, isPublished: true, createdAt: '', updatedAt: '' },
      { id: 'l8', title: 'Building a Data Fetching Component', description: null, lessonType: 'ASSIGNMENT', duration: 2400, sortOrder: 2, video: null, content: null, resources: [], isFree: false, isPublished: true, createdAt: '', updatedAt: '' },
    ], createdAt: '', updatedAt: '' },
  ],
  prerequisites: ['Basic React knowledge', 'JavaScript ES6+', 'Familiarity with TypeScript'],
  learningObjectives: ['Build reusable component architectures', 'Implement compound components pattern', 'Master render props and HOCs', 'Create custom hooks for complex logic'],
  requirements: ['Node.js 16+', 'A code editor', 'Basic understanding of React'],
  targetAudience: ['Intermediate React developers', 'Frontend engineers', 'Anyone wanting to level up their React skills'],
  certificateEnabled: true, passingGrade: 80, createdAt: '2025-01-15', updatedAt: '2025-06-01',
};

const MOCK_REVIEWS: Review[] = [
  { id: 'r1', course: MOCK_COURSE, user: { id: 'u1', firebaseUid: '', email: '', firstName: 'Alex', lastName: 'M', displayName: 'Alex M', avatarUrl: null, role: 'STUDENT', phoneNumber: null, bio: null, isActive: true, isEmailVerified: true, lastLoginAt: null, createdAt: '', updatedAt: '' }, rating: 5, content: 'This course completely transformed how I think about React components. The compound pattern is a game-changer!', isApproved: true, createdAt: '2025-05-20', updatedAt: '' },
  { id: 'r2', course: MOCK_COURSE, user: { id: 'u2', firebaseUid: '', email: '', firstName: 'Jamie', lastName: 'L', displayName: 'Jamie L', avatarUrl: null, role: 'STUDENT', phoneNumber: null, bio: null, isActive: true, isEmailVerified: true, lastLoginAt: null, createdAt: '', updatedAt: '' }, rating: 4, content: 'Great content, well explained. Would love more real-world examples.', isApproved: true, createdAt: '2025-05-18', updatedAt: '' },
];

const SIMILAR_COURSES: Course[] = [
  { ...MOCK_COURSE, id: 'sim1', title: 'TypeScript Mastery', slug: 'typescript-mastery', shortDescription: 'From basics to advanced generics', averageRating: 4.9, totalEnrollments: 2341, duration: 8, price: 59.99, discountedPrice: null, isFree: false, level: 'INTERMEDIATE', totalLessons: 32, totalSections: 4, totalReviews: 456 },
  { ...MOCK_COURSE, id: 'sim2', title: 'Next.js Full Stack', slug: 'nextjs-fullstack', shortDescription: 'Build production-ready apps with Next.js', averageRating: 4.7, totalEnrollments: 1890, duration: 15, price: 89.99, discountedPrice: 69.99, isFree: false, level: 'INTERMEDIATE', totalLessons: 55, totalSections: 7, totalReviews: 312 },
  { ...MOCK_COURSE, id: 'sim3', title: 'React State Management', slug: 'react-state', shortDescription: 'Redux, Zustand, and Jotai compared', averageRating: 4.6, totalEnrollments: 1567, duration: 6, price: 0, discountedPrice: null, isFree: true, level: 'ALL_LEVELS', totalLessons: 20, totalSections: 3, totalReviews: 198 },
];

const sections = [
  { id: 'overview', label: 'Overview' },
  { id: 'content', label: 'Course Content' },
  { id: 'instructor', label: 'Instructor' },
  { id: 'reviews', label: 'Reviews' },
];

export default function CourseDetailPage() {
  const [activeSection, setActiveSection] = useState('overview');
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [playVideo, setPlayVideo] = useState(false);

  const priceDisplay = MOCK_COURSE.isFree ? 'Free' : MOCK_COURSE.discountedPrice ? `$${MOCK_COURSE.discountedPrice}` : `$${MOCK_COURSE.price}`;
  const hasDiscount = MOCK_COURSE.discountedPrice && MOCK_COURSE.discountedPrice < MOCK_COURSE.price;

  const completedLessonIds = ['l1', 'l2'];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-400">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="relative z-10 flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="glass" size="sm">{MOCK_COURSE.level}</Badge>
              <Badge variant="glass" size="sm">{MOCK_COURSE.category.name}</Badge>
            </div>
            <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">{MOCK_COURSE.title}</h1>
            <p className="mt-2 text-sm text-white/70 max-w-2xl">{MOCK_COURSE.shortDescription}</p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/80">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold">{MOCK_COURSE.averageRating.toFixed(1)}</span>
                <span>({MOCK_COURSE.totalReviews} reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{formatNumber(MOCK_COURSE.totalEnrollments)} enrolled</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Updated {formatDate(MOCK_COURSE.updatedAt)}</span>
              </div>
            </div>

            {/* Instructor */}
            <div className="mt-4 flex items-center gap-3">
              <Avatar src={null} alt={MOCK_COURSE.teacher.displayName} size="sm" fallback="SC" />
              <div>
                <p className="text-sm font-medium text-white">by {MOCK_COURSE.teacher.displayName}</p>
                <p className="text-xs text-white/60">{MOCK_COURSE.teacher.bio?.slice(0, 60)}</p>
              </div>
            </div>
          </div>

          {/* Video Thumbnail / Preview */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="relative overflow-hidden rounded-xl bg-black/30 backdrop-blur-sm">
              {playVideo ? (
                <video controls autoPlay className="w-full aspect-video rounded-xl" src="https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4" />
              ) : (
                <div className="group relative cursor-pointer aspect-video" onClick={() => setPlayVideo(true)}>
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary-400/30 to-secondary-400/30">
                    <Monitor className="h-16 w-16 text-white/40" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div whileHover={{ scale: 1.1 }} className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-xl shadow-2xl">
                      <Play className="h-8 w-8 ml-1 text-white" />
                    </motion.div>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <Badge variant="glass" size="sm">Preview</Badge>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Main Content */}
        <div className="flex-1 min-w-0 space-y-8">
          {/* Scroll Nav */}
          <div className="sticky top-20 z-30 -mx-4 overflow-x-auto border-b border-gray-200 bg-white/80 px-4 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/80">
            <div className="flex gap-0">
              {sections.map(s => (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveSection(s.id);
                    document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={cn(
                    'whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors',
                    activeSection === s.id ? 'border-primary-600 text-primary-700 dark:text-primary-300' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* What You'll Learn */}
          <section id="overview" className="scroll-mt-24">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">What You&apos;ll Learn</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {MOCK_COURSE.learningObjectives.map((obj, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className="flex items-start gap-2">
                    <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-950/50">
                      <Check className="h-3 w-3 text-primary-600 dark:text-primary-400" />
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{obj}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Course Stats Bar */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { icon: Clock, label: 'Duration', value: `${MOCK_COURSE.duration} hours` },
              { icon: BookOpen, label: 'Lessons', value: `${MOCK_COURSE.totalLessons}` },
              { icon: BarChart3, label: 'Level', value: MOCK_COURSE.level.charAt(0) + MOCK_COURSE.level.slice(1).toLowerCase() },
              { icon: Globe, label: 'Language', value: MOCK_COURSE.language },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="rounded-xl border border-gray-100 bg-gray-50/50 p-3 text-center dark:border-gray-800 dark:bg-gray-800/30">
                <stat.icon className="mx-auto h-4 w-4 text-primary-500" />
                <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Course Content */}
          <section id="content" className="scroll-mt-24">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Course Content</h2>
              <p className="text-sm text-gray-500">
                {MOCK_COURSE.sections.length} sections &middot; {MOCK_COURSE.totalLessons} lessons &middot; {MOCK_COURSE.duration}h total
              </p>
            </div>
            <div className="mt-4 space-y-3">
              {MOCK_COURSE.sections.map((section) => (
                <SectionAccordion
                  key={section.id}
                  section={section}
                  completedLessonIds={completedLessonIds}
                  currentLessonId="l4"
                />
              ))}
            </div>
          </section>

          {/* Prerequisites / Requirements */}
          <div className="grid gap-4 sm:grid-cols-2">
            {(MOCK_COURSE.prerequisites.length > 0) && (
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Prerequisites</h3>
                <ul className="mt-3 space-y-2">
                  {MOCK_COURSE.prerequisites.map((p, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="h-1 w-1 rounded-full bg-gray-400" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {(MOCK_COURSE.targetAudience.length > 0) && (
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Target Audience</h3>
                <ul className="mt-3 space-y-2">
                  {MOCK_COURSE.targetAudience.map((a, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="h-1 w-1 rounded-full bg-gray-400" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Instructor Bio */}
          <section id="instructor" className="scroll-mt-24">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Your Instructor</h2>
              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
                <Avatar src={null} alt={MOCK_COURSE.teacher.displayName} size="xl" fallback="SC" />
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{MOCK_COURSE.teacher.displayName}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Senior Frontend Engineer</p>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{MOCK_COURSE.teacher.bio}</p>
                  <div className="mt-3 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> 4.9 Instructor Rating</span>
                    <span className="flex items-center gap-1"><Award className="h-3.5 w-3.5" /> 12 Courses</span>
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> 15K+ Students</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Reviews */}
          <section id="reviews" className="scroll-mt-24">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Student Reviews</h2>
                <RatingStars value={MOCK_COURSE.averageRating} size="sm" showValue totalReviews={MOCK_COURSE.totalReviews} disabled />
              </div>
              <div className="mt-6 space-y-4">
                {MOCK_REVIEWS.map((review) => (
                  <motion.div key={review.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="border-b border-gray-100 pb-4 last:border-0 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                      <Avatar src={null} alt={review.user.displayName} size="sm" fallback={review.user.displayName.split(' ').map(n => n[0]).join('')} />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{review.user.displayName}</p>
                        <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
                      </div>
                      <div className="ml-auto">
                        <RatingStars value={review.rating} size="sm" disabled />
                      </div>
                    </div>
                    {review.content && <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{review.content}</p>}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Similar Courses */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Similar Courses</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SIMILAR_COURSES.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </section>
        </div>

        {/* Sticky Sidebar */}
        <div className="w-full flex-shrink-0 lg:w-80">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              {/* Price */}
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{priceDisplay}</p>
                {hasDiscount && (
                  <p className="mt-1 text-sm text-gray-500 line-through">${MOCK_COURSE.price}</p>
                )}
                {hasDiscount && (
                  <Badge variant="success" size="sm" className="mt-2">
                    Save ${(MOCK_COURSE.price - (MOCK_COURSE.discountedPrice || 0)).toFixed(2)}
                  </Badge>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 space-y-2">
                {isEnrolled ? (
                  <>
                    <Link href={`/courses/${MOCK_COURSE.slug}/lessons/l4`}>
                      <Button variant="primary" size="lg" fullWidth leftIcon={<Play className="h-4 w-4" />}>
                        Continue Learning
                      </Button>
                    </Link>
                    <Button variant="outline" size="md" fullWidth>
                      Start from Beginning
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="primary" size="lg" fullWidth onClick={() => setIsEnrolled(true)}>
                      Enroll Now - {priceDisplay}
                    </Button>
                    <Button variant="ghost" size="sm" fullWidth leftIcon={<Play className="h-4 w-4" />}>
                      Free Preview
                    </Button>
                  </>
                )}
              </div>

              {/* Course Includes */}
              <div className="mt-6 space-y-3">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">This course includes:</p>
                {[
                  { icon: Play, label: `${MOCK_COURSE.duration} hours on-demand video` },
                  { icon: Download, label: 'Downloadable resources' },
                  { icon: Award, label: 'Certificate of completion' },
                  { icon: MessageCircle, label: 'Discussion forums' },
                  { icon: Monitor, label: 'Access on mobile and TV' },
                  { icon: Clock, label: 'Full lifetime access' },
                ].map((inc, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <inc.icon className="h-4 w-4 text-primary-500" />
                    {inc.label}
                  </div>
                ))}
              </div>

              {/* Share */}
              <div className="mt-4 flex justify-center gap-2">
                <Button variant="ghost" size="sm" leftIcon={<Share2 className="h-4 w-4" />}>Share</Button>
                <Button variant="ghost" size="sm" leftIcon={<Heart className="h-4 w-4" />}>Favorite</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
