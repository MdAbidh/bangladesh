'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  CheckCircle, Play, FileText, HelpCircle, ClipboardList, FileType, ChevronLeft, ChevronRight,
  Bookmark, Download, MessageCircle, Send, ThumbsUp, Clock, ArrowLeft,
} from 'lucide-react';
import { VideoPlayer } from '@/components/shared/video-player';
import { LessonItem } from '@/components/shared/lesson-item';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { formatDuration, formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';
import type { Lesson, Section } from '@/types';

interface MockLesson extends Lesson {
  sectionTitle: string;
}

const MOCK_SECTIONS: (Section & { lessons: MockLesson[] })[] = [
  {
    id: 's1', title: 'Getting Started with React Patterns', description: null, sortOrder: 1,
    lessons: [
      { id: 'l1', sectionTitle: 'Getting Started with React Patterns', title: 'Introduction to Design Patterns', description: 'Overview of design patterns in React and why they matter.', lessonType: 'VIDEO', duration: 900, sortOrder: 1, video: { id: 'v1', title: '', description: null, status: 'READY', firebaseUrl: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', hlsUrl: null, thumbnailUrl: null, duration: 900, fileSize: null, mimeType: null, createdAt: '', updatedAt: '' }, content: null, resources: [{ id: 'r1', title: 'Course Slides.pdf', type: 'PDF', url: '#', fileSize: 2450000, createdAt: '' }, { id: 'r2', title: 'Code Examples.zip', type: 'CODE', url: '#', fileSize: 1200000, createdAt: '' }], isFree: true, isPublished: true, createdAt: '', updatedAt: '' },
      { id: 'l2', sectionTitle: 'Getting Started with React Patterns', title: 'Setting Up Your Development Environment', description: 'Configure your dev environment for React development.', lessonType: 'ARTICLE', duration: 600, sortOrder: 2, video: null, content: 'Full article content here...', resources: [], isFree: true, isPublished: true, createdAt: '', updatedAt: '' },
      { id: 'l3', sectionTitle: 'Getting Started with React Patterns', title: 'Understanding Component Architecture', description: 'Learn about React component architecture patterns.', lessonType: 'VIDEO', duration: 1200, sortOrder: 3, video: null, content: null, resources: [], isFree: false, isPublished: true, createdAt: '', updatedAt: '' },
    ], createdAt: '', updatedAt: '',
  },
  {
    id: 's2', title: 'Compound Components', description: null, sortOrder: 2,
    lessons: [
      { id: 'l4', sectionTitle: 'Compound Components', title: 'The Compound Component Pattern', description: 'Deep dive into the compound component pattern.', lessonType: 'VIDEO', duration: 1500, sortOrder: 1, video: null, content: null, resources: [], isFree: false, isPublished: true, createdAt: '', updatedAt: '' },
      { id: 'l5', sectionTitle: 'Compound Components', title: 'Building a Flexible Tabs Component', description: 'Build a production-ready tabs component.', lessonType: 'VIDEO', duration: 1800, sortOrder: 2, video: null, content: null, resources: [], isFree: false, isPublished: true, createdAt: '', updatedAt: '' },
    ], createdAt: '', updatedAt: '',
  },
];

const MOCK_DISCUSSION = [
  { id: 'd1', user: 'Alex M.', avatar: null, content: 'Great explanation! The compound component pattern finally makes sense.', time: '2 hours ago', likes: 12 },
  { id: 'd2', user: 'Sarah Chen', avatar: null, content: 'Try using TypeScript generics with compound components for even better type safety!', time: '1 hour ago', likes: 8 },
  { id: 'd3', user: 'Jamie L.', avatar: null, content: 'Is there a performance concern with this pattern?', time: '30 min ago', likes: 3 },
];

export default function LessonPlayerPage() {
  const params = useParams();
  const lessonId = params.lessonId as string;
  const courseId = params.courseId as string;

  const currentLesson = MOCK_SECTIONS.flatMap(s => s.lessons).find(l => l.id === lessonId) || MOCK_SECTIONS[0].lessons[0];
  const allLessons = MOCK_SECTIONS.flatMap(s => s.lessons);
  const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const [isCompleted, setIsCompleted] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [commentText, setCommentText] = useState('');

  const completedLessonIds = ['l1', 'l2'];
  const totalLessons = allLessons.length;
  const completedCount = completedLessonIds.length + (isCompleted ? 1 : 0);

  const handleBookmark = (timestamp: number) => {
    setIsBookmarked(!isBookmarked);
  };

  const handleComplete = () => {
    setIsCompleted(true);
  };

  return (
    <div className="flex flex-col gap-0 lg:flex-row">
      {/* Video + Content Area */}
      <div className="min-w-0 flex-1">
        {/* Video Player */}
        <div className="sticky top-16 z-20 bg-black">
          <VideoPlayer
            url={currentLesson.video?.firebaseUrl || 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4'}
            title={currentLesson.title}
            onBookmark={handleBookmark}
            onComplete={handleComplete}
          />
        </div>

        {/* Mobile Lesson Nav Toggle */}
        <div className="flex items-center gap-2 border-b border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-950 lg:hidden">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {showSidebar ? 'Hide Lessons' : 'Show Lessons'}
          </button>
          <div className="ml-auto flex items-center gap-2 text-xs text-gray-500">
            {currentLesson.sortOrder}/{totalLessons}
          </div>
        </div>

        {/* Lesson Content */}
        <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6">
          {/* Header */}
          <div>
            <p className="text-sm font-medium text-primary-600 dark:text-primary-400">
              {currentLesson.sectionTitle}
            </p>
            <h1 className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">{currentLesson.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {formatDuration(currentLesson.duration)}</span>
              <Badge variant="default" size="sm">{currentLesson.lessonType}</Badge>
              {currentLesson.isFree && <Badge variant="success" size="sm">Free</Badge>}
            </div>
          </div>

          {/* Description */}
          {currentLesson.description && (
            <p className="text-sm text-gray-600 leading-relaxed dark:text-gray-400">{currentLesson.description}</p>
          )}

          {/* Progress */}
          <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">Course Progress</span>
              <span className="text-gray-500">{completedCount}/{totalLessons} lessons</span>
            </div>
            <Progress value={(completedCount / totalLessons) * 100} size="sm" className="mt-2" />
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant={isCompleted ? 'success' : 'primary'}
              size="md"
              onClick={handleComplete}
              leftIcon={isCompleted ? <CheckCircle className="h-4 w-4" /> : undefined}
              disabled={isCompleted}
            >
              {isCompleted ? 'Completed' : 'Mark as Complete'}
            </Button>

            <Button
              variant={isBookmarked ? 'primary' : 'outline'}
              size="md"
              onClick={() => setIsBookmarked(!isBookmarked)}
              leftIcon={<Bookmark className={cn('h-4 w-4', isBookmarked && 'fill-current')} />}
            >
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </Button>

            <div className="ml-auto flex items-center gap-2">
              {prevLesson && (
                <Link href={`/courses/${courseId}/lessons/${prevLesson.id}`}>
                  <Button variant="outline" size="sm" leftIcon={<ChevronLeft className="h-4 w-4" />}>
                    Previous
                  </Button>
                </Link>
              )}
              {nextLesson && (
                <Link href={`/courses/${courseId}/lessons/${nextLesson.id}`}>
                  <Button variant="primary" size="sm" rightIcon={<ChevronRight className="h-4 w-4" />}>
                    Next
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Resources */}
          {currentLesson.resources.length > 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
              <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-gray-100">
                <Download className="h-4 w-4 text-primary-500" />
                Resources & Downloads
              </h2>
              <div className="mt-3 space-y-2">
                {currentLesson.resources.map((resource) => (
                  <a
                    key={resource.id}
                    href={resource.url}
                    className="flex items-center gap-3 rounded-xl border border-gray-100 p-3 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-950/50 dark:text-primary-400">
                      <FileType className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{resource.title}</p>
                      <p className="text-xs text-gray-500">{(resource.fileSize / 1024).toFixed(0)} KB</p>
                    </div>
                    <Download className="h-4 w-4 text-gray-400" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Discussion */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-gray-100">
              <MessageCircle className="h-4 w-4 text-primary-500" />
              Discussion ({MOCK_DISCUSSION.length})
            </h2>

            {/* Comment Input */}
            <div className="mt-4 flex items-start gap-3">
              <Avatar src={null} alt="You" size="sm" fallback="YO" />
              <div className="flex-1 space-y-2">
                <Input
                  placeholder="Share your thoughts or ask a question..."
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button variant="primary" size="sm" disabled={!commentText.trim()} leftIcon={<Send className="h-4 w-4" />}>
                    Post Comment
                  </Button>
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="mt-6 space-y-4">
              {MOCK_DISCUSSION.map((comment, i) => (
                <motion.div key={comment.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="flex gap-3">
                  <Avatar src={null} alt={comment.user} size="sm" fallback={comment.user.split(' ').map(n => n[0]).join('')} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{comment.user}</span>
                      <span className="text-xs text-gray-500">{comment.time}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{comment.content}</p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                      <button className="flex items-center gap-1 hover:text-primary-600"><ThumbsUp className="h-3.5 w-3.5" /> {comment.likes}</button>
                      <button className="hover:text-primary-600">Reply</button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-800">
            <div>
              {prevLesson && (
                <Link href={`/courses/${courseId}/lessons/${prevLesson.id}`}>
                  <Button variant="ghost" size="sm" leftIcon={<ChevronLeft className="h-4 w-4" />}>
                    {prevLesson.title}
                  </Button>
                </Link>
              )}
            </div>
            <div>
              {nextLesson && (
                <Link href={`/courses/${courseId}/lessons/${nextLesson.id}`}>
                  <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="h-4 w-4" />}>
                    {nextLesson.title}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Course Sidebar */}
      <aside className={cn(
        'w-full border-l border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950',
        'lg:w-80 lg:flex-shrink-0',
        showSidebar ? 'block' : 'hidden lg:block',
      )}>
        <div className="sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="border-b border-gray-200 p-4 dark:border-gray-800">
            <Link href={`/courses/${courseId}`} className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
              <ArrowLeft className="h-4 w-4" />
              Back to Course
            </Link>
          </div>
          <div className="p-3 space-y-2">
            {MOCK_SECTIONS.map((section) => (
              <div key={section.id}>
                <button className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">{section.title}</p>
                    <p className="text-xs text-gray-500">{section.lessons.length} lessons</p>
                  </div>
                </button>
                <div className="ml-2 space-y-0.5">
                  {section.lessons.map((lesson) => (
                    <Link key={lesson.id} href={`/courses/${courseId}/lessons/${lesson.id}`}>
                      <div className={cn(
                        'flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors',
                        lesson.id === currentLesson.id
                          ? 'bg-primary-50 text-primary-700 font-medium dark:bg-primary-950/50 dark:text-primary-300'
                          : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/50',
                      )}>
                        {lesson.lessonType === 'VIDEO' ? <Play className="h-3 w-3" /> :
                         lesson.lessonType === 'QUIZ' ? <HelpCircle className="h-3 w-3" /> :
                         lesson.lessonType === 'ASSIGNMENT' ? <ClipboardList className="h-3 w-3" /> :
                         <FileText className="h-3 w-3" />}
                        <span className="flex-1 truncate">{lesson.title}</span>
                        {completedLessonIds.includes(lesson.id) && (
                          <CheckCircle className="h-3 w-3 text-emerald-500" />
                        )}
                        {lesson.id === currentLesson.id && (
                          <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
