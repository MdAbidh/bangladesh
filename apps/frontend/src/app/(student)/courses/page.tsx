'use client';

import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown, Star, Clock, Users, BookOpen, Filter } from 'lucide-react';
import { CourseCard } from '@/components/shared/course-card';
import { SearchBar } from '@/components/shared/search-bar';
import { Pagination } from '@/components/shared/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Skeleton, SkeletonCard } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import type { Course } from '@/types';

const MOCK_COURSES: Course[] = Array.from({ length: 24 }).map((_, i) => ({
  id: String(i + 1),
  title: ['Advanced React Patterns', 'TypeScript Mastery', 'Node.js Backend Development', 'Python for Data Science', 'UI/UX Design Fundamentals', 'AWS Cloud Practitioner', 'GraphQL API Design', 'Docker & Kubernetes', 'Machine Learning Basics', 'Flutter Mobile Development', 'Go Programming', 'Rust Systems Programming'][i % 12],
  slug: `course-${i + 1}`,
  shortDescription: 'A comprehensive course covering all essential topics and advanced concepts.',
  description: '',
  thumbnailUrl: null,
  category: { id: `cat${i % 6}`, name: ['Frontend', 'Backend', 'Data Science', 'DevOps', 'Mobile', 'Cloud'][i % 6], slug: '', description: null, icon: null, parentId: null, children: [], courseCount: 0, sortOrder: 0, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  tags: [],
  level: (['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS'] as const)[i % 4],
  language: i % 3 === 0 ? 'Spanish' : 'English',
  duration: 5 + (i * 2) % 30,
  totalLessons: 10 + (i * 3) % 60,
  totalSections: 3 + (i % 6),
  totalEnrollments: 100 + (i * 200) % 5000,
  averageRating: parseFloat((3.5 + (i % 5) * 0.3).toFixed(1)),
  totalReviews: 10 + (i * 25) % 500,
  price: [0, 49.99, 79.99, 129.99][i % 4],
  discountedPrice: i % 4 === 1 ? 29.99 : i % 3 === 0 ? 59.99 : null,
  isFree: i % 4 === 0,
  isPublished: true,
  isFeatured: i < 4,
  status: 'PUBLISHED',
  teacher: { id: `t${i}`, firebaseUid: '', email: `teacher${i}@example.com`, firstName: 'John', lastName: 'Doe', displayName: 'John Doe', avatarUrl: null, role: 'TEACHER', phoneNumber: null, bio: null, isActive: true, isEmailVerified: true, lastLoginAt: null, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  sections: [], prerequisites: [], learningObjectives: [], requirements: [], targetAudience: [], certificateEnabled: true, passingGrade: 80, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
}));

const CATEGORIES = ['Frontend', 'Backend', 'Data Science', 'DevOps', 'Mobile', 'Cloud', 'Design', 'AI/ML'];
const LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS'];
const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
];
const LANGUAGES = ['English', 'Spanish', 'French', 'German'];

interface Filters {
  search: string;
  categories: string[];
  levels: string[];
  price: string;
  rating: string;
  language: string;
  duration: string;
  sort: string;
}

export default function CoursesPage() {
  const [filters, setFilters] = useState<Filters>({
    search: '', categories: [], levels: [], price: '', rating: '', language: '', duration: '', sort: 'popular',
  });
  const [page, setPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isLoading] = useState(false);
  const perPage = 9;

  const activeFilterCount = Object.entries(filters).filter(([k, v]) =>
    k !== 'sort' && k !== 'search' && (Array.isArray(v) ? v.length > 0 : v !== ''),
  ).length;

  const filtered = useMemo(() => {
    let result = [...MOCK_COURSES];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(c => c.title.toLowerCase().includes(q) || c.shortDescription.toLowerCase().includes(q));
    }
    if (filters.categories.length) result = result.filter(c => filters.categories.includes(c.category.name));
    if (filters.levels.length) result = result.filter(c => filters.levels.includes(c.level));
    if (filters.price === 'free') result = result.filter(c => c.isFree);
    if (filters.price === 'paid') result = result.filter(c => !c.isFree);
    if (filters.language) result = result.filter(c => c.language === filters.language);
    if (filters.rating === '4.5') result = result.filter(c => c.averageRating >= 4.5);
    if (filters.rating === '4.0') result = result.filter(c => c.averageRating >= 4.0);
    if (filters.rating === '3.5') result = result.filter(c => c.averageRating >= 3.5);
    if (filters.duration === 'short') result = result.filter(c => c.duration <= 3);
    if (filters.duration === 'medium') result = result.filter(c => c.duration > 3 && c.duration <= 10);
    if (filters.duration === 'long') result = result.filter(c => c.duration > 10);
    switch (filters.sort) {
      case 'popular': result.sort((a, b) => b.totalEnrollments - a.totalEnrollments); break;
      case 'newest': break;
      case 'rating': result.sort((a, b) => b.averageRating - a.averageRating); break;
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
    }
    return result;
  }, [filters]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleFilter = (key: 'categories' | 'levels', value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter(v => v !== value) : [...prev[key], value],
    }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ search: '', categories: [], levels: [], price: '', rating: '', language: '', duration: '', sort: 'popular' });
    setPage(1);
  };

  const activeTags: { label: string; onRemove: () => void }[] = [];
  filters.categories.forEach(c => activeTags.push({ label: c, onRemove: () => toggleFilter('categories', c) }));
  filters.levels.forEach(l => activeTags.push({ label: l, onRemove: () => toggleFilter('levels', l) }));
  if (filters.price) activeTags.push({ label: filters.price === 'free' ? 'Free' : 'Paid', onRemove: () => setFilters(p => ({ ...p, price: '' })) });
  if (filters.language) activeTags.push({ label: filters.language, onRemove: () => setFilters(p => ({ ...p, language: '' })) });
  if (filters.rating) activeTags.push({ label: `${filters.rating}+ stars`, onRemove: () => setFilters(p => ({ ...p, rating: '' })) });

  return (
    <div className="space-y-6">
      {/* Hero Search */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-400 p-6 sm:p-8">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Explore Courses</h1>
          <p className="mt-2 text-sm text-white/70 max-w-lg">Discover thousands of courses taught by expert instructors. Learn at your own pace.</p>
          <div className="mt-4 max-w-xl">
            <SearchBar
              placeholder="Search courses, topics, or instructors..."
              onSearch={(q) => { setFilters(p => ({ ...p, search: q })); setPage(1); }}
            />
          </div>
        </div>
      </div>

      {/* Mobile Filter Toggle */}
      <div className="flex items-center justify-between lg:hidden">
        <Button variant="outline" size="sm" onClick={() => setShowMobileFilters(!showMobileFilters)} leftIcon={<Filter className="h-4 w-4" />}>
          Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </Button>
        <Select
          value={filters.sort}
          onValueChange={(v) => setFilters(p => ({ ...p, sort: v }))}
          options={SORT_OPTIONS}
          triggerClassName="w-40"
        />
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filters */}
        <aside className={cn(
          'w-56 flex-shrink-0 space-y-5',
          'lg:block',
          showMobileFilters ? 'fixed inset-0 z-50 overflow-y-auto bg-white p-6 dark:bg-gray-950 lg:static lg:inset-auto lg:z-auto lg:overflow-visible lg:bg-transparent lg:p-0' : 'hidden',
        )}>
          <div className="flex items-center justify-between lg:hidden">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Filters</h3>
            <button onClick={() => setShowMobileFilters(false)} className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-800">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Categories */}
          <div>
            <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">Categories</h4>
            <div className="space-y-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => toggleFilter('categories', cat)}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors',
                    filters.categories.includes(cat) ? 'bg-primary-50 text-primary-700 font-medium dark:bg-primary-950/50 dark:text-primary-300' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/50',
                  )}
                >
                  <div className={cn('h-1.5 w-1.5 rounded-full', filters.categories.includes(cat) ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600')} />
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Level */}
          <div>
            <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">Level</h4>
            <div className="space-y-1">
              {LEVELS.map(level => (
                <button
                  key={level}
                  onClick={() => toggleFilter('levels', level)}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-sm capitalize transition-colors',
                    filters.levels.includes(level) ? 'bg-primary-50 text-primary-700 font-medium dark:bg-primary-950/50 dark:text-primary-300' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/50',
                  )}
                >
                  <div className={cn('h-1.5 w-1.5 rounded-full', filters.levels.includes(level) ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600')} />
                  {level.toLowerCase().replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">Price</h4>
            <div className="space-y-1">
              {[{ value: 'free', label: 'Free' }, { value: 'paid', label: 'Paid' }].map(p => (
                <button
                  key={p.value}
                  onClick={() => setFilters(prev => ({ ...prev, price: prev.price === p.value ? '' : p.value }))}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors',
                    filters.price === p.value ? 'bg-primary-50 text-primary-700 font-medium dark:bg-primary-950/50 dark:text-primary-300' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/50',
                  )}
                >
                  <div className={cn('h-1.5 w-1.5 rounded-full', filters.price === p.value ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600')} />
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">Rating</h4>
            <div className="space-y-1">
              {[{ value: '4.5', label: '4.5 & up' }, { value: '4.0', label: '4.0 & up' }, { value: '3.5', label: '3.5 & up' }].map(r => (
                <button
                  key={r.value}
                  onClick={() => setFilters(prev => ({ ...prev, rating: prev.rating === r.value ? '' : r.value }))}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors',
                    filters.rating === r.value ? 'bg-primary-50 text-primary-700 font-medium dark:bg-primary-950/50 dark:text-primary-300' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/50',
                  )}
                >
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div>
            <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">Language</h4>
            <Select
              value={filters.language}
              onValueChange={(v) => setFilters(p => ({ ...p, language: v }))}
              placeholder="All Languages"
              options={LANGUAGES.map(l => ({ value: l, label: l }))}
              clearable
            />
          </div>

          {/* Duration */}
          <div>
            <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">Duration</h4>
            <div className="space-y-1">
              {[{ value: 'short', label: 'Short (< 3h)' }, { value: 'medium', label: 'Medium (3-10h)' }, { value: 'long', label: 'Long (> 10h)' }].map(d => (
                <button
                  key={d.value}
                  onClick={() => setFilters(prev => ({ ...prev, duration: prev.duration === d.value ? '' : d.value }))}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors',
                    filters.duration === d.value ? 'bg-primary-50 text-primary-700 font-medium dark:bg-primary-950/50 dark:text-primary-300' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/50',
                  )}
                >
                  <Clock className="h-3.5 w-3.5" />
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clear */}
          <Button variant="ghost" size="sm" fullWidth onClick={clearFilters} disabled={activeFilterCount === 0}>
            Clear All Filters
          </Button>
        </aside>

        {/* Course Grid */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Top Bar */}
          <div className="hidden items-center justify-between lg:flex">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing <span className="font-medium text-gray-900 dark:text-gray-100">{paginated.length}</span> of{' '}
              <span className="font-medium text-gray-900 dark:text-gray-100">{filtered.length}</span> courses
            </p>
            <Select
              value={filters.sort}
              onValueChange={(v) => setFilters(p => ({ ...p, sort: v }))}
              options={SORT_OPTIONS}
              triggerClassName="w-44"
            />
          </div>

          {/* Active Tags */}
          <AnimatePresence>
            {activeTags.length > 0 && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-wrap gap-2">
                {activeTags.map((tag, i) => (
                  <Badge key={i} variant="secondary" size="md" className="cursor-pointer gap-1 pr-1" onClick={tag.onRemove}>
                    {tag.label}
                    <X className="h-3 w-3 ml-0.5" />
                  </Badge>
                ))}
                <button onClick={clearFilters} className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Clear all</button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Grid */}
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : paginated.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white/50 p-12 text-center dark:border-gray-800 dark:bg-gray-950/50">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">No courses found</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria.</p>
              <Button variant="primary" size="sm" className="mt-4" onClick={clearFilters}>Clear Filters</Button>
            </motion.div>
          ) : (
            <motion.div initial="initial" animate="animate" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {paginated.map((course, i) => (
                <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.04 }}>
                  <CourseCard course={course} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Pagination */}
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}
