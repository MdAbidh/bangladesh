'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Users,
  Award,
  Star,
  PlayCircle,
  ChevronRight,
  CheckCircle,
  TrendingUp,
  Sparkles,
  GraduationCap,
  Monitor,
  Code,
  Palette,
  BarChart3,
  Camera,
  Music,
  Globe,
  Brain,
  Mail,
  Heart,
} from 'lucide-react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

gsap.registerPlugin(ScrollTrigger);

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  icon: typeof Users;
}

const stats: StatItem[] = [
  { value: 100, suffix: 'K+', label: 'Students', icon: Users },
  { value: 1000, suffix: '+', label: 'Courses', icon: BookOpen },
  { value: 500, suffix: '+', label: 'Teachers', icon: GraduationCap },
  { value: 95, suffix: '%', label: 'Satisfaction', icon: Star },
];

const howItWorks = [
  {
    step: 1,
    title: 'Choose Your Path',
    description: 'Browse our extensive catalog and find courses that match your goals.',
    icon: BookOpen,
    color: 'from-primary-500 to-primary-600',
  },
  {
    step: 2,
    title: 'Learn & Practice',
    description: 'Access interactive lessons, quizzes, and hands-on projects.',
    icon: PlayCircle,
    color: 'from-secondary-500 to-secondary-600',
  },
  {
    step: 3,
    title: 'Earn & Grow',
    description: 'Get certified, showcase your skills, and advance your career.',
    icon: Award,
    color: 'from-accent-500 to-accent-600',
  },
];

const categories = [
  { name: 'Web Development', icon: Code, count: 245, color: 'from-blue-500 to-cyan-500' },
  { name: 'Data Science', icon: BarChart3, count: 180, color: 'from-emerald-500 to-teal-500' },
  { name: 'Design', icon: Palette, count: 120, color: 'from-pink-500 to-rose-500' },
  { name: 'Photography', icon: Camera, count: 85, color: 'from-amber-500 to-orange-500' },
  { name: 'Music', icon: Music, count: 95, color: 'from-violet-500 to-purple-500' },
  { name: 'Languages', icon: Globe, count: 150, color: 'from-indigo-500 to-blue-500' },
  { name: 'AI & ML', icon: Brain, count: 110, color: 'from-red-500 to-pink-500' },
  { name: 'Business', icon: TrendingUp, count: 200, color: 'from-yellow-500 to-amber-500' },
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Software Engineer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    content: 'The courses here transformed my career. I went from beginner to professional developer in just 6 months.',
    rating: 5,
  },
  {
    name: 'Marcus Chen',
    role: 'Data Analyst',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    content: 'Exceptional quality of instruction. The hands-on projects and real-world examples made all the difference.',
    rating: 5,
  },
  {
    name: 'Priya Patel',
    role: 'UX Designer',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    content: 'I love the interactive approach to learning. The platform makes it easy to learn at my own pace.',
    rating: 5,
  },
  {
    name: 'Alex Rodriguez',
    role: 'Product Manager',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    content: 'The certification program helped me land my dream job. Highly recommended for career changers.',
    rating: 4,
  },
];

const companies = [
  'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Spotify', 'Adobe',
];

const featuredCourses = [
  {
    title: 'Complete Web Development Bootcamp',
    instructor: 'John Doe',
    rating: 4.8,
    students: 15420,
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=340&fit=crop',
    category: 'Web Development',
    price: '$49.99',
  },
  {
    title: 'Machine Learning A-Z: Hands-On Python',
    instructor: 'Dr. Sarah Wilson',
    rating: 4.9,
    students: 12300,
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=340&fit=crop',
    category: 'AI & ML',
    price: '$59.99',
  },
  {
    title: 'UI/UX Design Masterclass',
    instructor: 'Emily Chen',
    rating: 4.7,
    students: 8900,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=340&fit=crop',
    category: 'Design',
    price: '$39.99',
  },
  {
    title: 'Data Science & Analytics',
    instructor: 'Michael Brown',
    rating: 4.8,
    students: 10200,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=340&fit=crop',
    category: 'Data Science',
    price: '$54.99',
  },
  {
    title: 'Advanced React & Next.js',
    instructor: 'David Kim',
    rating: 4.9,
    students: 7800,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=340&fit=crop',
    category: 'Web Development',
    price: '$44.99',
  },
];

function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 4 + (i % 5) * 3,
            height: 4 + (i % 5) * 3,
            left: `${(i * 7) % 100}%`,
            top: `${(i * 13) % 100}%`,
            background: i % 3 === 0 ? 'rgba(59, 130, 246, 0.3)' : i % 3 === 1 ? 'rgba(139, 92, 246, 0.3)' : 'rgba(217, 70, 239, 0.3)',
          }}
          animate={{
            y: [0, -30 - (i % 5) * 10, 0],
            x: [0, (i % 3 === 0 ? 1 : -1) * (10 + (i % 4) * 5), 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 5 + (i % 3) * 3,
            repeat: Infinity,
            delay: i * 0.3,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

function StatCounter({ value, suffix, label, icon: Icon }: StatItem) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isInView && counterRef.current) {
      gsap.fromTo(
        counterRef.current,
        { textContent: 0 },
        {
          textContent: value,
          duration: 2,
          ease: 'power2.out',
          snap: { textContent: 1 },
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 80%',
          },
        },
      );
    }
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white/80 p-6 backdrop-blur-xl transition-all duration-300 hover:border-primary-100 hover:shadow-lg hover:shadow-primary-500/5 dark:border-gray-800 dark:bg-gray-900/80 dark:hover:border-primary-800"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-primary-950/20" />
      <div className="relative z-10">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500/10 to-secondary-500/10 dark:from-primary-400/10 dark:to-secondary-400/10">
          <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
        </div>
        <div className="flex items-baseline gap-0.5">
          <span
            ref={counterRef}
            className="text-3xl font-bold text-gray-900 dark:text-gray-100"
          >
            0
          </span>
          <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">{suffix}</span>
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{label}</p>
      </div>
    </motion.div>
  );
}

function TestimonialsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
    return () => el.removeEventListener('scroll', checkScroll);
  }, [checkScroll]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
      >
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            custom={i}
            className="min-w-[350px] snap-start md:min-w-[400px]"
          >
            <Card glass hover className="h-full">
              <CardContent className="flex flex-col gap-4 p-6">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className={cn(
                        'h-4 w-4',
                        j < t.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700',
                      )}
                    />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  &ldquo;{t.content}&rdquo;
                </p>
                <div className="mt-auto flex items-center gap-3 pt-2">
                  <Avatar src={t.avatar} alt={t.name} size="md" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <div className="mt-4 flex justify-center gap-2">
        <button
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-all hover:border-primary-200 hover:text-primary-600 disabled:opacity-30 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-primary-600"
        >
          <ChevronRight className="h-4 w-4 rotate-180" />
        </button>
        <button
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-all hover:border-primary-200 hover:text-primary-600 disabled:opacity-30 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-primary-600"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-b from-gray-50 via-white to-white dark:from-gray-950 dark:via-gray-950 dark:to-gray-950">
      <FloatingShapes />

      {/* Gradient Orbs */}
      <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary-500/10 blur-[150px]" />
      <div className="absolute -right-40 top-1/3 h-[400px] w-[400px] rounded-full bg-secondary-500/10 blur-[150px]" />
      <div className="absolute bottom-0 left-1/3 h-[300px] w-[300px] rounded-full bg-accent-500/10 blur-[150px]" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(59,130,246,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,.1) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="glass-primary" size="lg" className="mb-6">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              Empowering Learners Worldwide
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl"
          >
            <span className="text-gray-900 dark:text-gray-100">Learn</span>{' '}
            <span className="gradient-text">Without Limits</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-500 dark:text-gray-400"
          >
            Unlock your potential with expert-led courses, interactive lessons, and industry-recognized certifications. Start your learning journey today.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link href={ROUTES.REGISTER}>
              <Button variant="primary" size="xl" className="group">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href={ROUTES.COURSES}>
              <Button variant="outline" size="xl">
                Browse Courses
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span>Cancel anytime</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative -mt-20 z-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 gap-4 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <StatCounter key={stat.label} {...stat} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FeaturedCoursesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -400 : 400,
      behavior: 'smooth',
    });
  };

  return (
    <section ref={ref} className="section-padding overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-10 flex items-end justify-between"
        >
          <div>
            <Badge variant="secondary" className="mb-3">Featured Courses</Badge>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
              Popular Courses
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Hand-picked courses by our expert instructors
            </p>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <button
              onClick={() => scroll('left')}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-all hover:border-primary-200 hover:text-primary-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-all hover:border-primary-200 hover:text-primary-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
        >
          {featuredCourses.map((course, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              custom={i}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="min-w-[320px] snap-start md:min-w-[360px]"
            >
              <Link href={ROUTES.COURSES}>
                <Card glass hover className="group h-full overflow-hidden">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <Badge variant="glass" size="sm" className="absolute left-3 top-3">
                      {course.category}
                    </Badge>
                    <Badge variant="glass" size="sm" className="absolute right-3 top-3">
                      {course.price}
                    </Badge>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {course.instructor}
                    </p>
                    <div className="mt-3 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        {course.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {course.students.toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="section-padding bg-gray-50/50 dark:bg-gray-900/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Badge variant="secondary" className="mb-3">How It Works</Badge>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
            Start Learning in 3 Easy Steps
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-gray-500 dark:text-gray-400">
            Your journey to knowledge and growth begins here
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mt-12 grid gap-8 md:grid-cols-3"
        >
          {howItWorks.map((step) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                variants={fadeUp}
                className="group relative text-center"
              >
                <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-lg shadow-gray-200/50 transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 dark:from-gray-800 dark:to-gray-900 dark:shadow-gray-900/50">
                  <div className={cn(
                    'absolute inset-0 rounded-2xl bg-gradient-to-br opacity-10 transition-opacity duration-300 group-hover:opacity-20',
                    step.color,
                  )} />
                  <Icon className="relative h-9 w-9 text-gray-700 dark:text-gray-300" />
                </div>
                <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-xs font-bold text-white shadow-lg">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function CategoriesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="section-padding">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <Badge variant="secondary" className="mb-3">Categories</Badge>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
            Explore by Category
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-gray-500 dark:text-gray-400">
            Discover courses across various disciplines
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
              >
                <Link
                  href={ROUTES.COURSES}
                  className="group relative flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className={cn(
                    'flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg transition-transform duration-300 group-hover:scale-110',
                    cat.color,
                  )}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {cat.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                      {cat.count} courses
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="section-padding bg-gray-50/50 dark:bg-gray-900/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <Badge variant="secondary" className="mb-3">Testimonials</Badge>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
            What Our Students Say
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-gray-500 dark:text-gray-400">
            Hear from our community of learners
          </p>
        </motion.div>

        <TestimonialsCarousel />
      </div>
    </section>
  );
}

function CompaniesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="section-padding">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <p className="text-sm font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Trusted by professionals from
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6"
        >
          {companies.map((company, i) => (
            <motion.div
              key={company}
              variants={fadeUp}
              custom={i}
              className="flex items-center gap-2 text-gray-300 transition-colors duration-300 hover:text-gray-500 dark:text-gray-700 dark:hover:text-gray-500"
            >
              <Monitor className="h-5 w-5" />
              <span className="text-lg font-semibold tracking-tight">{company}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function NewsletterSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="section-padding">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 px-8 py-16 sm:px-16"
        >
          {/* Background decoration */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent-500/20 blur-[100px]" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary-400/20 blur-[100px]" />

          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20">
                <Mail className="h-7 w-7 text-white" />
              </div>
            </motion.div>

            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Stay Updated with New Courses
            </h2>
            <p className="mt-3 text-white/60">
              Get weekly updates on new courses, industry insights, and exclusive offers.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <Button
                variant="primary"
                size="lg"
                className="whitespace-nowrap bg-white text-primary-900 hover:bg-gray-100"
              >
                Subscribe
                <Heart className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <p className="mt-4 text-xs text-white/30">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturedCoursesSection />
        <HowItWorksSection />
        <CategoriesSection />
        <TestimonialsSection />
        <CompaniesSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
}
