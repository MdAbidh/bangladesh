'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ScrollText,
  Search,
  Filter,
  Download,
  RefreshCw,
  MoreHorizontal,
  Eye,
  User,
  BookOpen,
  Settings,
  Shield,
  LogIn,
  LogOut,
  Trash2,
  Edit3,
  Plus,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Pagination } from '@/components/shared/pagination';
import { EmptyState } from '@/components/shared/empty-state';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const actionTypeOptions = [
  { value: 'all', label: 'All Actions' },
  { value: 'CREATE', label: 'Create' },
  { value: 'UPDATE', label: 'Update' },
  { value: 'DELETE', label: 'Delete' },
  { value: 'LOGIN', label: 'Login' },
  { value: 'LOGOUT', label: 'Logout' },
  { value: 'APPROVE', label: 'Approve' },
  { value: 'REJECT', label: 'Reject' },
];

const resourceOptions = [
  { value: 'all', label: 'All Resources' },
  { value: 'USER', label: 'User' },
  { value: 'COURSE', label: 'Course' },
  { value: 'ENROLLMENT', label: 'Enrollment' },
  { value: 'SETTINGS', label: 'Settings' },
  { value: 'ROLE', label: 'Role' },
  { value: 'PAYMENT', label: 'Payment' },
];

const logActions: Record<string, { icon: typeof Eye; color: string }> = {
  CREATE: { icon: Plus, color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-950/50' },
  UPDATE: { icon: Edit3, color: 'text-blue-600 bg-blue-100 dark:bg-blue-950/50' },
  DELETE: { icon: Trash2, color: 'text-red-600 bg-red-100 dark:bg-red-950/50' },
  LOGIN: { icon: LogIn, color: 'text-primary-600 bg-primary-100 dark:bg-primary-950/50' },
  LOGOUT: { icon: LogOut, color: 'text-gray-600 bg-gray-100 dark:bg-gray-800' },
  APPROVE: { icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-950/50' },
  REJECT: { icon: XCircle, color: 'text-red-600 bg-red-100 dark:bg-red-950/50' },
};

const mockLogs = Array.from({ length: 100 }, (_, i) => {
  const actions = ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'APPROVE', 'REJECT'] as const;
  const resources = ['USER', 'COURSE', 'ENROLLMENT', 'SETTINGS', 'ROLE', 'PAYMENT'] as const;
  const actors = ['admin@ahlearning.com', 'system', 'rahim.khan@example.com', 'fatima@example.com'][i % 4];
  const action = actions[i % actions.length];
  const resource = resources[i % resources.length];
  const details: Record<string, string> = {
    CREATE: `Created new ${resource.toLowerCase()}: #${1000 + i}`,
    UPDATE: `Updated ${resource.toLowerCase()} #${1000 + i} details`,
    DELETE: `Deleted ${resource.toLowerCase()} #${1000 + i}`,
    LOGIN: `User logged in from IP 192.168.1.${(i % 255) + 1}`,
    LOGOUT: `User logged out`,
    APPROVE: `Approved ${resource.toLowerCase()} #${1000 + i}`,
    REJECT: `Rejected ${resource.toLowerCase()} #${1000 + i}`,
  };
  return {
    id: `log_${i + 1}`,
    timestamp: new Date(2024, 5, 1, 12, 0, 0).toISOString(),
    action,
    resource,
    actor: actors,
    details: details[action],
    ip: `192.168.1.${(i % 255) + 1}`,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  };
}).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.03 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

export default function AdminAuditLogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [resourceFilter, setResourceFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const [logs, setLogs] = useState(mockLogs);
  const [realtime, setRealtime] = useState(true);

  const addRandomLog = useCallback(() => {
    const actions = ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'APPROVE'] as const;
    const resources = ['USER', 'COURSE', 'ENROLLMENT'] as const;
    const action = actions[Math.floor(Math.random() * actions.length)];
    const resource = resources[Math.floor(Math.random() * resources.length)];
    const newLog = {
      id: `log_live_${Date.now()}`,
      timestamp: new Date().toISOString(),
      action,
      resource,
      actor: 'system',
      details: `[Live] ${action} ${resource.toLowerCase()} #${Math.floor(Math.random() * 9999)}`,
      ip: '127.0.0.1',
      userAgent: 'System',
    };
    setLogs((prev) => [newLog, ...prev].slice(0, 200));
  }, []);

  useEffect(() => {
    if (!realtime) return;
    const interval = setInterval(addRandomLog, 8000 + Math.random() * 7000);
    return () => clearInterval(interval);
  }, [realtime, addRandomLog]);

  const filtered = logs.filter((log) => {
    if (actionFilter !== 'all' && log.action !== actionFilter) return false;
    if (resourceFilter !== 'all' && log.resource !== resourceFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return log.details.toLowerCase().includes(q) || log.actor.toLowerCase().includes(q) || log.id.toLowerCase().includes(q);
    }
    return true;
  });

  const pageSize = 15;
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getTimeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 p-6">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Audit Logs</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Track all platform activities and changes</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setRealtime(!realtime)}
            className={cn(
              'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              realtime
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
            )}
          >
            <span className={cn('h-2 w-2 rounded-full', realtime ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400')} />
            Live
          </button>
          <Button variant="outline" size="sm" leftIcon={<RefreshCw className="h-4 w-4" />} onClick={() => setLogs([...mockLogs])}>
            Refresh
          </Button>
          <Button variant="primary" size="sm" leftIcon={<Download className="h-4 w-4" />}>
            Export
          </Button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Search logs by details, actor, or ID..."
            className="h-10 w-full rounded-xl border border-gray-200 bg-white/80 pl-9 pr-3 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-950/80 dark:text-gray-100"
          />
        </div>
        <Select options={actionTypeOptions} value={actionFilter} onValueChange={setActionFilter} triggerClassName="w-36" />
        <Select options={resourceOptions} value={resourceFilter} onValueChange={setResourceFilter} triggerClassName="w-36" />
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-4 gap-4">
        <Card glass className="p-3">
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-primary-500" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Events</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{logs.length.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        <Card glass className="p-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Deletions (24h)</p>
              <p className="text-lg font-bold text-amber-600 dark:text-amber-400">12</p>
            </div>
          </div>
        </Card>
        <Card glass className="p-3">
          <div className="flex items-center gap-3">
            <LogIn className="h-5 w-5 text-emerald-500" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Logins (24h)</p>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">847</p>
            </div>
          </div>
        </Card>
        <Card glass className="p-3">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-red-500" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Security Events</p>
              <p className="text-lg font-bold text-red-600 dark:text-red-400">3</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Log Table */}
      <motion.div variants={itemVariants}>
        <Card glass>
          <CardContent className="p-0">
            {paginated.length === 0 ? (
              <EmptyState icon={ScrollText} title="No logs found" description="Try adjusting your filters" />
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {paginated.map((log, idx) => {
                  const actionMeta = logActions[log.action] || { icon: Activity, color: 'text-gray-600 bg-gray-100 dark:bg-gray-800' };
                  const ActionIcon = actionMeta.icon;
                  const isExpanded = expandedLog === log.id;
                  const isLive = log.id.startsWith('log_live_');

                  return (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.02 }}
                      className={cn(
                        'transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/30',
                        isLive && 'bg-primary-50/30 dark:bg-primary-950/10',
                      )}
                    >
                      <button
                        onClick={() => setExpandedLog(isExpanded ? null : log.id)}
                        className="flex w-full items-center gap-4 px-4 py-3 text-left"
                      >
                        <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', actionMeta.color)}>
                          <ActionIcon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{log.action}</span>
                            <Badge variant="default" size="sm">{log.resource}</Badge>
                            {isLive && (
                              <span className="inline-flex h-5 items-center rounded-full bg-primary-100 px-2 text-[10px] font-medium text-primary-700 dark:bg-primary-900/50 dark:text-primary-300">
                                LIVE
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{log.details}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-gray-500 dark:text-gray-400">{getTimeAgo(log.timestamp)}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">{log.actor}</p>
                        </div>
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden border-t border-gray-100 dark:border-gray-800"
                          >
                            <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-4">
                              <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Log ID</p>
                                <p className="text-sm text-gray-900 dark:text-gray-100 font-mono">{log.id}</p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Timestamp</p>
                                <p className="text-sm text-gray-900 dark:text-gray-100">{new Date(log.timestamp).toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">IP Address</p>
                                <p className="text-sm text-gray-900 dark:text-gray-100">{log.ip}</p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Actor</p>
                                <p className="text-sm text-gray-900 dark:text-gray-100">{log.actor}</p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">User Agent</p>
                                <p className="text-sm text-gray-900 dark:text-gray-100 truncate">{log.userAgent}</p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Details</p>
                                <p className="text-sm text-gray-900 dark:text-gray-100">{log.details}</p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} className="mt-4" />
      </motion.div>
    </motion.div>
  );
}
