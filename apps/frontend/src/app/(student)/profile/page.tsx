'use client';

import { useState } from 'react';
import { User, Mail, Lock, Bell, Trash2, Camera, Save, Loader2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Avatar } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const [avatarHover, setAvatarHover] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const [form, setForm] = useState({
    firstName: 'Alex',
    lastName: 'Johnson',
    email: 'alex.johnson@example.com',
    bio: 'Passionate frontend developer and lifelong learner. Love building beautiful, accessible web applications.',
    headline: 'Frontend Developer & React Enthusiast',
  });

  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [notifications, setNotifications] = useState({
    emailProgress: true,
    emailCertificates: true,
    emailPromotions: false,
    pushProgress: true,
    pushReminders: true,
    pushDiscussion: false,
  });

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Profile updated successfully!');
    }, 1000);
  };

  const handlePasswordChange = () => {
    if (password.new !== password.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    toast.success('Password changed successfully!');
    setPassword({ current: '', new: '', confirm: '' });
  };

  const handleDeleteAccount = () => {
    toast.error('Account deletion request submitted.');
    setDeleteConfirm('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Profile Settings</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="personal" variant="pills">
        <TabsList variant="pills">
          <TabsTrigger value="personal"><User className="h-4 w-4" /> Personal Info</TabsTrigger>
          <TabsTrigger value="password"><Lock className="h-4 w-4" /> Password</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="h-4 w-4" /> Notifications</TabsTrigger>
          <TabsTrigger value="danger"><Trash2 className="h-4 w-4" /> Danger Zone</TabsTrigger>
        </TabsList>

        {/* Personal Info */}
        <TabsContent value="personal">
          <Card glass>
            <CardContent className="p-6 space-y-6">
              {/* Avatar */}
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <div
                  className="relative"
                  onMouseEnter={() => setAvatarHover(true)}
                  onMouseLeave={() => setAvatarHover(false)}
                >
                  <Avatar src={null} alt="Profile" size="3xl" fallback="AJ" />
                  {avatarHover && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/50"
                    >
                      <Camera className="h-6 w-6 text-white" />
                    </motion.div>
                  )}
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{form.firstName} {form.lastName}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{form.headline}</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Camera className="h-4 w-4 mr-1" />
                    Change Avatar
                  </Button>
                </div>
              </div>

              {/* Form */}
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="First Name" value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} />
                <Input label="Last Name" value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} />
              </div>
              <Input label="Email" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
              <Input label="Headline" value={form.headline} onChange={e => setForm(p => ({ ...p, headline: e.target.value }))} helperText="Brief description for your profile" />
              <Textarea label="Bio" value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} rows={4} />

              <div className="flex justify-end">
                <Button variant="primary" onClick={handleSave} loading={saving} leftIcon={<Save className="h-4 w-4" />}>
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Password */}
        <TabsContent value="password">
          <Card glass>
            <CardContent className="p-6 space-y-4">
              <div className="relative">
                <Input
                  label="Current Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password.current}
                  onChange={e => setPassword(p => ({ ...p, current: e.target.value }))}
                  rightIcon={
                    <button onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                />
              </div>
              <div className="relative">
                <Input
                  label="New Password"
                  type={showNewPassword ? 'text' : 'password'}
                  value={password.new}
                  onChange={e => setPassword(p => ({ ...p, new: e.target.value }))}
                  rightIcon={
                    <button onClick={() => setShowNewPassword(!showNewPassword)} className="text-gray-400 hover:text-gray-600">
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                />
              </div>
              <Input
                label="Confirm New Password"
                type="password"
                value={password.confirm}
                onChange={e => setPassword(p => ({ ...p, confirm: e.target.value }))}
              />
              <div className="flex justify-end">
                <Button variant="primary" onClick={handlePasswordChange} disabled={!password.current || !password.new || !password.confirm}>
                  <Lock className="h-4 w-4 mr-1" />
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card glass>
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Email Notifications</h3>
                <div className="space-y-4">
                  <Switch
                    label="Course Progress"
                    description="Get weekly progress summaries for your courses"
                    checked={notifications.emailProgress}
                    onCheckedChange={v => setNotifications(p => ({ ...p, emailProgress: v }))}
                  />
                  <Switch
                    label="Certificate Awards"
                    description="Receive your certificates via email"
                    checked={notifications.emailCertificates}
                    onCheckedChange={v => setNotifications(p => ({ ...p, emailCertificates: v }))}
                  />
                  <Switch
                    label="Promotions & Updates"
                    description="Learn about new courses and special offers"
                    checked={notifications.emailPromotions}
                    onCheckedChange={v => setNotifications(p => ({ ...p, emailPromotions: v }))}
                  />
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4 dark:border-gray-800">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Push Notifications</h3>
                <div className="space-y-4">
                  <Switch
                    label="Learning Progress"
                    description="Notifications when you complete lessons"
                    checked={notifications.pushProgress}
                    onCheckedChange={v => setNotifications(p => ({ ...p, pushProgress: v }))}
                  />
                  <Switch
                    label="Reminders"
                    description="Gentle reminders to continue your learning"
                    checked={notifications.pushReminders}
                    onCheckedChange={v => setNotifications(p => ({ ...p, pushReminders: v }))}
                  />
                  <Switch
                    label="Discussion Replies"
                    description="When someone replies to your comment"
                    checked={notifications.pushDiscussion}
                    onCheckedChange={v => setNotifications(p => ({ ...p, pushDiscussion: v }))}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="primary" onClick={() => toast.success('Notification preferences saved!')}>
                  <Bell className="h-4 w-4 mr-1" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Danger Zone */}
        <TabsContent value="danger">
          <Card glass className="border-red-200 dark:border-red-900/50">
            <CardContent className="p-6 space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-950/50">
                <Trash2 className="h-7 w-7 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Delete Account</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Once you delete your account, there is no going back. Please be certain. This will permanently delete all your data, course progress, and certificates.
                </p>
              </div>
              <div className="space-y-2">
                <Input
                  label="Type DELETE to confirm"
                  value={deleteConfirm}
                  onChange={e => setDeleteConfirm(e.target.value)}
                  placeholder='Type "DELETE" to confirm'
                  error={deleteConfirm && deleteConfirm !== 'DELETE' ? 'Please type DELETE exactly' : undefined}
                />
              </div>
              <div className="flex justify-end">
                <Button
                  variant="danger"
                  disabled={deleteConfirm !== 'DELETE'}
                  onClick={handleDeleteAccount}
                  leftIcon={<Trash2 className="h-4 w-4" />}
                >
                  Delete My Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
