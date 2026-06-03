'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import {
  BookOpen,
  Users,
  Star,
  DollarSign,
  Clock,
  Save,
  Plus,
  GripVertical,
  Trash2,
  Edit3,
  ChevronDown,
  ChevronRight,
  Play,
  FileText,
  FileType,
  Link2,
  MoreHorizontal,
  Upload,
  X,
  Settings,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { StatCard } from '@/components/shared/stat-card';
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from '@/components/ui/modal';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'article' | 'quiz' | 'assignment' | 'resource';
  duration: string;
  isFree: boolean;
}

interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

const initialSections: Section[] = [
  {
    id: 's1',
    title: 'Introduction',
    lessons: [
      { id: 'l1', title: 'Welcome to the Course', type: 'video', duration: '5:30', isFree: true },
      { id: 'l2', title: 'What You Will Learn', type: 'article', duration: '3:00', isFree: true },
      { id: 'l3', title: 'Setting Up Your Environment', type: 'video', duration: '12:45', isFree: false },
    ],
  },
  {
    id: 's2',
    title: 'Core Concepts',
    lessons: [
      { id: 'l4', title: 'Understanding the Basics', type: 'video', duration: '18:20', isFree: false },
      { id: 'l5', title: 'Core Principles Deep Dive', type: 'video', duration: '25:00', isFree: false },
      { id: 'l6', title: 'Practice Exercise 1', type: 'assignment', duration: '30:00', isFree: false },
    ],
  },
];

const lessonTypeIcons = {
  video: Play,
  article: FileText,
  quiz: FileType,
  assignment: FileType,
  resource: Link2,
};

const lessonTypeColors = {
  video: 'text-purple-500 bg-purple-100 dark:bg-purple-950/50',
  article: 'text-blue-500 bg-blue-100 dark:bg-blue-950/50',
  quiz: 'text-amber-500 bg-amber-100 dark:bg-amber-950/50',
  assignment: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-950/50',
  resource: 'text-gray-500 bg-gray-100 dark:bg-gray-800',
};

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;

  const [sections, setSections] = useState<Section[]>(initialSections);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editSectionTitle, setEditSectionTitle] = useState('');
  const [showAddLesson, setShowAddLesson] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const updateSectionTitle = (sectionId: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, title: editSectionTitle } : s)),
    );
    setEditingSection(null);
  };

  const deleteSection = (sectionId: string) => {
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
  };

  const addSection = () => {
    const newSection: Section = {
      id: `s${Date.now()}`,
      title: 'New Section',
      lessons: [],
    };
    setSections((prev) => [...prev, newSection]);
    setEditingSection(newSection.id);
    setEditSectionTitle('New Section');
  };

  const deleteLesson = (sectionId: string, lessonId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId ? { ...s, lessons: s.lessons.filter((l) => l.id !== lessonId) } : s,
      ),
    );
  };

  const resources = [
    { name: 'Course-Syllabus.pdf', type: 'PDF', size: '2.4 MB' },
    { name: 'Code-Snippets.zip', type: 'ZIP', size: '1.8 MB' },
    { name: 'Cheat-Sheet.pdf', type: 'PDF', size: '856 KB' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <BookOpen className="h-4 w-4" />
            <span>Course</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gray-900 dark:text-gray-100">Web Development Bootcamp</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
            Complete Web Development Bootcamp
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Last updated 2 days ago
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value="published"
            options={[
              { value: 'published', label: 'Published' },
              { value: 'draft', label: 'Draft' },
              { value: 'archived', label: 'Archived' },
            ]}
            className="w-36"
          />
          <Button variant="primary" size="sm" leftIcon={<Save className="h-4 w-4" />}>
            Save Changes
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList variant="pills" className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Users} label="Total Students" value={234} variant="primary" />
            <StatCard icon={Star} label="Average Rating" value="4.8" variant="warning" />
            <StatCard icon={DollarSign} label="Revenue" value="$18,720" variant="success" />
            <StatCard icon={Clock} label="Total Duration" value="42h 15m" variant="default" />
          </div>

          <Card glass>
            <CardHeader divider>
              <CardTitle>Course Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <Input label="Course Title" defaultValue="Complete Web Development Bootcamp" />
                <Input label="Subtitle" defaultValue="Learn HTML, CSS, JavaScript, React, and Node.js" />
                <Select label="Category" value="web-development" options={[{ value: 'web-development', label: 'Web Development' }]} />
              </div>
              <div className="space-y-4">
                <Select label="Level" value="beginner" options={[{ value: 'beginner', label: 'Beginner' }]} />
                <Select label="Language" value="english" options={[{ value: 'english', label: 'English' }]} />
                <Textarea label="Description" defaultValue="A comprehensive bootcamp covering full-stack web development from scratch." rows={4} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Curriculum Tab */}
        <TabsContent value="curriculum" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Course Curriculum
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {sections.reduce((acc, s) => acc + s.lessons.length, 0)} lessons in {sections.length} sections
              </p>
            </div>
            <Button variant="glass-primary" size="sm" onClick={addSection} leftIcon={<Plus className="h-4 w-4" />}>
              Add Section
            </Button>
          </div>

          <AnimatePresence>
            {sections.map((section, sIdx) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                transition={{ duration: 0.2 }}
              >
                <Card glass className="overflow-hidden">
                  <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50/50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900/50">
                    <GripVertical className="h-4 w-4 cursor-grab text-gray-400" />
                    {editingSection === section.id ? (
                      <div className="flex flex-1 items-center gap-2">
                        <Input
                          value={editSectionTitle}
                          onChange={(e) => setEditSectionTitle(e.target.value)}
                          className="h-8"
                          autoFocus
                        />
                        <Button variant="primary" size="sm" onClick={() => updateSectionTitle(section.id)}>
                          Save
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setEditingSection(null)}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span className="text-sm font-medium text-gray-400">Section {sIdx + 1}</span>
                        <span
                          className="flex-1 cursor-pointer text-sm font-semibold text-gray-900 dark:text-gray-100"
                          onClick={() => {
                            setEditingSection(section.id);
                            setEditSectionTitle(section.title);
                          }}
                        >
                          {section.title}
                        </span>
                        <span className="text-xs text-gray-400">{section.lessons.length} lessons</span>
                        <button
                          onClick={() => {
                            setEditingSection(section.id);
                            setEditSectionTitle(section.title);
                          }}
                          className="rounded-lg p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-800"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => deleteSection(section.id)}
                          className="rounded-lg p-1 text-gray-400 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-950/50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                  </div>

                  <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
                    {section.lessons.map((lesson, lIdx) => {
                      const Icon = lessonTypeIcons[lesson.type];
                      return (
                        <motion.div
                          key={lesson.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: lIdx * 0.03 }}
                          className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/30"
                        >
                          <GripVertical className="h-3.5 w-3.5 cursor-grab text-gray-300" />
                          <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', lessonTypeColors[lesson.type])}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{lesson.title}</p>
                          </div>
                          <span className="text-xs text-gray-400">{lesson.duration}</span>
                          {lesson.isFree && <Badge variant="secondary" size="sm">Free</Badge>}
                          <button className="rounded-lg p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-800">
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => deleteLesson(section.id, lesson.id)}
                            className="rounded-lg p-1 text-gray-400 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-950/50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>

                  <div className="border-t border-gray-100 px-4 py-2 dark:border-gray-800">
                    <button
                      onClick={() => setShowAddLesson(showAddLesson === section.id ? null : section.id)}
                      className="flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400"
                    >
                      <Plus className="h-4 w-4" />
                      Add Lesson
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources">
          <Card glass>
            <CardHeader divider>
              <div className="flex items-center justify-between">
                <CardTitle>Course Resources</CardTitle>
                <Button variant="glass-primary" size="sm" leftIcon={<Upload className="h-4 w-4" />}>
                  Upload Resource
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {resources.map((res, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-500 dark:bg-gray-800">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{res.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{res.type} • {res.size}</p>
                    </div>
                    <button className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Tab */}
        <TabsContent value="pricing">
          <Card glass>
            <CardHeader divider>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Switch
                label="Free Course"
                description="Offer this course for free"
                checked={false}
                onCheckedChange={() => {}}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Price ($)" type="number" defaultValue="49.99" icon={<DollarSign className="h-4 w-4" />} />
                <Input label="Discounted Price ($)" type="number" defaultValue="29.99" icon={<DollarSign className="h-4 w-4" />} />
              </div>
              <Button variant="primary" size="sm" leftIcon={<Save className="h-4 w-4" />}>
                Save Pricing
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <div className="space-y-6">
            <Card glass>
              <CardHeader divider>
                <CardTitle>Course Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Switch
                  label="Featured Course"
                  description="Show this course in featured sections"
                  checked={false}
                  onCheckedChange={() => {}}
                />
                <Switch
                  label="Certificate Enabled"
                  description="Issue a certificate upon completion"
                  checked={true}
                  onCheckedChange={() => {}}
                />
                <Switch
                  label="Course Comments"
                  description="Allow students to comment on lessons"
                  checked={true}
                  onCheckedChange={() => {}}
                />
              </CardContent>
            </Card>

            <Card glass>
              <CardHeader divider>
                <CardTitle>Danger Zone</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-red-200/50 bg-red-50/50 p-4 dark:border-red-900/50 dark:bg-red-950/30">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 text-red-500" />
                    <div>
                      <p className="text-sm font-medium text-red-800 dark:text-red-300">Archive Course</p>
                      <p className="text-xs text-red-600 dark:text-red-400">This will hide the course from students</p>
                    </div>
                  </div>
                  <Button variant="danger" size="sm">Archive</Button>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-red-200/50 bg-red-50/50 p-4 dark:border-red-900/50 dark:bg-red-950/30">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 text-red-500" />
                    <div>
                      <p className="text-sm font-medium text-red-800 dark:text-red-300">Delete Course</p>
                      <p className="text-xs text-red-600 dark:text-red-400">Permanently delete this course and all its data</p>
                    </div>
                  </div>
                  <Button variant="danger" size="sm" onClick={() => setShowDeleteModal(true)}>Delete</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Modal */}
      <Modal open={showDeleteModal} onOpenChange={setShowDeleteModal} size="sm">
        <ModalHeader>
          <ModalTitle>Delete Course</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-950/50">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Are you sure you want to delete this course? This action cannot be undone. All content, enrollments, and data will be permanently removed.
              </p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger">Delete Course</Button>
        </ModalFooter>
      </Modal>
    </motion.div>
  );
}
