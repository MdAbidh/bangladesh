'use client';

import Link from 'next/link';
import { Github, Twitter, Linkedin, Youtube, Mail, Heart, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  className?: string;
}

const columns: FooterColumn[] = [
  {
    title: 'Platform',
    links: [
      { label: 'Browse Courses', href: '/courses' },
      { label: 'Categories', href: '/courses/categories' },
      { label: 'Popular Courses', href: '/courses/popular' },
      { label: 'New Releases', href: '/courses/new' },
    ],
  },
  {
    title: 'For Learners',
    links: [
      { label: 'My Learning', href: '/dashboard/learning' },
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Certificates', href: '/dashboard/certificates' },
      { label: 'Discussion', href: '/discussions' },
    ],
  },
  {
    title: 'For Teachers',
    links: [
      { label: 'Teach on A.H', href: '/teacher' },
      { label: 'Teacher Dashboard', href: '/teacher/dashboard' },
      { label: 'Create Course', href: '/teacher/courses/create' },
      { label: 'Earnings', href: '/teacher/earnings' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
];

const socialLinks = [
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Mail, href: '#', label: 'Email' },
];

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn('border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950', className)}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white text-sm font-bold">
                AH
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                A.H Learning
              </span>
            </Link>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              Empowering learners worldwide with quality education. Learn at your own pace from expert instructors.
            </p>
            {/* Social Links */}
            <div className="mt-4 flex items-center gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors dark:hover:bg-gray-800 dark:hover:text-gray-300"
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link Columns */}
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {column.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-gray-400 dark:text-gray-500">
              &copy; {new Date().getFullYear()} A.H Learning App. All rights reserved.
            </p>
            <p className="flex items-center gap-1 text-sm text-gray-400 dark:text-gray-500">
              Made with <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" /> by A.H Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
