'use client';

import { useState } from 'react';
import {
  Settings as SettingsIcon,
  Save,
  RotateCcw,
  Globe,
  Mail,
  Lock,
  Shield,
  Bell,
  Palette,
  CreditCard,
  Server,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

const systemHealthItems = [
  { label: 'API Server', status: 'operational', uptime: '99.98%', latency: '45ms' },
  { label: 'Database', status: 'operational', uptime: '99.99%', latency: '12ms' },
  { label: 'Cache (Redis)', status: 'degraded', uptime: '97.2%', latency: '8ms' },
  { label: 'File Storage', status: 'operational', uptime: '99.95%', latency: '120ms' },
  { label: 'Email Service', status: 'operational', uptime: '99.9%', latency: '350ms' },
  { label: 'CDN', status: 'operational', uptime: '100%', latency: '28ms' },
];

const currencyOptions = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'BDT', label: 'BDT (৳)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'INR', label: 'INR (₹)' },
];

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'bn', label: 'Bengali' },
  { value: 'hi', label: 'Hindi' },
  { value: 'ar', label: 'Arabic' },
];

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [showSMTPPassword, setShowSMTPPassword] = useState(false);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 p-6">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Platform Settings</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Configure global platform settings</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" leftIcon={<RotateCcw className="h-4 w-4" />}>
            Reset
          </Button>
          <Button variant="primary" size="sm" leftIcon={<Save className="h-4 w-4" />}>
            Save Changes
          </Button>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <motion.div variants={itemVariants}>
          <TabsList variant="pills" className="mb-6">
            <TabsTrigger value="general" icon={<SettingsIcon className="h-4 w-4" />}>General</TabsTrigger>
            <TabsTrigger value="email" icon={<Mail className="h-4 w-4" />}>Email</TabsTrigger>
            <TabsTrigger value="courses" icon={<Globe className="h-4 w-4" />}>Course Defaults</TabsTrigger>
            <TabsTrigger value="security" icon={<Lock className="h-4 w-4" />}>Security</TabsTrigger>
            <TabsTrigger value="features" icon={<Bell className="h-4 w-4" />}>Features</TabsTrigger>
            <TabsTrigger value="health" icon={<Server className="h-4 w-4" />}>System Health</TabsTrigger>
          </TabsList>
        </motion.div>

        {/* General Settings */}
        <TabsContent value="general">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            <Card glass>
              <CardHeader divider>
                <CardTitle>General Information</CardTitle>
                <CardDescription>Basic platform details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input label="Platform Name" defaultValue="A.H Learning App" />
                <Input label="Tagline" defaultValue="Learn Anytime, Anywhere" />
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                  <textarea
                    defaultValue="A comprehensive online learning platform offering courses in web development, data science, design, and more."
                    className="flex min-h-[80px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Platform Logo</label>
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-amber-500 text-xl font-bold text-white">AH</div>
                    <Button variant="outline" size="sm">Upload New Logo</Button>
                    <Button variant="ghost" size="sm">Remove</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card glass>
              <CardHeader divider>
                <CardTitle>Localization</CardTitle>
                <CardDescription>Regional and language settings</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <Select label="Default Currency" options={currencyOptions} value="USD" />
                <Select label="Default Language" options={languageOptions} value="en" />
                <Input label="Timezone" defaultValue="Asia/Dhaka" />
                <Input label="Date Format" defaultValue="MMM d, yyyy" />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email">
          <Card glass>
            <CardHeader divider>
              <CardTitle>SMTP Configuration</CardTitle>
              <CardDescription>Configure email delivery settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="SMTP Host" defaultValue="smtp.sendgrid.net" />
                <Input label="SMTP Port" defaultValue="587" type="number" />
                <Input label="SMTP Username" defaultValue="apikey" />
                <div className="relative">
                  <Input
                    label="SMTP Password"
                    type={showSMTPPassword ? 'text' : 'password'}
                    defaultValue="SG.xxxxxxxxxxxxxxxx"
                  />
                  <button
                    onClick={() => setShowSMTPPassword(!showSMTPPassword)}
                    className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showSMTPPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Input label="From Email" defaultValue="noreply@ahlearning.com" />
              <Input label="From Name" defaultValue="A.H Learning" />
              <div className="flex items-center gap-3 pt-2">
                <Button variant="outline" size="sm" leftIcon={<RefreshCw className="h-4 w-4" />}>
                  Test Connection
                </Button>
                <span className="flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" /> Last test successful
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Course Defaults */}
        <TabsContent value="courses">
          <Card glass>
            <CardHeader divider>
              <CardTitle>Course Default Settings</CardTitle>
              <CardDescription>Default values for new courses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Select label="Default Currency" options={currencyOptions} value="USD" />
                <Select label="Default Language" options={languageOptions} value="en" />
                <Input label="Default Price" defaultValue="49.99" type="number" step="0.01" prefix="$" />
                <Input label="Max Lessons per Course" defaultValue="100" type="number" />
              </div>
              <div className="space-y-3 pt-2">
                <Switch label="Auto-publish courses" description="New courses are published without admin review" defaultChecked={false} />
                <Switch label="Allow free courses" description="Teachers can set price to $0" defaultChecked />
                <Switch label="Enable course coupons" description="Teachers can create discount coupons" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <div className="space-y-6">
            <Card glass>
              <CardHeader divider>
                <CardTitle>Rate Limits</CardTitle>
                <CardDescription>API and request rate limiting</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <Input label="API Requests (per minute)" defaultValue="60" type="number" />
                <Input label="Login Attempts (per hour)" defaultValue="5" type="number" />
                <Input label="File Upload Size (MB)" defaultValue="500" type="number" />
                <Input label="Concurrent Sessions" defaultValue="3" type="number" />
              </CardContent>
            </Card>

            <Card glass>
              <CardHeader divider>
                <CardTitle>Session & Auth</CardTitle>
                <CardDescription>Authentication and session settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="Session Timeout (minutes)" defaultValue="60" type="number" />
                  <Input label="JWT Expiration (hours)" defaultValue="24" type="number" />
                </div>
                <div className="space-y-3 pt-2">
                  <Switch label="Two-factor authentication" description="Require 2FA for all admin accounts" defaultChecked />
                  <Switch label="Email verification required" description="Users must verify email before accessing platform" defaultChecked />
                  <Switch label="IP whitelist for admin" description="Restrict admin access to specific IPs" defaultChecked={false} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Feature Toggles */}
        <TabsContent value="features">
          <Card glass>
            <CardHeader divider>
              <CardTitle>Feature Toggles</CardTitle>
              <CardDescription>Enable or disable platform features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Switch label="Course Certificates" description="Generate certificates upon course completion" defaultChecked />
              <Switch label="Discussion Forums" description="Enable course-level discussion boards" defaultChecked />
              <Switch label="Live Classes" description="Zoom/Google Meet integration for live sessions" defaultChecked />
              <Switch label="AI Recommendations" description="AI-powered course recommendations" defaultChecked={false} />
              <Switch label="Gamification" description="Points, badges, and leaderboards" defaultChecked />
              <Switch label="Wishlist" description="Allow users to save courses to wishlist" defaultChecked />
              <Switch label="Mobile App Access" description="Enable mobile app API access" defaultChecked />
              <Switch label="Multi-language Support" description="Platform UI translations" defaultChecked />
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Health */}
        <TabsContent value="health">
          <Card glass>
            <CardHeader divider>
              <CardTitle>System Health Status</CardTitle>
              <CardDescription>Real-time status of all platform services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemHealthItems.map((item, idx) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between rounded-xl bg-gray-50/50 p-4 dark:bg-gray-800/30"
                  >
                    <div className="flex items-center gap-3">
                      {item.status === 'operational' ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : item.status === 'degraded' ? (
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.label}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Uptime: {item.uptime} &middot; Latency: {item.latency}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={item.status === 'operational' ? 'success' : item.status === 'degraded' ? 'warning' : 'danger'}
                      size="sm"
                    >
                      {item.status}
                    </Badge>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between rounded-xl border border-dashed border-gray-200 p-4 dark:border-gray-700">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <RefreshCw className="h-4 w-4" />
                  Last checked: 2 minutes ago
                </div>
                <Button variant="outline" size="sm">Run Health Check</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
