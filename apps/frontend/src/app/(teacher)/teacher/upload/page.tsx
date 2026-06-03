'use client';

import { useState, useRef, type DragEvent } from 'react';
import {
  Upload,
  X,
  File,
  Video,
  Film,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  ChevronDown,
  ChevronUp,
  List,
  Grid3X3,
  Play,
  Pause,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type UploadStatus = 'queued' | 'uploading' | 'processing' | 'completed' | 'failed';

interface UploadItem {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: UploadStatus;
  thumbnail?: string;
  addedAt: Date;
}

const formatSize = (bytes: number) => {
  if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${bytes} B`;
};

const generateMockUploads = (count: number): UploadItem[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `upload-${i + 1}`,
    name: `lesson-${i + 1}-recording.mp4`,
    size: Math.random() * 500 * 1024 * 1024 + 50 * 1024 * 1024,
    type: 'video/mp4',
    progress: 100,
    status: 'completed' as UploadStatus,
    addedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
  }));

const uploadHistory = generateMockUploads(8);

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<UploadItem[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (files: FileList) => {
    const newItems: UploadItem[] = Array.from(files).map((file, idx) => ({
      id: `new-${Date.now()}-${idx}`,
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: 'queued' as UploadStatus,
      addedAt: new Date(),
    }));
    setUploadQueue((prev) => [...prev, ...newItems]);
    simulateUploads(newItems);
  };

  const simulateUploads = (items: UploadItem[]) => {
    items.forEach((item) => {
      setUploadQueue((prev) =>
        prev.map((u) => (u.id === item.id ? { ...u, status: 'uploading' as UploadStatus } : u)),
      );
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 8 + 2;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setUploadQueue((prev) =>
            prev.map((u) =>
              u.id === item.id
                ? { ...u, progress, status: 'processing' as UploadStatus }
                : u,
            ),
          );
          setTimeout(() => {
            setUploadQueue((prev) =>
              prev.map((u) =>
                u.id === item.id
                  ? { ...u, status: 'completed' as UploadStatus }
                  : u,
              ),
            );
          }, 2000);
        }
        setUploadQueue((prev) =>
          prev.map((u) => (u.id === item.id ? { ...u, progress } : u)),
        );
      }, 150);
    });
  };

  const removeFromQueue = (id: string) => {
    setUploadQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCompleted = () => {
    setUploadQueue((prev) => prev.filter((item) => item.status !== 'completed'));
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  };

  const getStatusIcon = (status: UploadStatus) => {
    switch (status) {
      case 'queued': return <Clock className="h-4 w-4 text-gray-400" />;
      case 'uploading': return <Upload className="h-4 w-4 text-purple-500" />;
      case 'processing': return <Film className="h-4 w-4 text-amber-500" />;
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: UploadStatus) => {
    switch (status) {
      case 'queued': return <Badge variant="default" size="sm">Queued</Badge>;
      case 'uploading': return <Badge variant="info" size="sm">Uploading</Badge>;
      case 'processing': return <Badge variant="warning" size="sm">Processing</Badge>;
      case 'completed': return <Badge variant="success" size="sm">Completed</Badge>;
      case 'failed': return <Badge variant="danger" size="sm">Failed</Badge>;
    }
  };

  const activeUploadCount = uploadQueue.filter((u) => u.status === 'uploading' || u.status === 'queued' || u.status === 'processing').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Upload Center</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Upload and manage your course videos and resources
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeUploadCount > 0 && (
            <Badge variant="info" size="lg">{activeUploadCount} Active Uploads</Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Trash2 className="h-4 w-4" />}
            onClick={clearCompleted}
          >
            Clear Completed
          </Button>
        </div>
      </div>

      {/* Drop Zone */}
      <motion.div
        animate={isDragging ? { scale: 1.01 } : { scale: 1 }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'relative cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all',
          isDragging
            ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/30'
            : 'border-gray-300 hover:border-purple-400 bg-gray-50 dark:border-gray-700 dark:hover:border-purple-600 dark:bg-gray-900/50',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="video/*,.pdf,.zip,.doc,.docx"
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
        <div className="flex flex-col items-center gap-3">
          <motion.div
            animate={isDragging ? { y: -5, rotate: -5 } : { y: 0, rotate: 0 }}
            className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-950/50 dark:to-indigo-950/50"
          >
            <Upload className={cn('h-8 w-8', isDragging ? 'text-purple-600' : 'text-purple-400')} />
          </motion.div>
          <div>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              {isDragging ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Supports MP4, MOV, PDF, ZIP up to 2GB each
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="glass-primary" size="sm" type="button">Browse Videos</Button>
            <Button variant="glass-secondary" size="sm" type="button">Browse Files</Button>
          </div>
        </div>
      </motion.div>

      {/* Upload Queue */}
      <AnimatePresence>
        {uploadQueue.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card glass>
              <CardHeader divider>
                <div className="flex items-center justify-between">
                  <CardTitle>Upload Queue ({uploadQueue.length})</CardTitle>
                  <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-0.5 dark:border-gray-700 dark:bg-gray-950">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={cn('rounded-md p-1.5 transition-colors', viewMode === 'grid' ? 'bg-purple-100 text-purple-700' : 'text-gray-400')}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={cn('rounded-md p-1.5 transition-colors', viewMode === 'list' ? 'bg-purple-100 text-purple-700' : 'text-gray-400')}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {viewMode === 'grid' ? (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence>
                      {uploadQueue.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-950/50">
                              <Video className="h-5 w-5 text-purple-500" />
                            </div>
                            {getStatusIcon(item.status)}
                          </div>
                          <p className="mt-3 text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-1">{item.name}</p>
                          <p className="text-xs text-gray-400">{formatSize(item.size)}</p>
                          <div className="mt-2">{getStatusBadge(item.status)}</div>
                          {(item.status === 'uploading' || item.status === 'processing') && (
                            <Progress value={item.progress} size="sm" className="mt-2" />
                          )}
                          {item.status !== 'completed' && (
                            <button
                              onClick={() => removeFromQueue(item.id)}
                              className="mt-2 text-xs text-red-500 hover:text-red-600"
                            >
                              Cancel
                            </button>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <AnimatePresence>
                      {uploadQueue.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 dark:border-gray-800 dark:bg-gray-900"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-950/50 dark:to-indigo-950/50">
                            <Video className="h-5 w-5 text-purple-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{item.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-gray-400">{formatSize(item.size)}</span>
                              {getStatusBadge(item.status)}
                            </div>
                            {(item.status === 'uploading' || item.status === 'processing') && (
                              <Progress value={item.progress} size="sm" className="mt-1.5" />
                            )}
                          </div>
                          {item.status !== 'completed' && (
                            <button
                              onClick={() => removeFromQueue(item.id)}
                              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-500 dark:hover:bg-gray-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                          {item.status === 'completed' && (
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </CardContent>
              {uploadQueue.length > 0 && (
                <CardFooter className="justify-between">
                  <span className="text-xs text-gray-400">
                    {uploadQueue.filter((u) => u.status === 'completed').length} of {uploadQueue.length} completed
                  </span>
                  <Button variant="ghost" size="sm" onClick={clearCompleted}>
                    Clear Completed
                  </Button>
                </CardFooter>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload History */}
      <Card glass>
        <CardHeader divider>
          <CardTitle>Upload History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {uploadHistory.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/50">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.name}</p>
                  <p className="text-xs text-gray-400">{formatSize(item.size)} • Completed</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">
                    {item.addedAt.toLocaleDateString()}
                  </p>
                </div>
                <Button variant="ghost" size="icon-sm">
                  <Play className="h-3.5 w-3.5 text-gray-400" />
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
