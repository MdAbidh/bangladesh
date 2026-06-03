import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDuration as dateFnsFormatDuration, intervalToDuration } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: string | Date,
  formatStr: string = 'MMM d, yyyy',
): string {
  return format(new Date(date), formatStr);
}

export function formatDuration(seconds: number): string {
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 });
  const parts: { label: string; value: number | undefined }[] = [
    { label: 'h', value: duration.hours },
    { label: 'm', value: duration.minutes },
    { label: 's', value: duration.seconds },
  ];
  const formatted = parts
    .filter((p) => p.value && p.value > 0)
    .map((p) => `${p.value}${p.label}`)
    .join(' ');
  return formatted || '0s';
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toString();
}

export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}...`;
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

export function getInitials(firstName: string, lastName?: string): string {
  if (lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }
  return firstName.slice(0, 2).toUpperCase();
}
