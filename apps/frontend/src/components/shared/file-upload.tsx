'use client';

import { useState, useRef, type DragEvent, type ChangeEvent } from 'react';
import { Upload, X, File, Image as ImageIcon, FileText, FileType, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';

interface FileUploadProps {
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
  onUpload?: (files: File[]) => void;
  className?: string;
  label?: string;
  description?: string;
  preview?: boolean;
  disabled?: boolean;
}

interface FilePreview {
  file: File;
  id: string;
  previewUrl?: string;
  progress: number;
  error?: string;
}

export function FileUpload({
  accept = 'image/*,.pdf,.doc,.docx,.mp4',
  maxSize = 50 * 1024 * 1024,
  multiple = true,
  onUpload,
  className,
  label = 'Upload Files',
  description = 'Drag & drop files here, or click to browse',
  preview = true,
  disabled = false,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<FilePreview[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = accept.split(',').map((e) => e.trim().toLowerCase());
    const acceptsAll = allowedExtensions.includes('*') || allowedExtensions.includes('.*');

    if (!acceptsAll && !allowedExtensions.some((e) => e === ext || e === file.type)) {
      return `File type "${ext}" is not supported`;
    }
    if (file.size > maxSize) {
      const mb = maxSize / 1024 / 1024;
      return `File must be smaller than ${mb}MB`;
    }
    return null;
  };

  const processFiles = (fileList: FileList) => {
    const newFiles: FilePreview[] = [];
    const validFiles: File[] = [];

    Array.from(fileList).forEach((file) => {
      const error = validateFile(file);
      const preview: FilePreview = {
        file,
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        progress: 0,
        error,
      };

      if (file.type.startsWith('image/') && preview) {
        preview.previewUrl = URL.createObjectURL(file);
      }

      newFiles.push(preview);
      if (!error) validFiles.push(file);
    });

    setFiles((prev) => (multiple ? [...prev, ...newFiles] : newFiles));
    if (validFiles.length > 0) {
      simulateUpload(validFiles);
      onUpload?.(validFiles);
    }
  };

  const simulateUpload = (uploadFiles: File[]) => {
    uploadFiles.forEach((file) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
        }
        setFiles((prev) =>
          prev.map((f) =>
            f.file.name === file.name && f.file.size === file.size
              ? { ...f, progress }
              : f,
          ),
        );
      }, 200);
    });
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove?.previewUrl) URL.revokeObjectURL(fileToRemove.previewUrl);
      return prev.filter((f) => f.id !== id);
    });
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files);
    if (inputRef.current) inputRef.current.value = '';
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <ImageIcon className="h-5 w-5 text-blue-500" />;
    if (file.type.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />;
    if (file.type.includes('video')) return <FileType className="h-5 w-5 text-purple-500" />;
    return <File className="h-5 w-5 text-gray-500" />;
  };

  return (
    <div className={cn('w-full space-y-3', className)}>
      {/* Drop Zone */}
      <motion.div
        animate={isDragging ? { scale: 1.01 } : { scale: 1 }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200',
          isDragging
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30'
            : 'border-gray-300 hover:border-gray-400 bg-gray-50 dark:border-gray-700 dark:hover:border-gray-600 dark:bg-gray-900/50',
          disabled && 'cursor-not-allowed opacity-60',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
          aria-label={label}
        />
        <div className="flex flex-col items-center gap-2">
          <motion.div
            animate={isDragging ? { y: -5 } : { y: 0 }}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800"
          >
            <Upload className={cn('h-6 w-6', isDragging ? 'text-primary-500' : 'text-gray-400')} />
          </motion.div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {isDragging ? 'Drop files here' : label}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{description}</p>
          </div>
          <Button variant="ghost" size="sm" type="button" disabled={disabled}>
            Browse Files
          </Button>
        </div>
      </motion.div>

      {/* File Previews */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {files.map((filePreview) => (
              <motion.div
                key={filePreview.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900"
              >
                {/* Thumbnail or Icon */}
                {preview && filePreview.previewUrl ? (
                  <img
                    src={filePreview.previewUrl}
                    alt={filePreview.file.name}
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                    {getFileIcon(filePreview.file)}
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {filePreview.file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(filePreview.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  {filePreview.error ? (
                    <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      {filePreview.error}
                    </p>
                  ) : filePreview.progress < 100 ? (
                    <Progress value={filePreview.progress} size="sm" className="mt-1" />
                  ) : (
                    <span className="text-xs text-emerald-500">Upload complete</span>
                  )}
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFile(filePreview.id)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors dark:hover:bg-gray-800 dark:hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
