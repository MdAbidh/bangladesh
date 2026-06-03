'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  SlidersHorizontal,
  PlusCircle,
  MoreHorizontal,
  BookOpen,
  Users,
  Star,
  DollarSign,
  Eye,
  Edit3,
  Copy,
  Archive,
  Trash2,
  FileText,
  Grid3X3,
  List,
  ArrowUpDown,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { EmptyState } from '@/components/shared/empty-state';
import { Pagination } from '@/components/shared/pagination';
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface CourseEntry {
  id: string;
  title: string;
  category: string;
  status: 'Draft' | 'Pending' | 'Published' | 'Archived';
  students: number;
  rating: number;
  revenue: number;
  lastUpdated: string;
  thumbnail: string | null;
}

const allCourses: CourseEntry[] = [
  { id: '1', title: 'Complete Web Development Bootcamp', category: 'Web Development', status: 'Published', students: 234, rating: 4.8, revenue: 18720, lastUpdated: '2 days ago', thumbnail: null },
  { id: '2', title: 'Advanced React & Next.js', category: 'Web Development', status: 'Published', students: 156, rating: 4.6, revenue: 12480, lastUpdated: '1 week ago', thumbnail: null },
  { id: '3', title: 'Python for Data Science', category: 'Data Science', status: 'Published', students: 98, rating: 4.9, revenue: 7840, lastUpdated: '3 days ago', thumbnail: null },
  { id: '4', title: 'UI/UX Design Masterclass', category: 'Design', status: 'Draft', students: 0, rating: 0, revenue: 0, lastUpdated: '1 hour ago', thumbnail: null },
  { id: '5', title: 'TypeScript Deep Dive', category: 'Programming', status: 'Published', students: 45, rating: 4.5, revenue: 3600, lastUpdated: '5 days ago', thumbnail: null },
  { id: '6', title: 'Machine Learning Fundamentals', category: 'Data Science', status: 'Pending', students: 0, rating: 0, revenue: 0, lastUpdated: 'Just now', thumbnail: null },
  { id: '7', title: 'Node.js Backend Development', category: 'Web Development', status: 'Archived', students: 89, rating: 4.3, revenue: 7120, lastUpdated: '1 month ago', thumbnail: null },
  { id: '8', title: 'Flutter Mobile Development', category: 'Mobile', status: 'Draft', students: 0, rating: 0, revenue: 0, lastUpdated: '2 weeks ago', thumbnail: null },
  { id: '9', title: 'AWS Cloud Architecture', category: 'Cloud', status: 'Published', students: 67, rating: 4.7, revenue: 5360, lastUpdated: '4 days ago', thumbnail: null },
  { id: '10', title: 'DevOps with Docker & Kubernetes', category: 'DevOps', status: 'Pending', students: 0, rating: 0, revenue: 0, lastUpdated: '3 hours ago', thumbnail: null },
];

const statusColors: Record<string, 'success' | 'warning' | 'default' | 'danger'> = {
  Published: 'success',
  Pending: 'warning',
  Draft: 'default',
  Archived: 'danger',
};

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = allCourses
    .filter((c) => {
      const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      if (sortBy === 'oldest') return new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
      if (sortBy === 'students') return b.students - a.students;
      if (sortBy === 'revenue') return b.revenue - a.revenue;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'Draft', label: 'Draft' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Published', label: 'Published' },
    { value: 'Archived', label: 'Archived' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'students', label: 'Most Students' },
    { value: 'revenue', label: 'Highest Revenue' },
    { value: 'rating', label: 'Highest Rated' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Courses</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage and organize your course catalog
          </p>
        </div>
        <Link href="/teacher/courses/new">
          <Button variant="primary" size="sm" leftIcon={<PlusCircle className="h-4 w-4" />}>
            Create New Course
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card glass>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses..."
                className="h-10 w-full rounded-xl border border-gray-200 bg-white/80 pl-9 pr-3 text-sm placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700 dark:bg-gray-950/80 dark:text-gray-100"
              />
            </div>
            <div className="w-40">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
                options={statusOptions}
                placeholder="All Status"
              />
            </div>
            <div className="w-40">
              <Select
                value={sortBy}
                onValueChange={setSortBy}
                options={sortOptions}
                placeholder="Sort by"
              />
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-0.5 dark:border-gray-700 dark:bg-gray-950">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'rounded-md p-1.5 transition-colors',
                  viewMode === 'grid' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300' : 'text-gray-400 hover:text-gray-600',
                )}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'rounded-md p-1.5 transition-colors',
                  viewMode === 'list' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300' : 'text-gray-400 hover:text-gray-600',
                )}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course List/Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses found"
          description={searchQuery ? 'Try a different search term' : 'Get started by creating your first course'}
          action={!searchQuery ? { label: 'Create New Course', onClick: () => window.location.href = '/teacher/courses/new' } : undefined}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filtered.map((course, idx) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.03 }}
              >
                <Link href={`/teacher/courses/${course.id}`}>
                  <Card glass hover className="h-full cursor-pointer">
                    <div className="aspect-video w-full rounded-t-2xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-950/50 dark:to-indigo-950/50 flex items-center justify-center">
                      <BookOpen className="h-10 w-10 text-purple-300 dark:text-purple-600" />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={statusColors[course.status]} size="sm">{course.status}</Badge>
                        <span className="text-xs text-gray-400">{course.category}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">{course.title}</h3>
                      <div className="mt-3 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" />{course.students}</span>
                        {course.rating > 0 && (
                          <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-400" />{course.rating}</span>
                        )}
                        {course.revenue > 0 && (
                          <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />${course.revenue.toLocaleString()}</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <Card glass>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="px-6 py-4 text-left font-medium text-gray-500 dark:text-gray-400">Course</th>
                  <th className="px-6 py-4 text-left font-medium text-gray-500 dark:text-gray-400">Category</th>
                  <th className="px-6 py-4 text-left font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="px-6 py-4 text-left font-medium text-gray-500 dark:text-gray-400">Students</th>
                  <th className="px-6 py-4 text-left font-medium text-gray-500 dark:text-gray-400">Rating</th>
                  <th className="px-6 py-4 text-left font-medium text-gray-500 dark:text-gray-400">Revenue</th>
                  <th className="px-6 py-4 text-left font-medium text-gray-500 dark:text-gray-400">Updated</th>
                  <th className="px-6 py-4 text-right font-medium text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((course, idx) => (
                    <motion.tr
                      key={course.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ delay: idx * 0.02 }}
                      className="border-b border-gray-50 transition-colors hover:bg-purple-50/30 dark:border-gray-800/50 dark:hover:bg-purple-950/20"
                    >
                      <td className="px-6 py-4">
                        <Link href={`/teacher/courses/${course.id}`} className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-950/50 dark:to-indigo-950/50">
                            <BookOpen className="h-5 w-5 text-purple-400" />
                          </div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{course.title}</p>
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{course.category}</td>
                      <td className="px-6 py-4">
                        <Badge variant={statusColors[course.status]} size="sm">{course.status}</Badge>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{course.students}</td>
                      <td className="px-6 py-4">
                        {course.rating > 0 ? (
                          <div className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-gray-600 dark:text-gray-400">{course.rating}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                        {course.revenue > 0 ? `$${course.revenue.toLocaleString()}` : '—'}
                      </td>
                      <td className="px-6 py-4 text-gray-400">{course.lastUpdated}</td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu
                          trigger={<Button variant="ghost" size="icon-sm"><MoreHorizontal className="h-4 w-4" /></Button>}
                          align="end"
                        >
                          <DropdownMenuItem icon={<Eye className="h-4 w-4" />} onClick={() => window.location.href = `/teacher/courses/${course.id}`}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem icon={<Edit3 className="h-4 w-4" />} onClick={() => window.location.href = `/teacher/courses/${course.id}`}>
                            Edit Course
                          </DropdownMenuItem>
                          <DropdownMenuItem icon={<Copy className="h-4 w-4" />}>Duplicate</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem icon={<Archive className="h-4 w-4" />}>Archive</DropdownMenuItem>
                          <DropdownMenuItem icon={<Trash2 className="h-4 w-4" />} destructive>Delete</DropdownMenuItem>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          <div className="border-t border-gray-100 p-4 dark:border-gray-800">
            <Pagination
              currentPage={currentPage}
              totalPages={3}
              onPageChange={setCurrentPage}
            />
          </div>
        </Card>
      )}
    </motion.div>
  );
}
