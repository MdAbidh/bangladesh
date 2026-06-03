'use client';

import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Save,
  Send,
  Check,
  BookOpen,
  DollarSign,
  Image as ImageIcon,
  Video,
  Tag,
  X,
  Upload,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface StepProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
}

const steps = [
  { id: 'basic', label: 'Basic Info', icon: BookOpen },
  { id: 'pricing', label: 'Pricing', icon: DollarSign },
  { id: 'thumbnail', label: 'Thumbnail', icon: ImageIcon },
  { id: 'preview', label: 'Preview Video', icon: Video },
  { id: 'tags', label: 'Tags & Meta', icon: Tag },
];

const categoryOptions = [
  { value: 'web-development', label: 'Web Development' },
  { value: 'data-science', label: 'Data Science' },
  { value: 'mobile', label: 'Mobile Development' },
  { value: 'design', label: 'Design' },
  { value: 'devops', label: 'DevOps' },
  { value: 'cloud', label: 'Cloud Computing' },
  { value: 'programming', label: 'Programming' },
  { value: 'ai-ml', label: 'AI & Machine Learning' },
];

const levelOptions = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'all-levels', label: 'All Levels' },
];

const languageOptions = [
  { value: 'english', label: 'English' },
  { value: 'bengali', label: 'Bengali' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'arabic', label: 'Arabic' },
];

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction < 0 ? 300 : -300, opacity: 0 }),
};

export default function CreateCoursePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isFree, setIsFree] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    category: '',
    level: '',
    language: 'english',
    price: '',
    discountedPrice: '',
    thumbnail: null as File | null,
    previewVideo: null as File | null,
  });

  const nextStep = () => {
    setDirection(1);
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      setTags((prev) => [...new Set([...prev, tagInput.trim()])]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => setTags((prev) => prev.filter((t) => t !== tag));

  const progressPercent = ((currentStep + 1) / steps.length) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-5">
            <Input
              label="Course Title"
              placeholder="e.g. Complete Web Development Bootcamp"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              helperText="Give your course a clear, descriptive title"
            />
            <Input
              label="Subtitle"
              placeholder="e.g. Learn HTML, CSS, JavaScript, React, and Node.js"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            />
            <Textarea
              label="Description"
              placeholder="Describe what students will learn in this course..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={5}
            />
            <div className="grid gap-4 sm:grid-cols-3">
              <Select
                label="Category"
                placeholder="Select category"
                value={formData.category}
                onValueChange={(v) => setFormData({ ...formData, category: v })}
                options={categoryOptions}
              />
              <Select
                label="Level"
                placeholder="Select level"
                value={formData.level}
                onValueChange={(v) => setFormData({ ...formData, level: v })}
                options={levelOptions}
              />
              <Select
                label="Language"
                value={formData.language}
                onValueChange={(v) => setFormData({ ...formData, language: v })}
                options={languageOptions}
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-5">
            <Switch
              label="Free Course"
              description="Toggle on to offer this course for free"
              checked={isFree}
              onCheckedChange={setIsFree}
            />
            {!isFree && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Price ($)"
                  type="number"
                  placeholder="49.99"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  icon={<DollarSign className="h-4 w-4" />}
                />
                <Input
                  label="Discounted Price ($)"
                  type="number"
                  placeholder="29.99"
                  value={formData.discountedPrice}
                  onChange={(e) => setFormData({ ...formData, discountedPrice: e.target.value })}
                  icon={<DollarSign className="h-4 w-4" />}
                  helperText="Optional: set a promotional price"
                />
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-5">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file && file.type.startsWith('image/')) setFormData({ ...formData, thumbnail: file });
              }}
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e: any) => {
                  const file = e.target.files?.[0];
                  if (file) setFormData({ ...formData, thumbnail: file });
                };
                input.click();
              }}
              className="relative cursor-pointer rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center transition-colors hover:border-purple-400 dark:border-gray-700 dark:hover:border-purple-600"
            >
              {formData.thumbnail ? (
                <div className="space-y-3">
                  <img
                    src={URL.createObjectURL(formData.thumbnail)}
                    alt="Thumbnail preview"
                    className="mx-auto max-h-48 rounded-xl object-cover"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">{formData.thumbnail.name}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormData({ ...formData, thumbnail: null });
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 dark:bg-purple-950/50">
                    <Upload className="h-8 w-8 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Upload Thumbnail</p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Recommended: 1280x720px (16:9)</p>
                  </div>
                  <Button variant="glass-primary" size="sm" type="button">Browse Files</Button>
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-5">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file && file.type.startsWith('video/')) setFormData({ ...formData, previewVideo: file });
              }}
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'video/*';
                input.onchange = (e: any) => {
                  const file = e.target.files?.[0];
                  if (file) setFormData({ ...formData, previewVideo: file });
                };
                input.click();
              }}
              className="relative cursor-pointer rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center transition-colors hover:border-purple-400 dark:border-gray-700 dark:hover:border-purple-600"
            >
              {formData.previewVideo ? (
                <div className="space-y-3">
                  <video
                    src={URL.createObjectURL(formData.previewVideo)}
                    className="mx-auto max-h-48 rounded-xl"
                    controls
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">{formData.previewVideo.name}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormData({ ...formData, previewVideo: null });
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-950/50">
                    <Video className="h-8 w-8 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Upload Preview Video</p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">A short preview to attract students (max 2 min)</p>
                  </div>
                  <Button variant="glass-secondary" size="sm" type="button">Browse Files</Button>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tags</label>
              <div className="mt-1.5 flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" size="md">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="ml-1.5 hover:text-gray-700 dark:hover:text-gray-300">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={addTag}
                placeholder="Type a tag and press Enter"
                className="h-10 w-full rounded-xl border border-gray-200 bg-white/80 px-3 text-sm placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700 dark:bg-gray-950/80 dark:text-gray-100"
              />
              <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">Add relevant tags to help students find your course</p>
            </div>

            <Textarea
              label="Prerequisites"
              placeholder="What should students know before taking this course?"
              rows={3}
            />
            <Textarea
              label="Learning Objectives"
              placeholder="What will students be able to do after completing this course?"
              rows={3}
            />
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-3xl space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Create New Course</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Fill in the details to create your course</p>
      </div>

      {/* Progress Steps */}
      <div className="rounded-2xl border border-purple-200/40 bg-white/60 p-4 backdrop-blur-xl dark:border-purple-900/30 dark:bg-gray-950/60">
        <div className="flex items-center justify-between">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;
            const Icon = step.icon;
            return (
              <div key={step.id} className="flex flex-col items-center">
                <button
                  onClick={() => { setDirection(idx > currentStep ? 1 : -1); setCurrentStep(idx); }}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold transition-all',
                    isCompleted && 'bg-purple-600 text-white shadow-md shadow-purple-500/25',
                    isCurrent && 'border-2 border-purple-500 bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300',
                    !isCompleted && !isCurrent && 'border border-gray-200 bg-white text-gray-400 dark:border-gray-700 dark:bg-gray-900',
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </button>
                <span className={cn(
                  'mt-1.5 text-xs font-medium hidden sm:block',
                  isCurrent ? 'text-purple-700 dark:text-purple-300' : 'text-gray-400',
                )}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
        <Progress value={progressPercent} size="sm" className="mt-4" animated />
      </div>

      {/* Step Content */}
      <Card glass>
        <CardHeader divider>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-sm font-bold text-purple-700 dark:bg-purple-950/50 dark:text-purple-300">
              {currentStep + 1}
            </div>
            <CardTitle>{steps[currentStep].label}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div>
            {currentStep > 0 && (
              <Button variant="ghost" onClick={prevStep} leftIcon={<ChevronLeft className="h-4 w-4" />}>
                Previous
              </Button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" leftIcon={<Save className="h-4 w-4" />}>
              Save as Draft
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button onClick={nextStep} rightIcon={<ChevronRight className="h-4 w-4" />}>
                Next Step
              </Button>
            ) : (
              <Button variant="success" leftIcon={<Send className="h-4 w-4" />}>
                Submit for Review
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
