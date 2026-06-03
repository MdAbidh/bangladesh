'use client';

import { useState } from 'react';
import { Bell, CheckCheck, Mail, MailOpen, BookOpen, Award, MessageCircle, AlertTriangle, Trash2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import type { Notification } from '@/types';

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', user: { id: '', firebaseUid: '', email: '', firstName: '', lastName: '', displayName: '', avatarUrl: null, role: 'STUDENT', phoneNumber: null, bio: null, isActive: true, isEmailVerified: true, lastLoginAt: null, createdAt: '', updatedAt: '' }, type: 'ENROLLMENT', title: 'Enrolled in Advanced React Patterns', message: 'You have successfully enrolled in the course. Start learning today!', data: null, isRead: false, readAt: null, createdAt: '2025-06-03T10:00:00Z' },
  { id: 'n2', user: { id: '', firebaseUid: '', email: '', firstName: '', lastName: '', displayName: '', avatarUrl: null, role: 'STUDENT', phoneNumber: null, bio: null, isActive: true, isEmailVerified: true, lastLoginAt: null, createdAt: '', updatedAt: '' }, type: 'PROGRESS', title: 'Lesson Completed', message: 'You completed "Compound Component Pattern" in Advanced React Patterns.', data: null, isRead: false, readAt: null, createdAt: '2025-06-02T14:30:00Z' },
  { id: 'n3', user: { id: '', firebaseUid: '', email: '', firstName: '', lastName: '', displayName: '', avatarUrl: null, role: 'STUDENT', phoneNumber: null, bio: null, isActive: true, isEmailVerified: true, lastLoginAt: null, createdAt: '', updatedAt: '' }, type: 'CERTIFICATE', title: 'Certificate Earned!', message: 'Congratulations! You earned a certificate for Node.js Backend Development.', data: null, isRead: true, readAt: '2025-06-01T00:00:00Z', createdAt: '2025-06-01T09:00:00Z' },
  { id: 'n4', user: { id: '', firebaseUid: '', email: '', firstName: '', lastName: '', displayName: '', avatarUrl: null, role: 'STUDENT', phoneNumber: null, bio: null, isActive: true, isEmailVerified: true, lastLoginAt: null, createdAt: '', updatedAt: '' }, type: 'DISCUSSION', title: 'New Reply on Your Comment', message: 'Sarah Chen replied to your comment in the Compound Components discussion.', data: null, isRead: true, readAt: '2025-05-30T00:00:00Z', createdAt: '2025-05-30T16:00:00Z' },
  { id: 'n5', user: { id: '', firebaseUid: '', email: '', firstName: '', lastName: '', displayName: '', avatarUrl: null, role: 'STUDENT', phoneNumber: null, bio: null, isActive: true, isEmailVerified: true, lastLoginAt: null, createdAt: '', updatedAt: '' }, type: 'SYSTEM', title: 'Platform Update', message: 'New features are available! Check out the improved lesson player.', data: null, isRead: true, readAt: '2025-05-28T00:00:00Z', createdAt: '2025-05-28T12:00:00Z' },
  { id: 'n6', user: { id: '', firebaseUid: '', email: '', firstName: '', lastName: '', displayName: '', avatarUrl: null, role: 'STUDENT', phoneNumber: null, bio: null, isActive: true, isEmailVerified: true, lastLoginAt: null, createdAt: '', updatedAt: '' }, type: 'REVIEW', title: 'Course Review Request', message: 'How was your experience with TypeScript Mastery? Leave a review!', data: null, isRead: false, readAt: null, createdAt: '2025-05-27T11:00:00Z' },
  { id: 'n7', user: { id: '', firebaseUid: '', email: '', firstName: '', lastName: '', displayName: '', avatarUrl: null, role: 'STUDENT', phoneNumber: null, bio: null, isActive: true, isEmailVerified: true, lastLoginAt: null, createdAt: '', updatedAt: '' }, type: 'PROGRESS', title: 'Milestone Reached', message: 'You completed 50% of Advanced React Patterns! Keep going!', data: null, isRead: true, readAt: '2025-05-25T00:00:00Z', createdAt: '2025-05-25T08:00:00Z' },
];

const typeConfig = {
  ENROLLMENT: { icon: BookOpen, color: 'text-blue-500 bg-blue-100 dark:bg-blue-950/30 dark:text-blue-400' },
  PROGRESS: { icon: Award, color: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400' },
  CERTIFICATE: { icon: Award, color: 'text-amber-500 bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400' },
  DISCUSSION: { icon: MessageCircle, color: 'text-purple-500 bg-purple-100 dark:bg-purple-950/30 dark:text-purple-400' },
  REVIEW: { icon: MessageCircle, color: 'text-cyan-500 bg-cyan-100 dark:bg-cyan-950/30 dark:text-cyan-400' },
  SYSTEM: { icon: AlertTriangle, color: 'text-gray-500 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400' },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState('all');

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filtered = filter === 'all' ? notifications :
    filter === 'unread' ? notifications.filter(n => !n.isRead) :
    notifications.filter(n => n.type === filter.toUpperCase());

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true, readAt: new Date().toISOString() })));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Notifications</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'No unread notifications'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllAsRead} leftIcon={<CheckCheck className="h-4 w-4" />}>
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={setFilter} variant="pills">
        <TabsList variant="pills">
          <TabsTrigger value="all">
            <Bell className="h-4 w-4" />
            All
          </TabsTrigger>
          <TabsTrigger value="unread">
            <Mail className="h-4 w-4" />
            Unread
            {unreadCount > 0 && (
              <Badge variant="danger" size="sm" className="ml-1.5">{unreadCount}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="ENROLLMENT"><BookOpen className="h-4 w-4" /> Enrollments</TabsTrigger>
          <TabsTrigger value="PROGRESS"><Award className="h-4 w-4" /> Progress</TabsTrigger>
          <TabsTrigger value="DISCUSSION"><MessageCircle className="h-4 w-4" /> Discussion</TabsTrigger>
        </TabsList>

        <TabsContent value={filter}>
          {filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white/50 p-12 text-center dark:border-gray-800 dark:bg-gray-950/50">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
                {filter === 'unread' ? (
                  <MailOpen className="h-8 w-8 text-gray-400" />
                ) : (
                  <Bell className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {filter === 'unread' ? 'You\'re all caught up!' : 'Notifications will appear here when you get them.'}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence>
                {filtered.map((notification, i) => {
                  const config = typeConfig[notification.type] || typeConfig.SYSTEM;
                  const Icon = config.icon;

                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: i * 0.03 }}
                      layout
                      onClick={() => !notification.isRead && markAsRead(notification.id)}
                      className={cn(
                        'group flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition-all hover:shadow-sm',
                        notification.isRead
                          ? 'border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900'
                          : 'border-primary-100 bg-primary-50/50 dark:border-primary-900/50 dark:bg-primary-950/20',
                      )}
                    >
                      <div className={cn('flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl', config.color)}>
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className={cn('text-sm', notification.isRead ? 'font-medium text-gray-900 dark:text-gray-100' : 'font-semibold text-gray-900 dark:text-gray-100')}>
                            {notification.title}
                          </h3>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-xs text-gray-500">{formatDate(notification.createdAt, 'MMM d, HH:mm')}</span>
                            {!notification.isRead && (
                              <span className="h-2 w-2 rounded-full bg-primary-500" />
                            )}
                          </div>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{notification.message}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <Badge variant="default" size="sm">{notification.type.charAt(0) + notification.type.slice(1).toLowerCase()}</Badge>
                          {!notification.isRead && (
                            <button
                              onClick={(e) => { e.stopPropagation(); markAsRead(notification.id); }}
                              className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
