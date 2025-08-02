import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CreditCardIcon,
  UserIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { useGetDashboardQuery } from '../../store/apiSlice';

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: dashboardData, isLoading, error } = useGetDashboardQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    console.error('Dashboard error:', error);
    return (
      <div className="text-center py-12">
        <p className="text-white/60">Failed to load dashboard data</p>
        <p className="text-red-400 text-sm mt-2">
          Error: {error?.status === 401 ? 'Authentication failed. Please log in again.' : error?.data?.message || 'Unknown error'}
        </p>
      </div>
    );
  }

  const wallet = dashboardData?.wallet;
  const user = dashboardData;

  const stats = [
    {
      name: 'Current Balance',
      value: `₦${wallet?.balance || '0.00'}`,
      icon: CurrencyDollarIcon,
      color: 'primary',
      gradient: 'card-gradient',
    },
    {
      name: 'Account Number',
      value: wallet?.account_number || 'N/A',
      icon: CreditCardIcon,
      color: 'success',
      gradient: 'success-gradient',
    },
    {
      name: 'Total Transactions',
      value: dashboardData?.total_transactions || '0',
      icon: ChartBarIcon,
      color: 'warning',
      gradient: 'warning-gradient',
    },
    {
      name: 'Account Status',
      value: dashboardData?.account_status || 'Active',
      icon: UserIcon,
      color: 'success',
      gradient: 'success-gradient',
    },
  ];

  const recentTransactions = dashboardData?.recent_transactions || [];

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
            Welcome back, {user?.first_name || user?.username}!
          </h1>
          <p className="text-white/60 mt-2">
            Here's your financial overview for today
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
            className={`${stat.gradient} p-6 rounded-2xl`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60 mb-1">{stat.name}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
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
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="card-gradient p-6 rounded-2xl"
        >
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/wallet/fund')}
              className="btn-primary"
            >
              Fund Wallet
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/transfer')}
              className="btn-secondary"
            >
              Transfer Money
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/wallet/history')}
              className="btn-success"
            >
              View History
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/profile')}
              className="btn-warning"
            >
              Settings
            </motion.button>
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="card-gradient p-6 rounded-2xl"
        >
          <h2 className="text-xl font-bold text-white mb-4">Latest Transactions</h2>
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
                    transaction.type === 'Deposit' ? 'bg-success-500/20' : 'bg-warning-500/20'
                  }`}>
                    {transaction.type === 'Deposit' ? (
                      <ArrowTrendingUpIcon className="w-5 h-5 text-success-400" />
                    ) : (
                      <ArrowTrendingDownIcon className="w-5 h-5 text-warning-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-white font-medium">{transaction.type}</p>
                    <p className="text-sm text-white/60">{transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">{transaction.amount}</p>
                  <p className="text-sm text-success-400">{transaction.status}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Financial Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card-gradient p-6 rounded-2xl"
      >
        <h2 className="text-xl font-bold text-white mb-4">Financial Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-success-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <ArrowTrendingUpIcon className="w-8 h-8 text-success-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Savings Growth</h3>
            <p className="text-success-400 font-medium">
              {dashboardData?.savings_growth ? `+${Number(dashboardData.savings_growth).toFixed(1)}%` : '+0.0%'}
            </p>
            <p className="text-sm text-white/60">This month</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <ChartBarIcon className="w-8 h-8 text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Transaction Volume</h3>
            <p className="text-primary-400 font-medium">
              ₦{dashboardData?.transaction_volume ? Number(dashboardData.transaction_volume || 0).toLocaleString() : '0'}
            </p>
            <p className="text-sm text-white/60">This month</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-warning-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <CreditCardIcon className="w-8 h-8 text-warning-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Active Cards</h3>
            <p className="text-warning-400 font-medium">1</p>
            <p className="text-sm text-white/60">Linked accounts</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard; 