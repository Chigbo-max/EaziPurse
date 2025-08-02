import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  CreditCardIcon,
  ArrowTrendingUpIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { useGetAdminAnalyticsQuery } from '../../store/apiSlice';

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const { data: analyticsData, isLoading, error } = useGetAdminAnalyticsQuery(selectedPeriod);

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
        <p className="text-white/60">Failed to load analytics data</p>
        <p className="text-red-400 text-sm mt-2">
          Error: {error?.data?.message || error?.status || 'Unknown error'}
        </p>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-NG').format(num);
  };

  const getGrowthIcon = (value) => {
    return value >= 0 ? (
      <ArrowUpIcon className="w-4 h-4 text-success-400" />
    ) : (
      <ArrowDownIcon className="w-4 h-4 text-danger-400" />
    );
  };

  const getGrowthColor = (value) => {
    return value >= 0 ? 'text-success-400' : 'text-danger-400';
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
            Analytics Dashboard
          </h1>
          <p className="text-white/60 mt-2">
            Real-time insights and performance metrics for {selectedPeriod === 'today' ? 'today' : selectedPeriod === 'week' ? 'this week' : selectedPeriod === 'month' ? 'this month' : 'this year'}
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 lg:mt-0">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 bg-dark-700 rounded-lg text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary-500"
            style={{
              backgroundColor: '#1f2937',
              color: 'white',
            }}
          >
            <option value="today" className="bg-dark-700 text-white">Today</option>
            <option value="week" className="bg-dark-700 text-white">This Week</option>
            <option value="month" className="bg-dark-700 text-white">This Month</option>
            <option value="year" className="bg-dark-700 text-white">This Year</option>
          </select>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* Total Users */}
        <div className="card-gradient p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">
                {formatNumber(analyticsData?.user_analytics?.total_users || 0)}
              </p>
              <div className="flex items-center mt-2">
                {getGrowthIcon(analyticsData?.user_analytics?.user_growth_rate || 0)}
                <span className={`text-sm ml-1 ${getGrowthColor(analyticsData?.user_analytics?.user_growth_rate || 0)}`}>
                  {analyticsData?.user_analytics?.user_growth_rate?.toFixed(1) || 0}%
                </span>
              </div>
            </div>
            <UsersIcon className="w-8 h-8 text-primary-400" />
          </div>
        </div>

        {/* Total Transactions */}
        <div className="card-gradient p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total Transactions</p>
              <p className="text-2xl font-bold text-white">
                {formatNumber(analyticsData?.transaction_analytics?.total_transactions || 0)}
              </p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-white/60">
                  {formatCurrency(analyticsData?.transaction_analytics?.avg_transaction_value || 0)} avg
                </span>
              </div>
            </div>
            <CreditCardIcon className="w-8 h-8 text-success-400" />
          </div>
        </div>

        {/* Total Volume */}
        <div className="card-gradient p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total Volume</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(analyticsData?.transaction_analytics?.total_volume || 0)}
              </p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-white/60">
                  {formatCurrency(analyticsData?.transaction_analytics?.volume_today || 0)} today
                </span>
              </div>
            </div>
            <CurrencyDollarIcon className="w-8 h-8 text-warning-400" />
          </div>
        </div>

        {/* Revenue */}
        <div className="card-gradient p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Platform Revenue</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(analyticsData?.revenue_analytics?.total_revenue || 0)}
              </p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-white/60">
                  {formatCurrency(analyticsData?.revenue_analytics?.revenue_today || 0)} today
                </span>
              </div>
            </div>
            <ArrowTrendingUpIcon className="w-8 h-8 text-danger-400" />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Types Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="card-gradient p-6 rounded-2xl"
        >
          <h2 className="text-xl font-bold text-white mb-6">Transaction Types</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-success-400 rounded-full"></div>
                <span className="text-white">Deposits</span>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">
                  {formatNumber(analyticsData?.transaction_types?.deposits || 0)}
                </p>
                <p className="text-white/60 text-sm">
                  {analyticsData?.transaction_types?.deposits_percentage?.toFixed(1) || 0}%
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-warning-400 rounded-full"></div>
                <span className="text-white">Transfers</span>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">
                  {formatNumber(analyticsData?.transaction_types?.transfers || 0)}
                </p>
                <p className="text-white/60 text-sm">
                  {analyticsData?.transaction_types?.transfers_percentage?.toFixed(1) || 0}%
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-danger-400 rounded-full"></div>
                <span className="text-white">Withdrawals</span>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">
                  {formatNumber(analyticsData?.transaction_types?.withdrawals || 0)}
                </p>
                <p className="text-white/60 text-sm">
                  {analyticsData?.transaction_types?.withdrawals_percentage?.toFixed(1) || 0}%
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* System Health */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="card-gradient p-6 rounded-2xl"
        >
          <h2 className="text-xl font-bold text-white mb-6">System Health</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white">Uptime</span>
              <span className="text-success-400 font-semibold">
                {analyticsData?.system_health?.uptime || '99.9%'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">Response Time</span>
              <span className="text-white font-semibold">
                {analyticsData?.system_health?.response_time || '120ms'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">Error Rate</span>
              <span className="text-warning-400 font-semibold">
                {analyticsData?.system_health?.error_rate || '0.1%'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">Active Sessions</span>
              <span className="text-white font-semibold">
                {analyticsData?.system_health?.active_sessions || 0}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Top Users */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card-gradient p-6 rounded-2xl"
      >
        <h2 className="text-xl font-bold text-white mb-6">Top Performing Users</h2>
        <div className="space-y-4">
          {analyticsData?.top_users?.length > 0 ? (
            analyticsData.top_users.map((user, index) => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center">
                    <span className="text-primary-400 font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{user.name}</p>
                    <p className="text-white/60 text-sm">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">
                    {formatCurrency(user.total_volume)}
                  </p>
                  <p className="text-white/60 text-sm">
                    {user.transaction_count} transactions
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <UsersIcon className="w-16 h-16 text-white/40 mx-auto mb-4" />
              <p className="text-white/60">No transaction data available</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Daily Activity Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card-gradient p-6 rounded-2xl"
      >
        <h2 className="text-xl font-bold text-white mb-6">Daily Activity (Last 7 Days)</h2>
        <div className="space-y-4">
          {analyticsData?.daily_activity?.map((day, index) => (
            <div key={day.date} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div>
                <p className="text-white font-medium">
                  {new Date(day.date).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="text-white/60 text-sm">
                  {day.transactions} transactions
                </p>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">
                  {formatCurrency(day.volume)}
                </p>
                <p className="text-white/60 text-sm">Volume</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics; 