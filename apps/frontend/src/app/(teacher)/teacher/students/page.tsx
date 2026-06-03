'use client';

import { useState } from 'react';
import {
  Search,
  Download,
  Users,
  GraduationCap,
  Clock,
  Star,
  ChevronDown,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Filter,
  SlidersHorizontal,
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Avatar } from '@/components/ui/avatar';
import { StatCard } from '@/components/shared/stat-card';
import { EmptyState } from '@/components/shared/empty-state';
import { Pagination } from '@/components/shared/pagination';
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  course: string;
  enrolledAt: string;
  progress: number;
  lastActive: string;
  completedLessons: number;
  totalLessons: number;
  totalTimeSpent: string;
  rating: number;
  status: 'active' | 'completed' | 'inactive';
}

const students: Student[] = [
  { id: 's1', name: 'Sarah Ahmed', email: 'sarah@email.com', avatar: null, course: 'Web Development Bootcamp', enrolledAt: 'Jan 15, 2026', progress: 72, lastActive: '2 hours ago', completedLessons: 18, totalLessons: 25, totalTimeSpent: '28h 30m', rating: 5, status: 'active' },
  { id: 's2', name: 'Rahim Khan', email: 'rahim@email.com', avatar: null, course: 'Advanced React & Next.js', enrolledAt: 'Feb 3, 2026', progress: 45, lastActive: '1 day ago', completedLessons: 9, totalLessons: 20, totalTimeSpent: '15h 20m', rating: 4, status: 'active' },
  { id: 's3', name: 'Fatima Begum', email: 'fatima@email.com', avatar: null, course: 'Python for Data Science', enrolledAt: 'Mar 10, 2026', progress: 90, lastActive: '5 hours ago', completedLessons: 18, totalLessons: 20, totalTimeSpent: '22h 45m', rating: 5, status: 'active' },
  { id: 's4', name: 'Hasan Ali', email: 'hasan@email.com', avatar: null, course: 'Web Development Bootcamp', enrolledAt: 'Jan 20, 2026', progress: 100, lastActive: '3 days ago', completedLessons: 25, totalLessons: 25, totalTimeSpent: '42h 10m', rating: 5, status: 'completed' },
  { id: 's5', name: 'Nusrat Jahan', email: 'nusrat@email.com', avatar: null, course: 'TypeScript Deep Dive', enrolledAt: 'Apr 5, 2026', progress: 28, lastActive: '2 weeks ago', completedLessons: 4, totalLessons: 14, totalTimeSpent: '6h 30m', rating: 0, status: 'inactive' },
  { id: 's6', name: 'Kabir Hossain', email: 'kabir@email.com', avatar: null, course: 'AWS Cloud Architecture', enrolledAt: 'Feb 28, 2026', progress: 60, lastActive: '6 hours ago', completedLessons: 9, totalLessons: 15, totalTimeSpent: '18h 00m', rating: 4, status: 'active' },
  { id: 's7', name: 'Tasnim Rahman', email: 'tasnim@email.com', avatar: null, course: 'Advanced React & Next.js', enrolledAt: 'Mar 15, 2026', progress: 15, lastActive: '1 week ago', completedLessons: 3, totalLessons: 20, totalTimeSpent: '4h 15m', rating: 0, status: 'inactive' },
  { id: 's8', name: 'Arif Mahmud', email: 'arif@email.com', avatar: null, course: 'Python for Data Science', enrolledAt: 'Jan 5, 2026', progress: 100, lastActive: '1 month ago', completedLessons: 20, totalLessons: 20, totalTimeSpent: '35h 00m', rating: 5, status: 'completed' },
  { id: 's9', name: 'Jannatul Ferdous', email: 'jannatul@email.com', avatar: null, course: 'Web Development Bootcamp', enrolledAt: 'May 1, 2026', progress: 8, lastActive: 'Just now', completedLessons: 2, totalLessons: 25, totalTimeSpent: '2h 10m', rating: 0, status: 'active' },
  { id: 's10', name: 'Mizanur Rahman', email: 'mizanur@email.com', avatar: null, course: 'TypeScript Deep Dive', enrolledAt: 'Apr 20, 2026', progress: 50, lastActive: '3 hours ago', completedLessons: 7, totalLessons: 14, totalTimeSpent: '10h 45m', rating: 4, status: 'active' },
];

const courseFilterOptions = [
  { value: 'all', label: 'All Courses' },
  { value: 'web-dev', label: 'Web Development Bootcamp' },
  { value: 'react', label: 'Advanced React & Next.js' },
  { value: 'python', label: 'Python for Data Science' },
  { value: 'typescript', label: 'TypeScript Deep Dive' },
  { value: 'aws', label: 'AWS Cloud Architecture' },
];

const statusFilterOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'inactive', label: 'Inactive' },
];

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.03 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [progressView, setProgressView] = useState<'list' | 'grid'>('list');

  const filtered = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = students.filter((s) => s.status === 'active').length;
  const completedCount = students.filter((s) => s.status === 'completed').length;
  const avgProgress = Math.round(students.reduce((acc, s) => acc + s.progress, 0) / students.length);

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Students</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            View and manage enrolled students across your courses
          </p>
        </div>
        <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />}>
          Export Data
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total Students" value={students.length} variant="primary" />
        <StatCard icon={GraduationCap} label="Active Learners" value={activeCount} variant="secondary" />
        <StatCard icon={CheckCircle2} label="Completed" value={completedCount} variant="success" />
        <StatCard icon={TrendingUp} label="Avg Progress" value={`${avgProgress}%`} variant="warning" />
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants}>
        <Card glass>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search students by name or email..."
                  className="h-10 w-full rounded-xl border border-gray-200 bg-white/80 pl-9 pr-3 text-sm placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700 dark:bg-gray-950/80 dark:text-gray-100"
                />
              </div>
              <div className="w-44">
                <Select
                  value={courseFilter}
                  onValueChange={setCourseFilter}
                  options={courseFilterOptions}
                  placeholder="All Courses"
                />
              </div>
              <div className="w-36">
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                  options={statusFilterOptions}
                  placeholder="All Status"
                />
              </div>
              <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-0.5 dark:border-gray-700 dark:bg-gray-950">
                <button
                  onClick={() => setProgressView('grid')}
                  className={cn('rounded-md p-1.5 transition-colors', progressView === 'grid' ? 'bg-purple-100 text-purple-700' : 'text-gray-400')}
                >
                  <Users className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setProgressView('list')}
                  className={cn('rounded-md p-1.5 transition-colors', progressView === 'list' ? 'bg-purple-100 text-purple-700' : 'text-gray-400')}
                >
                  <GraduationCap className="h-4 w-4" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Student List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No students found"
          description={searchQuery ? 'Try adjusting your search' : 'No students are enrolled yet'}
        />
      ) : progressView === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filtered.map((student, idx) => (
              <motion.div
                key={student.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: idx * 0.03 }}
              >
                <Card
                  glass
                  hover
                  className={cn(
                    'cursor-pointer',
                    selectedStudent?.id === student.id && 'ring-2 ring-purple-500',
                  )}
                  onClick={() => setSelectedStudent(student)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar
                        alt={student.name}
                        fallback={getInitials(student.name)}
                        size="md"
                        fallbackClassName="bg-gradient-to-br from-purple-500 to-indigo-500 text-white"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{student.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{student.email}</p>
                      </div>
                      <Badge
                        variant={student.status === 'active' ? 'success' : student.status === 'completed' ? 'info' : 'default'}
                        size="sm"
                      >
                        {student.status}
                      </Badge>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{student.progress}%</span>
                      </div>
                      <Progress value={student.progress} size="sm" />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                      <span>{student.course}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{student.lastActive}</span>
                    </div>
                  </CardContent>
                </Card>
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
                  <th className="px-6 py-4 text-left font-medium text-gray-500 dark:text-gray-400">Student</th>
                  <th className="px-6 py-4 text-left font-medium text-gray-500 dark:text-gray-400">Course</th>
                  <th className="px-6 py-4 text-left font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="px-6 py-4 text-left font-medium text-gray-500 dark:text-gray-400">Progress</th>
                  <th className="px-6 py-4 text-left font-medium text-gray-500 dark:text-gray-400">Last Active</th>
                  <th className="px-6 py-4 text-left font-medium text-gray-500 dark:text-gray-400">Rating</th>
                  <th className="px-6 py-4 text-right font-medium text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((student, idx) => (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ delay: idx * 0.02 }}
                      className={cn(
                        'border-b border-gray-50 transition-colors hover:bg-purple-50/30 dark:border-gray-800/50 dark:hover:bg-purple-950/20',
                        selectedStudent?.id === student.id && 'bg-purple-50 dark:bg-purple-950/20',
                      )}
                      onClick={() => setSelectedStudent(student)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar
                            alt={student.name}
                            fallback={getInitials(student.name)}
                            size="sm"
                            fallbackClassName="bg-gradient-to-br from-purple-500 to-indigo-500 text-white"
                          />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">{student.name}</p>
                            <p className="text-xs text-gray-400">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400 max-w-[200px] truncate">{student.course}</td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={student.status === 'active' ? 'success' : student.status === 'completed' ? 'info' : 'default'}
                          size="sm"
                        >
                          {student.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Progress value={student.progress} size="sm" className="w-20" />
                          <span className="text-xs text-gray-500">{student.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400">{student.lastActive}</td>
                      <td className="px-6 py-4">
                        {student.rating > 0 ? (
                          <div className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-gray-600 dark:text-gray-400">{student.rating}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu
                          trigger={
                            <Button variant="ghost" size="icon-sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          }
                          align="end"
                        >
                          <DropdownMenuItem icon={<Mail className="h-4 w-4" />}>Send Email</DropdownMenuItem>
                          <DropdownMenuItem icon={<MessageSquare className="h-4 w-4" />}>Send Message</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem icon={<GraduationCap className="h-4 w-4" />}>View Progress</DropdownMenuItem>
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

      {/* Selected Student Detail */}
      <AnimatePresence>
        {selectedStudent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <Card glass>
              <CardHeader divider>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar
                      alt={selectedStudent.name}
                      fallback={getInitials(selectedStudent.name)}
                      size="lg"
                      fallbackClassName="bg-gradient-to-br from-purple-500 to-indigo-500 text-white"
                    />
                    <div>
                      <CardTitle>{selectedStudent.name}</CardTitle>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{selectedStudent.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="glass-primary" size="sm" leftIcon={<Mail className="h-4 w-4" />}>
                      Send Email
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setSelectedStudent(null)}>
                      Close
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Enrolled Course</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{selectedStudent.course}</p>
                  </div>
                  <div className="rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Enrolled Date</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{selectedStudent.enrolledAt}</p>
                  </div>
                  <div className="rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Lessons Completed</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {selectedStudent.completedLessons}/{selectedStudent.totalLessons}
                    </p>
                  </div>
                  <div className="rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total Time Spent</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{selectedStudent.totalTimeSpent}</p>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Course Progress</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{selectedStudent.progress}%</span>
                  </div>
                  <Progress value={selectedStudent.progress} size="lg" showLabel />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
