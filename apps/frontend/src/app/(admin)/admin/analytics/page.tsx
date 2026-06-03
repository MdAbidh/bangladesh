'use client';

import { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  BookOpen,
  GraduationCap,
  Globe,
  Download,
  Calendar,
  ChevronDown,
  Activity,
  MousePointerClick,
  Clock,
  UserPlus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/shared/stat-card';
import { Select } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const dateRanges = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: '1y', label: 'Last year' },
  { value: 'custom', label: 'Custom range' },
];

const userGrowth = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  students: Math.floor(Math.random() * 800) + 400,
  teachers: Math.floor(Math.random() * 30) + 10,
  total: Math.floor(Math.random() * 1000) + 500,
}));

const revenueData = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  revenue: Math.floor(Math.random() * 40000) + 10000,
  subscriptions: Math.floor(Math.random() * 20000) + 5000,
  oneTime: Math.floor(Math.random() * 15000) + 3000,
}));

const coursePerformance = Array.from({ length: 8 }, (_, i) => ({
  name: ['Web Dev', 'Data Science', 'Mobile Apps', 'UI/UX', 'Business', 'Marketing', 'AI/ML', 'Cloud'][i],
  enrollments: Math.floor(Math.random() * 500) + 100,
  completion: Math.floor(Math.random() * 40) + 40,
  rating: Number((3.5 + Math.random() * 1.5).toFixed(1)),
}));

const retentionData = Array.from({ length: 12 }, (_, i) => ({
  week: `Week ${i + 1}`,
  retention: Math.max(100 - i * 7 + Math.floor(Math.random() * 10), 10),
}));

const geoData = [
  { country: 'Bangladesh', users: 5240, percentage: 40.8 },
  { country: 'India', users: 2180, percentage: 17.0 },
  { country: 'USA', users: 1670, percentage: 13.0 },
  { country: 'UK', users: 890, percentage: 6.9 },
  { country: 'Canada', users: 720, percentage: 5.6 },
  { country: 'Other', users: 2147, percentage: 16.7 },
];

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export default function AdminAnalytics() {
  const [dateRange, setDateRange] = useState('30d');

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 p-6">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Platform-wide metrics and insights</p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            options={dateRanges}
            value={dateRange}
            onValueChange={setDateRange}
            triggerClassName="w-40"
          />
          <Button variant="primary" size="sm" leftIcon={<Download className="h-4 w-4" />}>
            Export Report
          </Button>
        </div>
      </motion.div>

      {/* Overview Metrics */}
      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total Users" value="12,847" trend={{ value: 12.5, isPositive: true, label: 'vs last period' }} variant="primary" />
        <StatCard icon={DollarSign} label="Total Revenue" value="$284,500" trend={{ value: 15.2, isPositive: true, label: 'vs last period' }} variant="success" />
        <StatCard icon={BookOpen} label="Active Courses" value="342" trend={{ value: 8.3, isPositive: true, label: 'vs last period' }} variant="secondary" />
        <StatCard icon={GraduationCap} label="Completion Rate" value="72%" trend={{ value: 3.1, isPositive: true, label: 'vs last period' }} variant="warning" />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Growth */}
        <motion.div variants={itemVariants}>
          <Card glass>
            <CardHeader divider>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>Monthly new registrations</CardDescription>
                </div>
                <Badge variant="success" size="sm">
                  <TrendingUp className="h-3 w-3 mr-1" /> +12.5%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
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
                    <Legend />
                    <Bar dataKey="students" name="Students" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="teachers" name="Teachers" fill="#f97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Revenue Analytics */}
        <motion.div variants={itemVariants}>
          <Card glass>
            <CardHeader divider>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Revenue Analytics</CardTitle>
                  <CardDescription>Revenue breakdown by source</CardDescription>
                </div>
                <Badge variant="success" size="sm">
                  <TrendingUp className="h-3 w-3 mr-1" /> +15.2%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
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
                    <Legend />
                    <Area type="monotone" dataKey="revenue" name="Total Revenue" stroke="#22c55e" strokeWidth={2} fill="url(#revGrad)" />
                    <Area type="monotone" dataKey="subscriptions" name="Subscriptions" stroke="#3b82f6" strokeWidth={2} fill="none" strokeDasharray="4 4" />
                    <Area type="monotone" dataKey="oneTime" name="One-Time" stroke="#f97316" strokeWidth={2} fill="none" strokeDasharray="4 4" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-gray-50 p-3 text-center dark:bg-gray-800/50">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">$284.5K</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-3 text-center dark:bg-gray-800/50">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Subscriptions</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">$142.2K</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-3 text-center dark:bg-gray-800/50">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Avg. per User</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">$22.15</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Course Performance */}
        <motion.div variants={itemVariants}>
          <Card glass>
            <CardHeader divider>
              <CardTitle>Course Performance</CardTitle>
              <CardDescription>Enrollments, completion, and ratings by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400">Category</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400">Enrollments</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400">Completion</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coursePerformance.map((c, idx) => (
                      <motion.tr
                        key={c.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className="border-b border-gray-50 transition-colors hover:bg-gray-50/50 dark:border-gray-800/50 dark:hover:bg-gray-800/30"
                      >
                        <td className="px-3 py-3 font-medium text-gray-900 dark:text-gray-100">{c.name}</td>
                        <td className="px-3 py-3 text-gray-600 dark:text-gray-400">{c.enrollments}</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-20 rounded-full bg-gray-200 dark:bg-gray-700">
                              <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${c.completion}%` }} />
                            </div>
                            <span className="text-xs text-gray-500">{c.completion}%</span>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-1">
                            <div className="h-2 w-12 rounded-full bg-gray-200 dark:bg-gray-700">
                              <div className="h-2 rounded-full bg-amber-400" style={{ width: `${(c.rating / 5) * 100}%` }} />
                            </div>
                            <span className="text-xs text-gray-500">{c.rating}</span>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Retention */}
        <motion.div variants={itemVariants}>
          <Card glass>
            <CardHeader divider>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Student Retention</CardTitle>
                  <CardDescription>Cohort-based weekly retention</CardDescription>
                </div>
                <Badge variant="info" size="sm">Cohort: Jan 2026</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={retentionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="week" stroke="#9ca3af" fontSize={12} />
                    <YAxis domain={[0, 100]} stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        background: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(12px)',
                      }}
                    />
                    <Line type="monotone" dataKey="retention" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex items-center justify-between rounded-xl bg-violet-50/50 p-3 dark:bg-violet-950/30">
                <span className="text-sm text-gray-600 dark:text-gray-400">12-Week Retention</span>
                <span className="text-lg font-bold text-gray-900 dark:text-gray-100">23%</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Geographic Data */}
      <motion.div variants={itemVariants}>
        <Card glass>
          <CardHeader divider>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Geographic Distribution</CardTitle>
                <CardDescription>Users by country</CardDescription>
              </div>
              <Globe className="h-5 w-5 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={geoData} cx="50%" cy="50%" outerRadius={90} dataKey="users" label={({ country, percentage }) => `${country} ${percentage}%`}>
                      {geoData.map((_, idx) => (
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
              <div className="space-y-3">
                {geoData.map((item, idx) => (
                  <div key={item.country} className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.country}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{item.users.toLocaleString()}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700">
                        <div className="h-1.5 rounded-full" style={{ width: `${item.percentage}%`, backgroundColor: COLORS[idx] }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
