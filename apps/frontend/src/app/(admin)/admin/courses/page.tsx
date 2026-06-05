'use client';

import { useState } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Star,
  Archive,
  Eye,
  Ban,
  Download,
  AlertTriangle,
  Clock,
  ChevronRight,
  GraduationCap,
  Users,
  DollarSign,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Avatar } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Pagination } from '@/components/shared/pagination';
import { EmptyState } from '@/components/shared/empty-state';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'ARCHIVED', label: 'Archived' },
  { value: 'REJECTED', label: 'Rejected' },
];

const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'web', label: 'Web Development' },
  { value: 'data', label: 'Data Science' },
  { value: 'mobile', label: 'Mobile Apps' },
  { value: 'design', label: 'Design' },
  { value: 'business', label: 'Business' },
];

const mockCourses = Array.from({ length: 40 }, (_, i) => ({
  id: `course_${i + 1}`,
  title: ['Complete Web Development Bootcamp', 'Advanced React & Next.js', 'Python for Data Science', 'UI/UX Design Masterclass', 'TypeScript Deep Dive', 'Machine Learning Fundamentals', 'iOS App Development', 'Digital Marketing 101'][i % 8],
  instructor: ['John Doe', 'Jane Smith', 'Dr. Rahman', 'Sarah Khan', 'Mike Chen', 'Prof. Lisa Wang', 'Ahmed Hassan', 'Maria Garcia'][i % 8],
  category: (['web', 'data', 'data', 'design', 'web', 'data', 'mobile', 'business'] as const)[i % 8],
  status: (['PUBLISHED', 'PENDING', 'PUBLISHED', 'PENDING', 'PUBLISHED', 'DRAFT', 'PUBLISHED', 'ARCHIVED'] as const)[i % 8],
  students: (i * 37) % 1500,
  revenue: (i * 1234) % 100000,
  rating: Number((3.5 + (i % 5) * 0.3).toFixed(1)),
  price: 9.99 + (i % 200),
  lessons: 10 + (i * 3) % 60,
  duration: 5 + (i * 2) % 40,
  featured: i % 5 === 0,
  createdAt: `2024-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
  thumbnail: null,
}));

const statusBadgeVariant = (status: string) => {
  switch (status) {
    case 'PUBLISHED': return 'success';
    case 'PENDING': return 'warning';
    case 'DRAFT': return 'default';
    case 'ARCHIVED': return 'secondary';
    case 'REJECTED': return 'danger';
    default: return 'default';
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export default function AdminCourses() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState('all');

  const pageSize = 8;
  const filtered = mockCourses
    .filter((c) => activeTab === 'all' || c.status === activeTab.toUpperCase())
    .filter((c) => statusFilter === 'all' || c.status === statusFilter)
    .filter((c) => categoryFilter === 'all' || c.category === categoryFilter)
    .filter((c) => !searchQuery || c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.instructor.toLowerCase().includes(searchQuery.toLowerCase()));
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSelect = (id: string) => {
    const next = new Set(selectedCourses);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedCourses(next);
  };

  const pendingCount = mockCourses.filter((c) => c.status === 'PENDING').length;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 p-6">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Course Moderation</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Review, approve, and manage all courses</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />}>
            Export
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-4 gap-4">
        <Card glass className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">486</p>
            </div>
            <BookOpen className="h-8 w-8 text-primary-500" />
          </div>
        </Card>
        <Card glass className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Published</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">342</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          </div>
        </Card>
        <Card glass className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending Review</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{pendingCount}</p>
            </div>
            <Clock className="h-8 w-8 text-amber-500" />
          </div>
        </Card>
        <Card glass className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Archived</p>
              <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">24</p>
            </div>
            <Archive className="h-8 w-8 text-gray-500" />
          </div>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setCurrentPage(1); }}>
          <div className="flex items-center justify-between">
            <TabsList variant="pills">
              <TabsTrigger value="all">All Courses</TabsTrigger>
              <TabsTrigger value="pending" className="relative">
                Pending
                {pendingCount > 0 && (
                  <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {pendingCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>
            {selectedCourses.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">{selectedCourses.size} selected</span>
                <Button variant="success" size="sm">Approve</Button>
                <Button variant="danger" size="sm">Reject</Button>
                <Button variant="outline" size="sm">Archive</Button>
              </div>
            )}
          </div>

          <TabsContent value={activeTab} className="mt-0">
            {/* Filters */}
            <div className="mb-4 flex items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  placeholder="Search courses or instructors..."
                  className="h-10 w-full rounded-xl border border-gray-200 bg-white/80 pl-9 pr-3 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-950/80 dark:text-gray-100"
                />
              </div>
              <Select options={statusOptions} value={statusFilter} onValueChange={setStatusFilter} triggerClassName="w-36" />
              <Select options={categoryOptions} value={categoryFilter} onValueChange={setCategoryFilter} triggerClassName="w-40" />
            </div>

            {/* Courses Table */}
            <Card glass>
              <CardContent className="p-0">
                {paginated.length === 0 ? (
                  <EmptyState icon={BookOpen} title="No courses found" description="Try adjusting your search or filters" />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-800">
                          <th className="w-10 px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedCourses.size === paginated.length && paginated.length > 0}
                              onChange={() => {
                                if (selectedCourses.size === paginated.length) setSelectedCourses(new Set());
                                else setSelectedCourses(new Set(paginated.map((c) => c.id)));
                              }}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600"
                            />
                          </th>
                          <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Course</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Instructor</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Status</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Students</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Revenue</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Rating</th>
                          <th className="w-20 px-4 py-3" />
                        </tr>
                      </thead>
                      <tbody>
                        {paginated.map((course, idx) => (
                          <motion.tr
                            key={course.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: idx * 0.03 }}
                            className={cn(
                              'border-b border-gray-50 transition-colors dark:border-gray-800/50',
                              'hover:bg-gray-50/50 dark:hover:bg-gray-800/30',
                              course.status === 'PENDING' && 'bg-amber-50/30 dark:bg-amber-950/10',
                              expandedCourse === course.id && 'bg-gray-50 dark:bg-gray-800/20',
                            )}
                          >
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={selectedCourses.has(course.id)}
                                onChange={() => toggleSelect(course.id)}
                                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600"
                              />
                            </td>
                            <td className="px-4 py-3 max-w-xs">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-100 to-primary-50 text-primary-600 dark:from-primary-950 dark:to-gray-900 dark:text-primary-400">
                                  <BookOpen className="h-5 w-5" />
                                </div>
                                <div>
                                  <button
                                    onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
                                    className="font-medium text-gray-900 hover:text-primary-600 dark:text-gray-100 dark:hover:text-primary-400 text-left"
                                  >
                                    {course.title.length > 40 ? course.title.slice(0, 40) + '...' : course.title}
                                  </button>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{course.category} &middot; ${course.price}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <Avatar alt={course.instructor} size="xs" />
                                <span className="text-gray-600 dark:text-gray-400">{course.instructor}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1.5">
                                {course.status === 'PENDING' && <AlertTriangle className="h-3 w-3 text-amber-500" />}
                                <Badge variant={statusBadgeVariant(course.status)} size="sm">{course.status}</Badge>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{course.students.toLocaleString()}</td>
                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">${course.revenue.toLocaleString()}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1">
                                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                <span className="text-gray-600 dark:text-gray-400">{course.rating}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <DropdownMenu
                                trigger={<Button variant="ghost" size="icon-sm"><MoreHorizontal className="h-4 w-4" /></Button>}
                                align="end"
                              >
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem icon={<Eye className="h-4 w-4" />} onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}>
                                  Preview
                                </DropdownMenuItem>
                                {course.status === 'PENDING' && (
                                  <>
                                    <DropdownMenuItem icon={<CheckCircle2 className="h-4 w-4" />}>Approve</DropdownMenuItem>
                                    <DropdownMenuItem icon={<XCircle className="h-4 w-4" />} destructive>Reject</DropdownMenuItem>
                                  </>
                                )}
                                {!course.featured && (
                                  <DropdownMenuItem icon={<Star className="h-4 w-4" />}>Feature Course</DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                {course.status !== 'ARCHIVED' && (
                                  <DropdownMenuItem icon={<Archive className="h-4 w-4" />}>Archive</DropdownMenuItem>
                                )}
                              </DropdownMenu>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} className="mt-4" />
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Course Detail Preview */}
      <AnimatePresence>
        {expandedCourse && (() => {
          const course = mockCourses.find((c) => c.id === expandedCourse);
          if (!course) return null;
          return (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <Card glass>
                <CardHeader divider>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle>{course.title}</CardTitle>
                        <Badge variant={statusBadgeVariant(course.status)}>{course.status}</Badge>
                        {course.featured && <Badge variant="warning">Featured</Badge>}
                      </div>
                      <CardDescription>Created {course.createdAt} &middot; {course.lessons} lessons &middot; {course.duration}h total</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="success" size="sm" leftIcon={<CheckCircle2 className="h-4 w-4" />}>Approve</Button>
                      <Button variant="danger" size="sm" leftIcon={<XCircle className="h-4 w-4" />}>Reject</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
                        <Users className="h-4 w-4" />
                        Students
                      </div>
                      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{course.students.toLocaleString()}</p>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
                        <DollarSign className="h-4 w-4" />
                        Revenue
                      </div>
                      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">${course.revenue.toLocaleString()}</p>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
                        <Star className="h-4 w-4" />
                        Rating
                      </div>
                      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{course.rating} / 5.0</p>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
                        <BarChart3 className="h-4 w-4" />
                        Completion Rate
                      </div>
                      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{50 + (parseInt(course.id.replace('course_', '')) * 7) % 40}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </motion.div>
  );
}
