'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  BookOpen,
  DollarSign,
  GraduationCap,
  Activity,
  HeartPulse,
  Send,
  UserCheck,
  FileCheck,
  TrendingUp,
  TrendingDown,
  Bell,
  Clock,
  ChevronRight,
  MoreHorizontal,
  Download,
  RefreshCw,
  Server,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { StatCard } from '@/components/shared/stat-card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

const dailyActiveUsers = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  users: 100 + (i * 17) % 400,
}));

const signupsPerDay = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  signups: 20 + (i * 7) % 80,
}));

const courseDistribution = [
  { name: 'Web Development', value: 35 },
  { name: 'Data Science', value: 25 },
  { name: 'Mobile Apps', value: 20 },
  { name: 'Design', value: 12 },
  { name: 'Business', value: 8 },
];

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];

const topCourses = [
  { title: 'Complete Web Development Bootcamp', instructor: 'John Doe', students: 1234, revenue: 98720, rating: 4.8, status: 'Published' },
  { title: 'Advanced React & Next.js', instructor: 'Jane Smith', students: 956, revenue: 76480, rating: 4.6, status: 'Published' },
  { title: 'Python for Data Science', instructor: 'Dr. Rahman', students: 678, revenue: 54240, rating: 4.9, status: 'Published' },
  { title: 'UI/UX Design Masterclass', instructor: 'Sarah Khan', students: 445, revenue: 35600, rating: 4.7, status: 'Pending' },
  { title: 'TypeScript Deep Dive', instructor: 'Mike Chen', students: 312, revenue: 24960, rating: 4.5, status: 'Published' },
];

const quickActions = [
  { icon: Send, label: 'Send Broadcast', color: 'text-primary-600 bg-primary-100 dark:bg-primary-950/50', href: '/admin/notifications' },
  { icon: UserCheck, label: 'Approve Teachers', color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-950/50', href: '/admin/users?tab=pending' },
  { icon: FileCheck, label: 'Moderate Courses', color: 'text-amber-600 bg-amber-100 dark:bg-amber-950/50', href: '/admin/courses?tab=pending' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 p-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Platform overview and health metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />}>
            Export Report
          </Button>
          <Button variant="primary" size="sm" leftIcon={<RefreshCw className="h-4 w-4" />}>
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard icon={Users} label="Total Users" value="12,847" trend={{ value: 12.5, isPositive: true, label: 'vs last month' }} variant="primary" />
        <StatCard icon={BookOpen} label="Total Courses" value="486" trend={{ value: 8.3, isPositive: true, label: 'vs last month' }} variant="secondary" />
        <StatCard icon={DollarSign} label="Total Revenue" value="$284.5K" trend={{ value: 15.2, isPositive: true, label: 'vs last month' }} variant="success" />
        <StatCard icon={GraduationCap} label="Active Students" value="8,234" trend={{ value: 10.1, isPositive: true, label: 'vs last month' }} variant="warning" />
        <StatCard icon={Users} label="Teachers" value="124" trend={{ value: 5.4, isPositive: true, label: 'vs last month' }} variant="primary" />
        <StatCard icon={HeartPulse} label="Platform Health" value="98.5%" trend={{ value: 0.5, isPositive: true, label: 'vs last month' }} variant="success" />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {/* Daily Active Users */}
        <motion.div variants={itemVariants} className="xl:col-span-2">
          <Card glass>
            <CardHeader divider>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Daily Active Users</CardTitle>
                  <CardDescription>Last 30 days</CardDescription>
                </div>
                <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 p-0.5 dark:border-gray-700 dark:bg-gray-800">
                  {(['7d', '30d', '90d'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setTimeRange(r)}
                      className={cn(
                        'rounded-md px-3 py-1 text-xs font-medium transition-colors',
                        timeRange === r
                          ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-950 dark:text-gray-100'
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400',
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyActiveUsers}>
                    <defs>
                      <linearGradient id="dauGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} tick={false} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        background: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(12px)',
                      }}
                    />
                    <Area type="monotone" dataKey="users" stroke="#ef4444" strokeWidth={2} fill="url(#dauGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Course Distribution Pie */}
        <motion.div variants={itemVariants}>
          <Card glass className="h-full">
            <CardHeader divider>
              <CardTitle>Course Distribution</CardTitle>
              <CardDescription>By category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={courseDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                      {courseDistribution.map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        background: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(12px)',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {courseDistribution.map((item, idx) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                      <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* New Signups per Day */}
        <motion.div variants={itemVariants}>
          <Card glass>
            <CardHeader divider>
              <CardTitle>New Signups</CardTitle>
              <CardDescription>Per day (last 30 days)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={signupsPerDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} tick={false} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        background: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(12px)',
                      }}
                    />
                    <Bar dataKey="signups" fill="#f97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Platform Metrics */}
        <motion.div variants={itemVariants}>
          <Card glass>
            <CardHeader divider>
              <CardTitle>Platform Metrics</CardTitle>
              <CardDescription>Server & system health</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Server Response Time</span>
                  <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">124ms</span>
                </div>
                <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-800">
                  <div className="h-2 rounded-full bg-emerald-500" style={{ width: '35%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Error Rate</span>
                  <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">0.02%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-800">
                  <div className="h-2 rounded-full bg-emerald-500" style={{ width: '2%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Uptime (30 days)</span>
                  <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">99.97%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-800">
                  <div className="h-2 rounded-full bg-emerald-500" style={{ width: '99.97%' }} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="rounded-xl bg-emerald-50 p-3 text-center dark:bg-emerald-950/30">
                  <Server className="mx-auto mb-1 h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">API Status</p>
                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Operational</p>
                </div>
                <div className="rounded-xl bg-emerald-50 p-3 text-center dark:bg-emerald-950/30">
                  <CheckCircle2 className="mx-auto mb-1 h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">Database</p>
                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Healthy</p>
                </div>
                <div className="rounded-xl bg-amber-50 p-3 text-center dark:bg-amber-950/30">
                  <AlertTriangle className="mx-auto mb-1 h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">Cache</p>
                  <p className="text-xs font-medium text-amber-600 dark:text-amber-400">Degraded</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Top Courses Table */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card glass>
            <CardHeader divider>
              <div className="flex items-center justify-between">
                <CardTitle>Top Courses by Enrollment</CardTitle>
                <Link href="/admin/courses">
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
                      <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Instructor</th>
                      <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Students</th>
                      <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Revenue</th>
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
                        className="border-b border-gray-50 transition-colors hover:bg-gray-50/50 dark:border-gray-800/50 dark:hover:bg-gray-800/30"
                      >
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900 dark:text-gray-100">{course.title}</p>
                        </td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{course.instructor}</td>
                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{course.students.toLocaleString()}</td>
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">${course.revenue.toLocaleString()}</td>
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

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <Card glass className="h-full">
            <CardHeader divider>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.label} href={action.href}>
                    <div className="flex cursor-pointer items-center gap-3 rounded-xl p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', action.color)}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{action.label}</span>
                      <ChevronRight className="ml-auto h-4 w-4 text-gray-400" />
                    </div>
                  </Link>
                );
              })}
              <div className="mt-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-800/30">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Pending Reviews</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">12 courses awaiting moderation</p>
                  </div>
                  <Badge variant="danger" size="sm" className="ml-auto">12</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
