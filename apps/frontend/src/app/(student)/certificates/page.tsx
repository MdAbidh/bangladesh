'use client';

import { useState } from 'react';
import { Award, Download, Eye, ShieldCheck, ExternalLink, Search, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';
import type { Certificate } from '@/types';

const MOCK_CERTIFICATES: Certificate[] = [
  { id: 'c1', user: { id: 'u1', firebaseUid: '', email: '', firstName: 'Alex', lastName: 'Johnson', displayName: 'Alex Johnson', avatarUrl: null, role: 'STUDENT', phoneNumber: null, bio: null, isActive: true, isEmailVerified: true, lastLoginAt: null, createdAt: '', updatedAt: '' }, course: { id: 'co1', title: 'Advanced React Patterns', slug: 'advanced-react', shortDescription: '', description: '', thumbnailUrl: null, category: { id: '', name: '', slug: '', description: null, icon: null, parentId: null, children: [], courseCount: 0, sortOrder: 0, createdAt: '', updatedAt: '' }, tags: [], level: 'BEGINNER', language: '', duration: 0, totalLessons: 0, totalSections: 0, totalEnrollments: 0, averageRating: 0, totalReviews: 0, price: 0, discountedPrice: null, isFree: false, isPublished: false, isFeatured: false, status: 'PUBLISHED', teacher: { id: '', firebaseUid: '', email: '', firstName: '', lastName: '', displayName: '', avatarUrl: null, role: 'STUDENT', phoneNumber: null, bio: null, isActive: true, isEmailVerified: true, lastLoginAt: null, createdAt: '', updatedAt: '' }, sections: [], prerequisites: [], learningObjectives: [], requirements: [], targetAudience: [], certificateEnabled: false, passingGrade: 0, createdAt: '', updatedAt: '' }, certificateUrl: '#', issuedAt: '2025-05-15T00:00:00Z', expiryDate: null, certificateNumber: 'AH-2025-001', grade: 'A', createdAt: '' },
  { id: 'c2', user: { id: 'u1', firebaseUid: '', email: '', firstName: 'Alex', lastName: 'Johnson', displayName: 'Alex Johnson', avatarUrl: null, role: 'STUDENT', phoneNumber: null, bio: null, isActive: true, isEmailVerified: true, lastLoginAt: null, createdAt: '', updatedAt: '' }, course: { id: 'co2', title: 'TypeScript Mastery', slug: 'typescript-mastery', shortDescription: '', description: '', thumbnailUrl: null, category: { id: '', name: '', slug: '', description: null, icon: null, parentId: null, children: [], courseCount: 0, sortOrder: 0, createdAt: '', updatedAt: '' }, tags: [], level: 'BEGINNER', language: '', duration: 0, totalLessons: 0, totalSections: 0, totalEnrollments: 0, averageRating: 0, totalReviews: 0, price: 0, discountedPrice: null, isFree: false, isPublished: false, isFeatured: false, status: 'PUBLISHED', teacher: { id: '', firebaseUid: '', email: '', firstName: '', lastName: '', displayName: '', avatarUrl: null, role: 'STUDENT', phoneNumber: null, bio: null, isActive: true, isEmailVerified: true, lastLoginAt: null, createdAt: '', updatedAt: '' }, sections: [], prerequisites: [], learningObjectives: [], requirements: [], targetAudience: [], certificateEnabled: false, passingGrade: 0, createdAt: '', updatedAt: '' }, certificateUrl: '#', issuedAt: '2025-04-01T00:00:00Z', expiryDate: null, certificateNumber: 'AH-2025-002', grade: 'A+', createdAt: '' },
  { id: 'c3', user: { id: 'u1', firebaseUid: '', email: '', firstName: 'Alex', lastName: 'Johnson', displayName: 'Alex Johnson', avatarUrl: null, role: 'STUDENT', phoneNumber: null, bio: null, isActive: true, isEmailVerified: true, lastLoginAt: null, createdAt: '', updatedAt: '' }, course: { id: 'co3', title: 'Node.js Backend Development', slug: 'nodejs-backend', shortDescription: '', description: '', thumbnailUrl: null, category: { id: '', name: '', slug: '', description: null, icon: null, parentId: null, children: [], courseCount: 0, sortOrder: 0, createdAt: '', updatedAt: '' }, tags: [], level: 'BEGINNER', language: '', duration: 0, totalLessons: 0, totalSections: 0, totalEnrollments: 0, averageRating: 0, totalReviews: 0, price: 0, discountedPrice: null, isFree: false, isPublished: false, isFeatured: false, status: 'PUBLISHED', teacher: { id: '', firebaseUid: '', email: '', firstName: '', lastName: '', displayName: '', avatarUrl: null, role: 'STUDENT', phoneNumber: null, bio: null, isActive: true, isEmailVerified: true, lastLoginAt: null, createdAt: '', updatedAt: '' }, sections: [], prerequisites: [], learningObjectives: [], requirements: [], targetAudience: [], certificateEnabled: false, passingGrade: 0, createdAt: '', updatedAt: '' }, certificateUrl: '#', issuedAt: '2025-03-10T00:00:00Z', expiryDate: null, certificateNumber: 'AH-2025-003', grade: 'A', createdAt: '' },
  { id: 'c4', user: { id: 'u1', firebaseUid: '', email: '', firstName: 'Alex', lastName: 'Johnson', displayName: 'Alex Johnson', avatarUrl: null, role: 'STUDENT', phoneNumber: null, bio: null, isActive: true, isEmailVerified: true, lastLoginAt: null, createdAt: '', updatedAt: '' }, course: { id: 'co4', title: 'Python for Data Science', slug: 'python-data-science', shortDescription: '', description: '', thumbnailUrl: null, category: { id: '', name: '', slug: '', description: null, icon: null, parentId: null, children: [], courseCount: 0, sortOrder: 0, createdAt: '', updatedAt: '' }, tags: [], level: 'BEGINNER', language: '', duration: 0, totalLessons: 0, totalSections: 0, totalEnrollments: 0, averageRating: 0, totalReviews: 0, price: 0, discountedPrice: null, isFree: false, isPublished: false, isFeatured: false, status: 'PUBLISHED', teacher: { id: '', firebaseUid: '', email: '', firstName: '', lastName: '', displayName: '', avatarUrl: null, role: 'STUDENT', phoneNumber: null, bio: null, isActive: true, isEmailVerified: true, lastLoginAt: null, createdAt: '', updatedAt: '' }, sections: [], prerequisites: [], learningObjectives: [], requirements: [], targetAudience: [], certificateEnabled: false, passingGrade: 0, createdAt: '', updatedAt: '' }, certificateUrl: '#', issuedAt: '2025-02-20T00:00:00Z', expiryDate: null, certificateNumber: 'AH-2025-004', grade: 'A', createdAt: '' },
];

export default function CertificatesPage() {
  const [search, setSearch] = useState('');

  const filtered = search
    ? MOCK_CERTIFICATES.filter(c =>
        c.course.title.toLowerCase().includes(search.toLowerCase()) ||
        c.certificateNumber.toLowerCase().includes(search.toLowerCase()),
      )
    : MOCK_CERTIFICATES;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Certificates</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">View and download your earned certificates</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search certificates..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white/50 p-12 text-center dark:border-gray-800 dark:bg-gray-950/50">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
            <Award className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">No certificates yet</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Complete a course with a certificate to earn your first one.</p>
        </motion.div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
            >
              {/* Gradiant Accent */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-400" />

              {/* Badge */}
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-md">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <Badge variant="success" size="sm" className="flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  Verified
                </Badge>
              </div>

              <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">{cert.course.title}</h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Issued {formatDate(cert.issuedAt)}
              </p>
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 font-mono">
                ID: {cert.certificateNumber}
              </p>

              {cert.grade && (
                <div className="mt-2">
                  <Badge variant="default" size="sm">Grade: {cert.grade}</Badge>
                </div>
              )}

              <div className="mt-4 flex items-center gap-2">
                <a href={cert.certificateUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button variant="primary" size="sm" fullWidth leftIcon={<Eye className="h-4 w-4" />}>
                    View
                  </Button>
                </a>
                <a href={cert.certificateUrl} download>
                  <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />}>
                    PDF
                  </Button>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
