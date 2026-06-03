'use client';

import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  BookOpen,
  Star,
  Calendar,
  Download,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { StatCard } from '@/components/shared/stat-card';
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

const revenueTrend = [
  { date: 'Jan', revenue: 8200, enrollments: 85 },
  { date: 'Feb', revenue: 9600, enrollments: 102 },
  { date: 'Mar', revenue: 11200, enrollments: 128 },
  { date: 'Apr', revenue: 10400, enrollments: 95 },
  { date: 'May', revenue: 14800, enrollments: 156 },
  { date: 'Jun', revenue: 17200, enrollments: 182 },
];

const weeklyRevenue = [
  { day: 'Mon', revenue: 2400 },
  { day: 'Tue', revenue: 3200 },
  { day: 'Wed', revenue: 2800 },
  { day: 'Thu', revenue: 4100 },
  { day: 'Fri', revenue: 3600 },
  { day: 'Sat', revenue: 5200 },
  { day: 'Sun', revenue: 4800 },
];

const enrollmentData = [
  { month: 'Jan', students: 45 },
  { month: 'Feb', students: 62 },
  { month: 'Mar', students: 78 },
  { month: 'Apr', students: 55 },
  { month: 'May', students: 92 },
  { month: 'Jun', students: 110 },
];

const topCourses = [
  { title: 'Complete Web Development Bootcamp', students: 234, revenue: 18720, rating: 4.8, completion: 72 },
  { title: 'Advanced React & Next.js', students: 156, revenue: 12480, rating: 4.6, completion: 65 },
  { title: 'Python for Data Science', students: 98, revenue: 7840, rating: 4.9, completion: 81 },
  { title: 'TypeScript Deep Dive', students: 45, revenue: 3600, rating: 4.5, completion: 58 },
  { title: 'AWS Cloud Architecture', students: 67, revenue: 5360, rating: 4.7, completion: 44 },
];

const geographicData = [
  { country: 'Bangladesh', students: 245 },
  { country: 'India', students: 178 },
  { country: 'USA', students: 96 },
  { country: 'UK', students: 54 },
  { country: 'Canada', students: 38 },
  { country: 'Others', students: 73 },
];

const PIE_COLORS = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#7c3aed', '#6d28d9', '#ddd6fe'];

const engagementMetrics = [
  { label: 'Avg. Watch Time', value: '32m 14s', trend: 12 },
  { label: 'Completion Rate', value: '68%', trend: 5 },
  { label: 'Avg. Rating', value: '4.7', trend: 2 },
  { label: 'Discussion Activity', value: '156 posts', trend: -3 },
];

const dateRangeOptions = [
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
  { value: '1y', label: 'This Year' },
  { value: 'all', label: 'All Time' },
];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('30d');
  const [chartView, setChartView] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Track your performance and student engagement
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={dateRange}
            onValueChange={setDateRange}
            options={dateRangeOptions}
            className="w-40"
          />
          <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />}>
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value="$68,240"
          trend={{ value: 14.2, isPositive: true, label: 'vs last period' }}
          variant="success"
        />
        <StatCard
          icon={Users}
          label="Total Students"
          value={684}
          trend={{ value: 8.7, isPositive: true, label: 'vs last period' }}
          variant="primary"
        />
        <StatCard
          icon={BookOpen}
          label="Active Courses"
          value={12}
          trend={{ value: 2, isPositive: true, label: 'vs last period' }}
          variant="secondary"
        />
        <StatCard
          icon={Star}
          label="Avg. Rating"
          value="4.7"
          trend={{ value: 0.3, isPositive: true, label: 'vs last period' }}
          variant="warning"
        />
      </div>

      {/* Revenue & Enrollment Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card glass>
          <CardHeader divider>
            <div className="flex items-center justify-between">
              <CardTitle>Revenue</CardTitle>
              <div className="flex items-center gap-1 rounded-lg border border-purple-200/40 bg-purple-50/50 p-0.5 dark:border-purple-900/30 dark:bg-purple-950/30">
                {(['daily', 'weekly', 'monthly'] as const).map((view) => (
                  <button
                    key={view}
                    onClick={() => setChartView(view)}
                    className={cn(
                      'rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors',
                      chartView === view
                        ? 'bg-white text-purple-700 shadow-sm dark:bg-purple-900 dark:text-purple-300'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400',
                    )}
                  >
                    {view}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartView === 'daily' ? weeklyRevenue : revenueTrend}>
                  <defs>
                    <linearGradient id="analyticsRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey={chartView === 'daily' ? 'day' : 'date'} stroke="#9ca3af" fontSize={12} />
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
                    fill="url(#analyticsRevenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Enrollment Chart */}
        <Card glass>
          <CardHeader divider>
            <CardTitle>Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={enrollmentData}>
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
                  <Bar dataKey="students" fill="#a78bfa" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Metrics */}
      <Card glass>
        <CardHeader divider>
          <CardTitle>Engagement Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {engagementMetrics.map((metric, idx) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
              >
                <p className="text-sm text-gray-500 dark:text-gray-400">{metric.label}</p>
                <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">{metric.value}</p>
                <div className="mt-2 flex items-center gap-1 text-xs font-medium">
                  {metric.trend >= 0 ? (
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                  )}
                  <span className={metric.trend >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                    {metric.trend >= 0 ? '+' : ''}{metric.trend}%
                  </span>
                  <span className="text-gray-400">vs last period</span>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Courses & Geographic Distribution */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Top Courses Table */}
        <Card glass className="lg:col-span-2">
          <CardHeader divider>
            <CardTitle>Top Courses</CardTitle>
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
                    <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Completion</th>
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
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{course.title}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{course.students}</td>
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">${course.revenue.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span>{course.rating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-16 rounded-full bg-gray-200 dark:bg-gray-700">
                            <div
                              className="h-full rounded-full bg-purple-500"
                              style={{ width: `${course.completion}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{course.completion}%</span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card glass>
          <CardHeader divider>
            <CardTitle>Geographic Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={geographicData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    dataKey="students"
                    nameKey="country"
                  >
                    {geographicData.map((_, idx) => (
                      <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
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
              {geographicData.map((item, idx) => (
                <div key={item.country} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: PIE_COLORS[idx] }} />
                    <span className="text-gray-600 dark:text-gray-400">{item.country}</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{item.students}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
