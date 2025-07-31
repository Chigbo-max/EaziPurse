import React from 'react';
import { motion } from 'framer-motion';
import {
  UsersIcon,
  CurrencyDollarIcon,
  CreditCardIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  // Mock data - in real app, this would come from API
  const stats = [
    {
      name: 'Total Users',
      value: '1,234',
      change: '+12%',
      changeType: 'positive',
      icon: UsersIcon,
      color: 'primary',
    },
    {
      name: 'Total Transactions',
      value: '₦45.2M',
      change: '+8%',
      changeType: 'positive',
      icon: CreditCardIcon,
      color: 'success',
    },
    {
      name: 'Active Wallets',
      value: '1,089',
      change: '+5%',
      changeType: 'positive',
      icon: CurrencyDollarIcon,
      color: 'warning',
    },
    {
      name: 'Revenue',
      value: '₦2.1M',
      change: '+15%',
      changeType: 'positive',
      icon: ChartBarIcon,
      color: 'danger',
    },
  ];

  const recentUsers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      status: 'active',
      joined: '2 hours ago',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      status: 'pending',
      joined: '4 hours ago',
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      status: 'active',
      joined: '6 hours ago',
    },
  ];

  const recentTransactions = [
    {
      id: 1,
      user: 'John Doe',
      type: 'Transfer',
      amount: '₦25,000',
      status: 'completed',
      time: '2 minutes ago',
    },
    {
      id: 2,
      user: 'Jane Smith',
      type: 'Fund',
      amount: '₦50,000',
      status: 'pending',
      time: '15 minutes ago',
    },
    {
      id: 3,
      user: 'Mike Johnson',
      type: 'Transfer',
      amount: '₦15,000',
      status: 'completed',
      time: '1 hour ago',
    },
  ];

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
            Admin Dashboard
          </h1>
          <p className="text-white/60 mt-2">
            Overview of platform statistics and activities
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 lg:mt-0"
        >
          <div className="text-right">
            <p className="text-sm text-white/60">Last updated</p>
            <p className="text-white font-medium">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            className="card-gradient p-6 rounded-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60 mb-1">{stat.name}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <div className="flex items-center mt-2">
                  {stat.changeType === 'positive' ? (
                    <ArrowTrendingUpIcon className="w-4 h-4 text-success-400 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-4 h-4 text-danger-400 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-success-400' : 'text-danger-400'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`w-12 h-12 bg-${stat.color}-500/20 rounded-full flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="card-gradient p-6 rounded-2xl"
        >
          <h2 className="text-xl font-bold text-white mb-4">Recent Users</h2>
          <div className="space-y-4">
            {recentUsers.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 bg-white/5 rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center">
                    <UsersIcon className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{user.name}</p>
                    <p className="text-sm text-white/60">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    user.status === 'active' 
                      ? 'bg-success-500/20 text-success-400' 
                      : 'bg-warning-500/20 text-warning-400'
                  }`}>
                    {user.status === 'active' ? (
                      <CheckCircleIcon className="w-3 h-3 mr-1" />
                    ) : (
                      <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                    )}
                    {user.status}
                  </div>
                  <p className="text-xs text-white/60 mt-1">{user.joined}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="card-gradient p-6 rounded-2xl"
        >
          <h2 className="text-xl font-bold text-white mb-4">Recent Transactions</h2>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 bg-white/5 rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'Transfer' ? 'bg-warning-500/20' : 'bg-success-500/20'
                  }`}>
                    {transaction.type === 'Transfer' ? (
                      <ArrowTrendingDownIcon className="w-5 h-5 text-warning-400" />
                    ) : (
                      <ArrowTrendingUpIcon className="w-5 h-5 text-success-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-white font-medium">{transaction.user}</p>
                    <p className="text-sm text-white/60">{transaction.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">{transaction.amount}</p>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                    transaction.status === 'completed' 
                      ? 'bg-success-500/20 text-success-400' 
                      : 'bg-warning-500/20 text-warning-400'
                  }`}>
                    {transaction.status}
                  </div>
                  <p className="text-xs text-white/60 mt-1">{transaction.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card-gradient p-6 rounded-2xl"
      >
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary"
          >
            View All Users
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-secondary"
          >
            Transaction History
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-success"
          >
            Generate Report
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-warning"
          >
            System Settings
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard; 