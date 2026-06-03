'use client';

import { useState } from 'react';
import {
  Bell,
  Send,
  Clock,
  Users,
  UserCheck,
  GraduationCap,
  BarChart3,
  Calendar,
  Plus,
  Eye,
  MousePointerClick,
  CheckCircle2,
  AlertTriangle,
  X,
  ChevronRight,
  Save,
  Trash2,
  MoreHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from '@/components/ui/modal';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

const targetOptions = [
  { value: 'all', label: 'All Users' },
  { value: 'students', label: 'Students Only' },
  { value: 'teachers', label: 'Teachers Only' },
  { value: 'admins', label: 'Admins Only' },
];

const broadcastHistory = [
  {
    id: 'b1',
    title: 'New Year Sale - 50% Off!',
    message: 'Happy New Year! Enjoy 50% off on all courses for the first week of January.',
    target: 'all',
    sentAt: '2026-01-01T00:00:00Z',
    sent: 12847,
    opened: 8942,
    clicked: 3421,
    status: 'completed',
  },
  {
    id: 'b2',
    title: 'Teacher Workshop Invitation',
    message: 'Join our upcoming workshop on "Advanced Teaching Techniques" this Friday.',
    target: 'teachers',
    sentAt: '2025-12-28T10:00:00Z',
    sent: 124,
    opened: 98,
    clicked: 67,
    status: 'completed',
  },
  {
    id: 'b3',
    title: 'Course Completion Reminder',
    message: 'You have 3 courses in progress. Complete them before the deadline!',
    target: 'students',
    sentAt: '2025-12-20T08:00:00Z',
    sent: 8234,
    opened: 4521,
    clicked: 1876,
    status: 'completed',
  },
  {
    id: 'b4',
    title: 'Platform Maintenance Notice',
    message: 'Scheduled maintenance on Dec 30, 2:00 AM - 4:00 AM. Expect brief downtime.',
    target: 'all',
    sentAt: '2025-12-15T14:00:00Z',
    sent: 12847,
    opened: 11023,
    clicked: 0,
    status: 'completed',
  },
  {
    id: 'b5',
    title: 'Scheduled: Welcome Campaign',
    message: 'Welcome new users! Start your learning journey with our curated courses.',
    target: 'students',
    sentAt: null,
    scheduledFor: '2026-01-15T09:00:00Z',
    sent: 0,
    opened: 0,
    clicked: 0,
    status: 'scheduled',
  },
];

const chartData = [
  { day: 'Mon', sent: 1200, opened: 800, clicked: 300 },
  { day: 'Tue', sent: 980, opened: 650, clicked: 220 },
  { day: 'Wed', sent: 1500, opened: 1100, clicked: 450 },
  { day: 'Thu', sent: 850, opened: 600, clicked: 180 },
  { day: 'Fri', sent: 1340, opened: 920, clicked: 380 },
  { day: 'Sat', sent: 620, opened: 400, clicked: 120 },
  { day: 'Sun', sent: 450, opened: 310, clicked: 90 },
];

const getTargetLabel = (target: string) => {
  switch (target) {
    case 'all': return 'All Users';
    case 'students': return 'Students';
    case 'teachers': return 'Teachers';
    case 'admins': return 'Admins';
    default: return target;
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export default function AdminNotifications() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastTarget, setBroadcastTarget] = useState('all');
  const [broadcastLink, setBroadcastLink] = useState('');
  const [scheduleSend, setScheduleSend] = useState(false);
  const [activeTab, setActiveTab] = useState('create');

  const totalSent = broadcastHistory.reduce((sum, b) => sum + b.sent, 0);
  const totalOpened = broadcastHistory.reduce((sum, b) => sum + b.opened, 0);
  const totalClicked = broadcastHistory.reduce((sum, b) => sum + b.clicked, 0);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 p-6">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Notifications</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Create and manage broadcast notifications</p>
        </div>
        <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setShowCreateModal(true)}>
          New Broadcast
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card glass className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Sent</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalSent.toLocaleString()}</p>
            </div>
            <Send className="h-8 w-8 text-primary-500" />
          </div>
        </Card>
        <Card glass className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Opened</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalOpened.toLocaleString()}</p>
            </div>
            <Eye className="h-8 w-8 text-emerald-500" />
          </div>
        </Card>
        <Card glass className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Clicked</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalClicked.toLocaleString()}</p>
            </div>
            <MousePointerClick className="h-8 w-8 text-amber-500" />
          </div>
        </Card>
        <Card glass className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Open Rate</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0}%
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-violet-500" />
          </div>
        </Card>
      </motion.div>

      {/* Create Broadcast Card */}
      <motion.div variants={itemVariants}>
        <Card glass>
          <CardHeader divider>
            <CardTitle>Create New Broadcast</CardTitle>
            <CardDescription>Send a notification to platform users</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Notification Title"
              placeholder="e.g., New Course Available!"
              value={broadcastTitle}
              onChange={(e) => setBroadcastTitle(e.target.value)}
            />
            <Textarea
              label="Message"
              placeholder="Write your notification message..."
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              rows={4}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Target Audience"
                options={targetOptions}
                value={broadcastTarget}
                onValueChange={setBroadcastTarget}
              />
              <Input
                label="Optional Link"
                placeholder="https://..."
                value={broadcastLink}
                onChange={(e) => setBroadcastLink(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between rounded-xl bg-gray-50/50 p-4 dark:bg-gray-800/30">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Schedule Send</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Set a specific date and time for delivery</p>
              </div>
              <Switch checked={scheduleSend} onCheckedChange={setScheduleSend} />
            </div>
            {scheduleSend && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Date" type="date" />
                <Input label="Time" type="time" />
              </div>
            )}
          </CardContent>
          <CardFooter className="justify-end gap-3">
            <Button variant="ghost">Save as Draft</Button>
            <Button variant="primary" leftIcon={<Send className="h-4 w-4" />}>
              {scheduleSend ? 'Schedule Broadcast' : 'Send Now'}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Broadcast History */}
      <motion.div variants={itemVariants}>
        <Card glass>
          <CardHeader divider>
            <div className="flex items-center justify-between">
              <CardTitle>Broadcast History</CardTitle>
              <Badge variant="secondary" size="sm">{broadcastHistory.length} broadcasts</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {broadcastHistory.map((broadcast, idx) => {
              const openRate = broadcast.sent > 0 ? Math.round((broadcast.opened / broadcast.sent) * 100) : 0;
              const clickRate = broadcast.opened > 0 ? Math.round((broadcast.clicked / broadcast.sent) * 100) : 0;

              return (
                <motion.div
                  key={broadcast.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="rounded-xl border border-gray-100 bg-white p-4 transition-all hover:shadow-sm dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-xl',
                        broadcast.status === 'completed' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400'
                          : 'bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400',
                      )}>
                        {broadcast.status === 'completed' ? <Send className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{broadcast.title}</h4>
                          <Badge variant={broadcast.status === 'completed' ? 'success' : 'warning'} size="sm">
                            {broadcast.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          To: {getTargetLabel(broadcast.target)}
                          {broadcast.sentAt && ` | Sent: ${new Date(broadcast.sentAt).toLocaleDateString()}`}
                          {broadcast.scheduledFor && ` | Scheduled: ${new Date(broadcast.scheduledFor).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{broadcast.message}</p>
                  {broadcast.status === 'completed' && broadcast.sent > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-lg bg-gray-50 p-2 text-center dark:bg-gray-800/50">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Sent</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{broadcast.sent.toLocaleString()}</p>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-2 text-center dark:bg-gray-800/50">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Opened ({openRate}%)</p>
                        <div className="h-1.5 mt-1 rounded-full bg-gray-200 dark:bg-gray-700">
                          <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${openRate}%` }} />
                        </div>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-2 text-center dark:bg-gray-800/50">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Clicked ({clickRate}%)</p>
                        <div className="h-1.5 mt-1 rounded-full bg-gray-200 dark:bg-gray-700">
                          <div className="h-1.5 rounded-full bg-amber-500" style={{ width: `${clickRate}%` }} />
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* Performance Chart */}
      <motion.div variants={itemVariants}>
        <Card glass>
          <CardHeader divider>
            <CardTitle>Notification Performance</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb',
                      background: 'rgba(255,255,255,0.9)',
                      backdropFilter: 'blur(12px)',
                    }}
                  />
                  <Bar dataKey="sent" name="Sent" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="opened" name="Opened" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="clicked" name="Clicked" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Create Broadcast Modal */}
      <Modal open={showCreateModal} onOpenChange={setShowCreateModal} size="xl">
        <ModalHeader>
          <ModalTitle>New Broadcast</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Input label="Title" placeholder="e.g., New Year Sale!" />
            <Textarea label="Message" placeholder="Write your notification message..." rows={4} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Select label="Target Audience" options={targetOptions} placeholder="Select audience" />
              <Input label="Link (optional)" placeholder="https://..." />
            </div>
            <div className="flex items-center gap-4">
              <Switch label="Schedule for later" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Date" type="date" />
              <Input label="Time" type="time" />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setShowCreateModal(false)}>Cancel</Button>
          <Button variant="primary" leftIcon={<Send className="h-4 w-4" />}>Send Broadcast</Button>
        </ModalFooter>
      </Modal>
    </motion.div>
  );
}
