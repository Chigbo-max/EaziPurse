import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisVerticalIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data - in real app, this would come from API
  const users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+234 801 234 5678',
      status: 'active',
      balance: '₦125,000',
      joined: '2024-01-15',
      lastActive: '2 hours ago',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+234 802 345 6789',
      status: 'pending',
      balance: '₦0',
      joined: '2024-01-16',
      lastActive: '1 day ago',
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '+234 803 456 7890',
      status: 'active',
      balance: '₦75,500',
      joined: '2024-01-14',
      lastActive: '30 minutes ago',
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      phone: '+234 804 567 8901',
      status: 'suspended',
      balance: '₦0',
      joined: '2024-01-13',
      lastActive: '3 days ago',
    },
    {
      id: 5,
      name: 'David Brown',
      email: 'david@example.com',
      phone: '+234 805 678 9012',
      status: 'active',
      balance: '₦250,000',
      joined: '2024-01-12',
      lastActive: '5 hours ago',
    },
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="w-4 h-4 text-success-400" />;
      case 'pending':
        return <ExclamationTriangleIcon className="w-4 h-4 text-warning-400" />;
      case 'suspended':
        return <XCircleIcon className="w-4 h-4 text-danger-400" />;
      default:
        return <ExclamationTriangleIcon className="w-4 h-4 text-warning-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-success-500/20 text-success-400';
      case 'pending':
        return 'bg-warning-500/20 text-warning-400';
      case 'suspended':
        return 'bg-danger-500/20 text-danger-400';
      default:
        return 'bg-warning-500/20 text-warning-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white font-display">
            Users Management
          </h1>
          <p className="text-white/60 mt-2">
            Manage and monitor user accounts
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary mt-4 lg:mt-0"
        >
          Add New User
        </motion.button>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-gradient p-6 rounded-2xl"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FunnelIcon className="w-5 h-5 text-white/60" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-gradient p-6 rounded-2xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-4 text-white/60 font-medium">User</th>
                <th className="text-left py-4 px-4 text-white/60 font-medium">Contact</th>
                <th className="text-left py-4 px-4 text-white/60 font-medium">Status</th>
                <th className="text-left py-4 px-4 text-white/60 font-medium">Balance</th>
                <th className="text-left py-4 px-4 text-white/60 font-medium">Joined</th>
                <th className="text-left py-4 px-4 text-white/60 font-medium">Last Active</th>
                <th className="text-left py-4 px-4 text-white/60 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-primary-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-sm text-white/60">ID: {user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <EnvelopeIcon className="w-4 h-4 text-white/60" />
                        <span className="text-white text-sm">{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <PhoneIcon className="w-4 h-4 text-white/60" />
                        <span className="text-white/60 text-sm">{user.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(user.status)}
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-white font-medium">{user.balance}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-white/60 text-sm">{user.joined}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-white/60 text-sm">{user.lastActive}</span>
                  </td>
                  <td className="py-4 px-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <EllipsisVerticalIcon className="w-5 h-5" />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
          <div className="text-white/60 text-sm">
            Showing {filteredUsers.length} of {users.length} users
          </div>
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              Previous
            </motion.button>
            <span className="px-3 py-2 text-white font-medium">1</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              Next
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="card-gradient p-6 rounded-2xl text-center">
          <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <UserIcon className="w-6 h-6 text-primary-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">{users.length}</h3>
          <p className="text-white/60 text-sm">Total Users</p>
        </div>
        <div className="card-gradient p-6 rounded-2xl text-center">
          <div className="w-12 h-12 bg-success-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircleIcon className="w-6 h-6 text-success-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">
            {users.filter(u => u.status === 'active').length}
          </h3>
          <p className="text-white/60 text-sm">Active Users</p>
        </div>
        <div className="card-gradient p-6 rounded-2xl text-center">
          <div className="w-12 h-12 bg-warning-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <ExclamationTriangleIcon className="w-6 h-6 text-warning-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">
            {users.filter(u => u.status === 'pending').length}
          </h3>
          <p className="text-white/60 text-sm">Pending Users</p>
        </div>
        <div className="card-gradient p-6 rounded-2xl text-center">
          <div className="w-12 h-12 bg-danger-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <XCircleIcon className="w-6 h-6 text-danger-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">
            {users.filter(u => u.status === 'suspended').length}
          </h3>
          <p className="text-white/60 text-sm">Suspended Users</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Users; 