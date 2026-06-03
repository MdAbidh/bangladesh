'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Users,
  DollarSign,
  Star,
  ArrowUpRight,
  PlusCircle,
  Upload,
  BarChart3,
  Clock,
  MessageSquare,
  Bell,
  ChevronRight,
  GraduationCap,
  TrendingUp,
  TrendingDown,
  Play,
  FileText,
  MoreHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/shared/stat-card';
import { EmptyState } from '@/components/shared/empty-state';
import { RatingStars } from '@/components/shared/rating-stars';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 4200, enrollments: 45 },
  { month: 'Feb', revenue: 5800, enrollments: 62 },
  { month: 'Mar', revenue: 7200, enrollments: 78 },
  { month: 'Apr', revenue: 6100, enrollments: 55 },
  { month: 'May', revenue: 8900, enrollments: 92 },
  { month: 'Jun', revenue: 10400, enrollments: 110 },
];

const enrollmentTrend = [
  { week: 'W1', students: 120 },
  { week: 'W2', students: 180 },
  { week: 'W3', students: 145 },
  { week: 'W4', students: 220 },
  { week: 'W5', students: 280 },
  { week: 'W6', students: 310 },
];

const topCourses = [
  { title: 'Complete Web Development Bootcamp', students: 234, revenue: 18720, rating: 4.8, status: 'Published' },
  { title: 'Advanced React & Next.js', students: 156, revenue: 12480, rating: 4.6, status: 'Published' },
  { title: 'Python for Data Science', students: 98, revenue: 7840, rating: 4.9, status: 'Published' },
  { title: 'UI/UX Design Masterclass', students: 67, revenue: 5360, rating: 4.7, status: 'Draft' },
  { title: 'TypeScript Deep Dive', students: 45, revenue: 3600, rating: 4.5, status: 'Published' },
];

const recentReviews = [
  { user: 'Sarah Ahmed', course: 'Complete Web Development', rating: 5, comment: 'Amazing course! Learned so much.', time: '2 hours ago' },
  { user: 'Rahim Khan', course: 'Advanced React & Next.js', rating: 4, comment: 'Great content, but could use more exercises.', time: '5 hours ago' },
  { user: 'Fatima Begum', course: 'Python for Data Science', rating: 5, comment: 'Best Python course I have taken.', time: '1 day ago' },
];

const notifications = [
  { icon: Users, text: '3 new students enrolled in Web Development', time: '10 min ago', type: 'info' },
  { icon: Star, text: 'New 5-star review on React course', time: '1 hour ago', type: 'success' },
  { icon: MessageSquare, text: '5 new discussion replies awaiting moderation', time: '3 hours ago', type: 'warning' },
  { icon: DollarSign, text: 'Monthly payout of $12,450 has been processed', time: '1 day ago', type: 'info' },
  { icon: FileText, text: 'Course "TypeScript Deep Dive" requires updates', time: '2 days ago', type: 'warning' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function TeacherDashboard() {
  const [revenueView, setRevenueView] = useState<'weekly' | 'monthly'>('monthly');

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Teacher Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Welcome back! Here is your performance overview.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="glass-primary" size="sm" leftIcon={<Bell className="h-4 w-4" />}>
            Notifications
          </Button>
          <Button variant="primary" size="sm" leftIcon={<PlusCircle className="h-4 w-4" />}>
            Create Course
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={BookOpen}
          label="Total Courses"
          value={12}
          trend={{ value: 16.7, isPositive: true, label: 'vs last month' }}
          variant="primary"
        />
        <StatCard
          icon={Users}
          label="Total Students"
          value={684}
          trend={{ value: 12.3, isPositive: true, label: 'vs last month' }}
          variant="secondary"
        />
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value="$48,240"
          trend={{ value: 8.5, isPositive: true, label: 'vs last month' }}
          variant="success"
        />
        <StatCard
          icon={Star}
          label="Average Rating"
          value="4.7"
          trend={{ value: 2.1, isPositive: true, label: 'vs last month' }}
          variant="warning"
        />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card glass>
            <CardHeader divider>
              <div className="flex items-center justify-between">
                <CardTitle>Revenue Overview</CardTitle>
                <div className="flex items-center gap-1 rounded-lg border border-purple-200/40 bg-purple-50/50 p-0.5 dark:border-purple-900/30 dark:bg-purple-950/30">
                  <button
                    onClick={() => setRevenueView('weekly')}
                    className={cn(
                      'rounded-md px-3 py-1 text-xs font-medium transition-colors',
                      revenueView === 'weekly'
                        ? 'bg-white text-purple-700 shadow-sm dark:bg-purple-900 dark:text-purple-300'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400',
                    )}
                  >
                    Weekly
                  </button>
                  <button
                    onClick={() => setRevenueView('monthly')}
                    className={cn(
                      'rounded-md px-3 py-1 text-xs font-medium transition-colors',
                      revenueView === 'monthly'
                        ? 'bg-white text-purple-700 shadow-sm dark:bg-purple-900 dark:text-purple-300'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400',
                    )}
                  >
                    Monthly
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        background: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(12px)',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      fill="url(#revenueGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enrollment Trend */}
        <motion.div variants={itemVariants}>
          <Card glass>
            <CardHeader divider>
              <CardTitle>Enrollment Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={enrollmentTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="week" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        background: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(12px)',
                      }}
                    />
                    <Bar dataKey="students" fill="#a78bfa" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex items-center justify-between rounded-xl bg-purple-50/50 p-3 dark:bg-purple-950/30">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total this period</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">1,255</p>
                </div>
                <div className="flex items-center gap-1 text-sm text-emerald-600">
                  <TrendingUp className="h-4 w-4" />
                  +18.2%
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Top Performing Courses */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card glass>
            <CardHeader divider>
              <div className="flex items-center justify-between">
                <CardTitle>Top Performing Courses</CardTitle>
                <Link href="/teacher/courses">
                  <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="h-4 w-4" />}>
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Course</th>
                      <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Students</th>
                      <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Revenue</th>
                      <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Rating</th>
                      <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topCourses.map((course, idx) => (
                      <motion.tr
                        key={course.title}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="border-b border-gray-50 transition-colors hover:bg-purple-50/30 dark:border-gray-800/50 dark:hover:bg-purple-950/20"
                      >
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900 dark:text-gray-100">{course.title}</p>
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{course.students}</td>
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">${course.revenue.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-gray-600 dark:text-gray-400">{course.rating}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={course.status === 'Published' ? 'success' : 'warning'} size="sm">
                            {course.status}
                          </Badge>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Reviews & Quick Actions */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Recent Reviews */}
          <Card glass>
            <CardHeader divider>
              <CardTitle>Recent Reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentReviews.map((review, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="rounded-xl bg-gray-50/50 p-3 dark:bg-gray-800/30"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{review.user}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{review.course}</p>
                    </div>
                    <span className="text-xs text-gray-400">{review.time}</span>
                  </div>
                  <RatingStars value={review.rating} size="sm" className="mt-1" />
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{review.comment}</p>
                </motion.div>
              ))}
              <Link href="/teacher/courses">
                <Button variant="ghost" size="sm" fullWidth rightIcon={<ChevronRight className="h-4 w-4" />}>
                  View All Reviews
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card glass>
            <CardHeader divider>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/teacher/courses/new">
                <Button variant="glass-primary" size="sm" fullWidth leftIcon={<PlusCircle className="h-4 w-4" />}>
                  Create New Course
                </Button>
              </Link>
              <Link href="/teacher/upload">
                <Button variant="glass-secondary" size="sm" fullWidth leftIcon={<Upload className="h-4 w-4" />}>
                  Upload Video
                </Button>
              </Link>
              <Link href="/teacher/analytics">
                <Button variant="ghost" size="sm" fullWidth leftIcon={<BarChart3 className="h-4 w-4" />}>
                  View Analytics
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Notification Feed */}
      <motion.div variants={itemVariants}>
        <Card glass>
          <CardHeader divider>
            <div className="flex items-center justify-between">
              <CardTitle>Notifications</CardTitle>
              <Badge variant="secondary" size="sm">{notifications.length} New</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-1 p-2">
            {notifications.map((notif, idx) => {
              const Icon = notif.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/30"
                >
                  <div className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-xl',
                    notif.type === 'info' && 'bg-purple-100 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400',
                    notif.type === 'success' && 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400',
                    notif.type === 'warning' && 'bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400',
                  )}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-gray-100">{notif.text}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{notif.time}</p>
                  </div>
                </motion.div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
