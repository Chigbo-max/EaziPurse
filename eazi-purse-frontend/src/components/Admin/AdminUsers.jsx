import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  UsersIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import { useGetAdminUsersQuery, useUpdateAdminUserMutation } from '../../store/apiSlice';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  const { data: users, isLoading, error, refetch } = useGetAdminUsersQuery({
    search: searchTerm,
    status: statusFilter === 'all' ? undefined : statusFilter
  });

  const [updateUser, { isLoading: updateLoading }] = useUpdateAdminUserMutation();

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await updateUser({
        id: userId,
        data: { account_status: newStatus }
      }).unwrap();
      
      toast.success(`User status updated to ${newStatus}`);
      refetch();
    } catch (error) {
      toast.error('Failed to update user status');
      console.error('Update error:', error);
    }
  };

  const handleActiveToggle = async (userId, currentActive) => {
    try {
      await updateUser({
        id: userId,
        data: { is_active: !currentActive }
      }).unwrap();
      
      toast.success(`User ${currentActive ? 'deactivated' : 'activated'}`);
      refetch();
    } catch (error) {
      toast.error('Failed to update user status');
      console.error('Update error:', error);
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
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'pending':
        return <ExclamationTriangleIcon className="w-4 h-4" />;
      case 'suspended':
        return <XCircleIcon className="w-4 h-4" />;
      default:
        return <ExclamationTriangleIcon className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-white/60">Failed to load users</p>
        <p className="text-red-400 text-sm mt-2">
          Error: {error?.data?.message || error?.status || 'Unknown error'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/admin/dashboard')}
            className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 text-white" />
          </motion.button>
          <div>
            <h1 className="text-3xl font-bold text-white font-display">
              User Management
            </h1>
            <p className="text-white/60 mt-1">
              Manage user accounts and permissions
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add User
        </motion.button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-gradient p-6 rounded-2xl"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
              <input
                type="text"
                placeholder="Search users by name, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <FunnelIcon className="w-5 h-5 text-white/60" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-dark-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              style={{
                backgroundColor: '#1f2937',
                color: 'white',
              }}
            >
              <option value="all" className="bg-dark-700 text-white">All Status</option>
              <option value="active" className="bg-dark-700 text-white">Active</option>
              <option value="pending" className="bg-dark-700 text-white">Pending</option>
              <option value="suspended" className="bg-dark-700 text-white">Suspended</option>
              <option value="inactive" className="bg-dark-700 text-white">Inactive</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Users List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-gradient p-6 rounded-2xl"
      >
        <div className="space-y-4">
          {users && users.length > 0 ? (
            users.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center justify-between p-6 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center">
                    <UsersIcon className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{user.full_name}</h3>
                    <p className="text-white/60 text-sm">{user.email}</p>
                    <p className="text-white/40 text-xs">Joined: {formatDate(user.date_joined)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Wallet Balance */}
                  <div className="text-right">
                    <p className="text-white/60 text-sm">Wallet Balance</p>
                    <p className="text-white font-semibold">{formatCurrency(user.wallet_balance)}</p>
                  </div>

                  {/* Account Status */}
                  <div className="text-center">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.account_status)}`}>
                      {getStatusIcon(user.account_status)}
                      {user.account_status}
                    </div>
                    <p className="text-white/40 text-xs mt-1">
                      {user.can_operate ? 'Can Operate' : 'Restricted'}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedUser(user);
                        setShowUserModal(true);
                      }}
                      className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center hover:bg-primary-500/30 transition-colors"
                      title="View Details"
                    >
                      <EyeIcon className="w-4 h-4 text-primary-400" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleActiveToggle(user.id, user.is_active)}
                      disabled={updateLoading}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        user.is_active 
                          ? 'bg-danger-500/20 hover:bg-danger-500/30' 
                          : 'bg-success-500/20 hover:bg-success-500/30'
                      }`}
                      title={user.is_active ? 'Deactivate' : 'Activate'}
                    >
                      {user.is_active ? (
                        <XCircleIcon className="w-4 h-4 text-danger-400" />
                      ) : (
                        <CheckCircleIcon className="w-4 h-4 text-success-400" />
                      )}
                    </motion.button>

                    {/* Status Dropdown */}
                    <select
                      value={user.account_status}
                      onChange={(e) => handleStatusChange(user.id, e.target.value)}
                      disabled={updateLoading}
                      className="px-2 py-1 bg-dark-700 rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                      style={{
                        backgroundColor: '#1f2937',
                        color: 'white',
                      }}
                    >
                      <option value="active" className="bg-dark-700 text-white">Active</option>
                      <option value="pending" className="bg-dark-700 text-white">Pending</option>
                      <option value="suspended" className="bg-dark-700 text-white">Suspended</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <UsersIcon className="w-16 h-16 text-white/40 mx-auto mb-4" />
              <p className="text-white/60 text-lg">No users found</p>
              <p className="text-white/40 text-sm mt-2">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'No users have been registered yet'
                }
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowUserModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="card-gradient p-6 rounded-2xl w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">User Details</h2>
              <button
                onClick={() => setShowUserModal(false)}
                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <XCircleIcon className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white/60 text-sm">Full Name</p>
                  <p className="text-white font-medium">{selectedUser.full_name}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Email</p>
                  <p className="text-white font-medium">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Account Status</p>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(selectedUser.account_status)}`}>
                    {getStatusIcon(selectedUser.account_status)}
                    {selectedUser.account_status}
                  </div>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Wallet Balance</p>
                  <p className="text-white font-medium">{formatCurrency(selectedUser.wallet_balance)}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Date Joined</p>
                  <p className="text-white font-medium">{formatDate(selectedUser.date_joined)}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Can Operate</p>
                  <p className="text-white font-medium">{selectedUser.can_operate ? 'Yes' : 'No'}</p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowUserModal(false)}
                  className="btn-secondary"
                >
                  Close
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    // Handle edit user
                    console.log('Edit user:', selectedUser.id);
                  }}
                  className="btn-primary"
                >
                  <PencilIcon className="w-4 h-4 mr-2" />
                  Edit User
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminUsers; 