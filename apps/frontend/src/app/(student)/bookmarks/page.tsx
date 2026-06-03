'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bookmark, Play, Trash2, Search, BookOpen, Clock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatDate, formatDuration } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import type { Bookmark as BookmarkType } from '@/types';

const MOCK_BOOKMARKS: (BookmarkType & { lessonTitle: string; lessonDuration: number; courseSlug: string })[] = [
  { id: 'b1', user: { id: '', firebaseUid: '', email: '', firstName: '', lastName: '', displayName: '', avatarUrl: null, role: 'STUDENT', phoneNumber: null, bio: null, isActive: true, isEmailVerified: true, lastLoginAt: null, createdAt: '', updatedAt: '' }, course: { id: 'c1', title: 'Advanced React Patterns', slug: 'advanced-react', shortDescription: '', description: '', thumbnailUrl: null, category: { id: '', name: '', slug: '', description: null, icon: null, parentId: null, children: [], courseCount: 0, sortOrder: 0, createdAt: '', updatedAt: '' }, tags: [], level: 'BEGINNER', language: '', duration: 0, totalLessons: 0, totalSections: 0, totalEnrollments: 0, averageRating: 0, totalReviews: 0, price: 0, discountedPrice: null, isFree: false, isPublished: false, isFeatured: false, status: 'PUBLISHED', teacher: { id: '', firebaseUid: '', email: '', firstName: '', lastName: '', displayName: '', avatarUrl: null, role: 'STUDENT', phoneNumber: null, bio: null, isActive: true, isEmailVerified: true, lastLoginAt: null, createdAt: '', updatedAt: '' }, sections: [], prerequisites: [], learningObjectives: [], requirements: [], targetAudience: [], certificateEnabled: false, passingGrade: 0, createdAt: '', updatedAt: '' }, lesson: null, note: null, createdAt: '2025-06-01T10:30:00Z', lessonTitle: 'Compound Component Pattern', lessonDuration: 1500, courseSlug: 'advanced-react' },
  { id: 'b2', user: { id: '', firebaseUid: '', email: '', firstName: '', lastName: '', displayName: '', avatarUrl: null, role: 'STUDENT', phoneNumber: null, bio: null, isActive: true, isEmailVerified: true, lastLoginAt: null, createdAt: '', updatedAt: '' }, course: { id: 'c2', title: 'TypeScript Mastery', slug: 'typescript-mastery', shortDescription: '', description: '', thumbnailUrl: null, category: { id: '', name: '', slug: '', description: null, icon: null, parentId: null, children: [], courseCount: 0, sortOrder: 0, createdAt: '', updatedAt: '' }, tags: [], level: 'BEGINNER', language: '', duration: 0, totalLessons: 0, totalSections: 0, totalEnrollments: 0, averageRating: 0, totalReviews: 0, price: 0, discountedPrice: null, isFree: false, isPublished: false, isFeatured: false, status: 'PUBLISHED', teacher: { id: '', firebaseUid: '', email: '', firstName: '', lastName: '', displayName: '', avatarUrl: null, role: 'STUDENT', phoneNumber: null, bio: null, isActive: true, isEmailVerified: true, lastLoginAt: null, createdAt: '', updatedAt: '' }, sections: [], prerequisites: [], learningObjectives: [], requirements: [], targetAudience: [], certificateEnabled: false, passingGrade: 0, createdAt: '', updatedAt: '' }, lesson: null, note: null, createdAt: '2025-05-28T15:00:00Z', lessonTitle: 'Generic Constraints Deep Dive', lessonDuration: 1200, courseSlug: 'typescript-mastery' },
  { id: 'b3', user: { id: '', firebaseUid: '', email: '', firstName: '', lastName: '', displayName: '', avatarUrl: null, role: 'STUDENT', phoneNumber: null, bio: null, isActive: true, isEmailVerified: true, lastLoginAt: null, createdAt: '', updatedAt: '' }, course: { id: 'c3', title: 'Node.js Backend Development', slug: 'nodejs-backend', shortDescription: '', description: '', thumbnailUrl: null, category: { id: '', name: '', slug: '', description: null, icon: null, parentId: null, children: [], courseCount: 0, sortOrder: 0, createdAt: '', updatedAt: '' }, tags: [], level: 'BEGINNER', language: '', duration: 0, totalLessons: 0, totalSections: 0, totalEnrollments: 0, averageRating: 0, totalReviews: 0, price: 0, discountedPrice: null, isFree: false, isPublished: false, isFeatured: false, status: 'PUBLISHED', teacher: { id: '', firebaseUid: '', email: '', firstName: '', lastName: '', displayName: '', avatarUrl: null, role: 'STUDENT', phoneNumber: null, bio: null, isActive: true, isEmailVerified: true, lastLoginAt: null, createdAt: '', updatedAt: '' }, sections: [], prerequisites: [], learningObjectives: [], requirements: [], targetAudience: [], certificateEnabled: false, passingGrade: 0, createdAt: '', updatedAt: '' }, lesson: null, note: 'Key middleware pattern explanation', createdAt: '2025-05-25T09:15:00Z', lessonTitle: 'Express Middleware Architecture', lessonDuration: 1800, courseSlug: 'nodejs-backend' },
  { id: 'b4', user: { id: '', firebaseUid: '', email: '', firstName: '', lastName: '', displayName: '', avatarUrl: null, role: 'STUDENT', phoneNumber: null, bio: null, isActive: true, isEmailVerified: true, lastLoginAt: null, createdAt: '', updatedAt: '' }, course: { id: 'c4', title: 'AWS Cloud Practitioner', slug: 'aws-cloud', shortDescription: '', description: '', thumbnailUrl: null, category: { id: '', name: '', slug: '', description: null, icon: null, parentId: null, children: [], courseCount: 0, sortOrder: 0, createdAt: '', updatedAt: '' }, tags: [], level: 'BEGINNER', language: '', duration: 0, totalLessons: 0, totalSections: 0, totalEnrollments: 0, averageRating: 0, totalReviews: 0, price: 0, discountedPrice: null, isFree: false, isPublished: false, isFeatured: false, status: 'PUBLISHED', teacher: { id: '', firebaseUid: '', email: '', firstName: '', lastName: '', displayName: '', avatarUrl: null, role: 'STUDENT', phoneNumber: null, bio: null, isActive: true, isEmailVerified: true, lastLoginAt: null, createdAt: '', updatedAt: '' }, sections: [], prerequisites: [], learningObjectives: [], requirements: [], targetAudience: [], certificateEnabled: false, passingGrade: 0, createdAt: '', updatedAt: '' }, lesson: null, note: null, createdAt: '2025-05-20T14:30:00Z', lessonTitle: 'EC2 Instance Types Overview', lessonDuration: 900, courseSlug: 'aws-cloud' },
];

export default function BookmarksPage() {
  const [search, setSearch] = useState('');
  const [bookmarks, setBookmarks] = useState(MOCK_BOOKMARKS);

  const filtered = search
    ? bookmarks.filter(b =>
        b.lessonTitle.toLowerCase().includes(search.toLowerCase()) ||
        b.course!.title.toLowerCase().includes(search.toLowerCase()),
      )
    : bookmarks;

  const removeBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Bookmarks</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{bookmarks.length} saved lessons</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search bookmarks..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white/50 p-12 text-center dark:border-gray-800 dark:bg-gray-950/50">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
            <Bookmark className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">No bookmarks yet</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Bookmark lessons while watching to save them for later.</p>
        </motion.div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.map((bookmark, i) => (
              <motion.div
                key={bookmark.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.04 }}
                layout
                className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-950/50 dark:text-primary-400">
                  <Bookmark className="h-5 w-5 fill-primary-500/20" />
                </div>

                <div className="flex-1 min-w-0">
                  <Link href={`/courses/${bookmark.courseSlug}/lessons/${bookmark.id}`}>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      {bookmark.lessonTitle}
                    </h3>
                  </Link>
                  <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {bookmark.course?.title}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatDuration(bookmark.lessonDuration)}</span>
                    <span>Bookmarked {formatDate(bookmark.createdAt)}</span>
                  </div>
                  {bookmark.note && (
                    <p className="mt-1 text-xs text-gray-400 italic">&ldquo;{bookmark.note}&rdquo;</p>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <Link href={`/courses/${bookmark.courseSlug}/lessons/${bookmark.id}`}>
                    <Button variant="ghost" size="icon-sm" className="text-gray-400 hover:text-primary-600">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeBookmark(bookmark.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
