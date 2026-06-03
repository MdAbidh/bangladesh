'use client';

import { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  Shield,
  UserX,
  UserCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Plus,
  Download,
  ChevronDown,
  ChevronUp,
  Eye,
  Edit3,
  Trash2,
  Clock,
  BadgeCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Avatar } from '@/components/ui/avatar';
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from '@/components/ui/modal';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Pagination } from '@/components/shared/pagination';
import { EmptyState } from '@/components/shared/empty-state';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const roleOptions = [
  { value: 'all', label: 'All Roles' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'TEACHER', label: 'Teacher' },
  { value: 'STUDENT', label: 'Student' },
];

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'suspended', label: 'Suspended' },
];

const mockUsers = Array.from({ length: 50 }, (_, i) => ({
  id: `usr_${i + 1}`,
  name: ['Rahim Khan', 'Fatima Begum', 'John Smith', 'Sarah Ahmed', 'Mike Chen', 'Aisha Rahman', 'David Lee', 'Nurul Islam'][i % 8],
  email: `user${i + 1}@example.com`,
  role: (['STUDENT', 'TEACHER', 'STUDENT', 'TEACHER', 'STUDENT', 'ADMIN', 'STUDENT', 'TEACHER'] as const)[i % 8],
  status: (['active', 'active', 'active', 'active', 'inactive', 'active', 'suspended', 'active'] as const)[i % 8],
  joined: `2024-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
  courses: Math.floor(Math.random() * 20),
  revenue: Math.floor(Math.random() * 5000),
  avatarUrl: null,
}));

const pendingTeachers = [
  { id: 't_1', name: 'Dr. Hasan Ali', email: 'hasan@example.com', specialization: 'Computer Science', appliedDate: '2024-12-01', documents: true },
  { id: 't_2', name: 'Prof. Lisa Wang', email: 'lisa@example.com', specialization: 'Data Science', appliedDate: '2024-12-03', documents: true },
  { id: 't_3', name: 'Mohammad Iqbal', email: 'iqbal@example.com', specialization: 'Web Development', appliedDate: '2024-12-05', documents: false },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const pageSize = 10;
  const filteredUsers = mockUsers
    .filter((u) => activeTab === 'all' || u.status === activeTab)
    .filter((u) => roleFilter === 'all' || u.role === roleFilter)
    .filter((u) => statusFilter === 'all' || u.status === statusFilter)
    .filter((u) => !searchQuery || u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()));
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleUser = (id: string) => {
    const next = new Set(selectedUsers);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedUsers(next);
  };

  const toggleAll = () => {
    if (selectedUsers.size === paginatedUsers.length) setSelectedUsers(new Set());
    else setSelectedUsers(new Set(paginatedUsers.map((u) => u.id)));
  };

  const roleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'danger';
      case 'TEACHER': return 'secondary';
      default: return 'default';
    }
  };

  const statusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'warning';
      case 'suspended': return 'danger';
      default: return 'default';
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 p-6">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">User Management</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage users, roles, and permissions</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />}>
            Export
          </Button>
          <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setShowCreateModal(true)}>
            Add User
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-4 gap-4">
        <Card glass className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">12,847</p>
            </div>
            <Users className="h-8 w-8 text-primary-500" />
          </div>
        </Card>
        <Card glass className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Teachers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">124</p>
            </div>
            <BadgeCheck className="h-8 w-8 text-secondary-500" />
          </div>
        </Card>
        <Card glass className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending Approvals</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">12</p>
            </div>
            <Clock className="h-8 w-8 text-amber-500" />
          </div>
        </Card>
        <Card glass className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Suspended</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">8</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <TabsList variant="pills">
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
              <TabsTrigger value="suspended">Suspended</TabsTrigger>
            </TabsList>
            {selectedUsers.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">{selectedUsers.size} selected</span>
                <Button variant="outline" size="sm">Activate</Button>
                <Button variant="outline" size="sm">Deactivate</Button>
                <Button variant="danger" size="sm">Delete</Button>
              </div>
            )}
          </div>

          <TabsContent value={activeTab} className="mt-0">
            {/* Filters */}
            <div className="mb-4 flex items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  placeholder="Search by name or email..."
                  className="h-10 w-full rounded-xl border border-gray-200 bg-white/80 pl-9 pr-3 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-950/80 dark:text-gray-100"
                />
              </div>
              <Select
                options={roleOptions}
                value={roleFilter}
                onValueChange={setRoleFilter}
                triggerClassName="w-36"
              />
              <Select
                options={statusOptions}
                value={statusFilter}
                onValueChange={setStatusFilter}
                triggerClassName="w-36"
              />
            </div>

            {/* Users Table */}
            <Card glass>
              <CardContent className="p-0">
                {paginatedUsers.length === 0 ? (
                  <EmptyState icon={Users} title="No users found" description="Try adjusting your search or filters" />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-800">
                          <th className="w-10 px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedUsers.size === paginatedUsers.length && paginatedUsers.length > 0}
                              onChange={toggleAll}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600"
                            />
                          </th>
                          <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">User</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Role</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Status</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Courses</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Joined</th>
                          <th className="w-20 px-4 py-3" />
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedUsers.map((user, idx) => (
                          <motion.tr
                            key={user.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: idx * 0.03 }}
                            className={cn(
                              'border-b border-gray-50 transition-colors dark:border-gray-800/50',
                              'hover:bg-gray-50/50 dark:hover:bg-gray-800/30',
                              expandedUser === user.id && 'bg-gray-50 dark:bg-gray-800/20',
                            )}
                          >
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={selectedUsers.has(user.id)}
                                onChange={() => toggleUser(user.id)}
                                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <Avatar src={user.avatarUrl} alt={user.name} size="sm" />
                                <div>
                                  <button
                                    onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                                    className="font-medium text-gray-900 hover:text-primary-600 dark:text-gray-100 dark:hover:text-primary-400"
                                  >
                                    {user.name}
                                  </button>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant={roleBadgeVariant(user.role)} size="sm">{user.role}</Badge>
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant={statusBadgeVariant(user.status)} size="sm">{user.status}</Badge>
                            </td>
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{user.courses}</td>
                            <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{user.joined}</td>
                            <td className="px-4 py-3">
                              <DropdownMenu
                                trigger={<Button variant="ghost" size="icon-sm"><MoreHorizontal className="h-4 w-4" /></Button>}
                                align="end"
                              >
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem icon={<Eye className="h-4 w-4" />} onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem icon={<Edit3 className="h-4 w-4" />}>Edit Role</DropdownMenuItem>
                                <DropdownMenuItem icon={<Mail className="h-4 w-4" />}>Send Email</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {user.status === 'active' ? (
                                  <DropdownMenuItem icon={<UserX className="h-4 w-4" />} destructive>Deactivate</DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem icon={<UserCheck className="h-4 w-4" />}>Activate</DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem icon={<Trash2 className="h-4 w-4" />} destructive>Delete User</DropdownMenuItem>
                              </DropdownMenu>
                            </td>
                          </motion.tr>
                        ))}
                        {expandedUser && (
                          <tr className="bg-gray-50/80 dark:bg-gray-800/40">
                            <td colSpan={7} className="p-4">
                              <AnimatePresence>
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="grid grid-cols-3 gap-4 overflow-hidden"
                                >
                                  <div className="rounded-xl bg-white p-4 dark:bg-gray-900">
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Email</p>
                                    <p className="text-sm text-gray-900 dark:text-gray-100">user@example.com</p>
                                  </div>
                                  <div className="rounded-xl bg-white p-4 dark:bg-gray-900">
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Total Revenue</p>
                                    <p className="text-sm text-gray-900 dark:text-gray-100">$2,450</p>
                                  </div>
                                  <div className="rounded-xl bg-white p-4 dark:bg-gray-900">
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Last Active</p>
                                    <p className="text-sm text-gray-900 dark:text-gray-100">2 hours ago</p>
                                  </div>
                                </motion.div>
                              </AnimatePresence>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              className="mt-4"
            />
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Teacher Approval Requests */}
      <motion.div variants={itemVariants}>
        <Card glass>
          <CardHeader divider>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Teacher Approval Requests</CardTitle>
                <CardDescription>{pendingTeachers.length} pending applications</CardDescription>
              </div>
              <Badge variant="warning" size="sm">{pendingTeachers.length} New</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingTeachers.map((teacher, idx) => (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center justify-between rounded-xl bg-gray-50/50 p-4 dark:bg-gray-800/30"
              >
                <div className="flex items-center gap-3">
                  <Avatar alt={teacher.name} size="md" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{teacher.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{teacher.specialization} &middot; Applied {teacher.appliedDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!teacher.documents && (
                    <Badge variant="danger" size="sm">Missing Docs</Badge>
                  )}
                  <Button variant="ghost" size="icon-sm"><Eye className="h-4 w-4" /></Button>
                  <Button variant="success" size="sm" leftIcon={<CheckCircle2 className="h-4 w-4" />}>Approve</Button>
                  <Button variant="ghost" size="sm" leftIcon={<XCircle className="h-4 w-4" />} className="text-red-500 hover:text-red-600">Reject</Button>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Create User Modal */}
      <Modal open={showCreateModal} onOpenChange={setShowCreateModal} size="lg">
        <ModalHeader>
          <ModalTitle>Create New User</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" placeholder="John" />
              <Input label="Last Name" placeholder="Doe" />
            </div>
            <Input label="Email" type="email" placeholder="john@example.com" />
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Role"
                options={[
                  { value: 'STUDENT', label: 'Student' },
                  { value: 'TEACHER', label: 'Teacher' },
                  { value: 'ADMIN', label: 'Admin' },
                ]}
                placeholder="Select role"
              />
              <Input label="Password" type="password" placeholder="Create password" />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setShowCreateModal(false)}>Cancel</Button>
          <Button variant="primary">Create User</Button>
        </ModalFooter>
      </Modal>
    </motion.div>
  );
}
