import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
import { useGetAdminDashboardQuery } from '../../store/apiSlice';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { data: dashboardData, isLoading, error } = useGetAdminDashboardQuery();
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  
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
        <p className="text-white/60">Failed to load admin dashboard data</p>
        <p className="text-red-400 text-sm mt-2">
          Error: {error?.data?.message || error?.status || 'Unknown error'}
        </p>
      </div>
    );
  }

  // Format stats from real data
  const stats = [
    {
      name: 'Total Users',
      value: dashboardData?.total_users?.toLocaleString() || '0',
      change: '+12%',
      changeType: 'positive',
      icon: UsersIcon,
      color: 'primary',
    },
    {
      name: 'Total Transactions',
      value: dashboardData?.total_transactions?.toLocaleString() || '0',
      change: '+8%',
      changeType: 'positive',
      icon: CreditCardIcon,
      color: 'success',
    },
    {
      name: 'Active Wallets',
      value: dashboardData?.active_wallets?.toLocaleString() || '0',
      change: '+5%',
      changeType: 'positive',
      icon: CurrencyDollarIcon,
      color: 'warning',
    },
    {
      name: 'Revenue',
      value: `₦${dashboardData?.revenue?.toLocaleString() || '0'}`,
      change: '+15%',
      changeType: 'positive',
      icon: ChartBarIcon,
      color: 'danger',
    },
  ];

  // Format recent users from real data (latest 4)
  const recentUsers = dashboardData?.recent_users?.map(user => ({
    id: user.id,
    name: user.full_name || user.email,
    email: user.email,
    status: user.is_active ? 'active' : 'inactive',
    accountStatus: user.account_status || 'active',
    joined: new Date(user.date_joined).toLocaleDateString(),
  })) || [];

  // Format recent transactions from real data (latest 4)
  const recentTransactions = dashboardData?.recent_transactions?.map(transaction => {
    // For deposits, show "Self" since user is depositing into their own wallet
    let userDisplay = 'Unknown';
    if (transaction.transaction_type === 'D') {
      // For deposits, the sender is depositing into their own wallet
      userDisplay = transaction.sender?.full_name || transaction.sender?.email || 'Self';
    } else if (transaction.transaction_type === 'T') {
      // For transfers, show the sender
      userDisplay = transaction.sender?.full_name || transaction.sender?.email || 'Unknown';
    } else {
      // For other transaction types
      userDisplay = transaction.sender?.full_name || transaction.sender?.email || 'Unknown';
    }
    
    return {
      id: transaction.id,
      user: userDisplay,
      type: transaction.transaction_type === 'T' ? 'Transfer' : 'Fund',
      amount: `₦${Number(transaction.amount).toLocaleString()}`,
      status: transaction.verified ? 'completed' : 'pending',
      time: new Date(transaction.timestamp).toLocaleDateString(),
    };
  }) || [];

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
        return <CheckCircleIcon className="w-3 h-3 mr-1" />;
      case 'pending':
        return <ExclamationTriangleIcon className="w-3 h-3 mr-1" />;
      case 'suspended':
        return <ExclamationTriangleIcon className="w-3 h-3 mr-1" />;
      default:
        return <ExclamationTriangleIcon className="w-3 h-3 mr-1" />;
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Latest Users</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/admin/users')}
              className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
            >
              View All
            </motion.button>
          </div>
          <div className="space-y-4">
            {recentUsers.length > 0 ? (
              recentUsers.map((user) => (
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
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.accountStatus)}`}>
                      {getStatusIcon(user.accountStatus)}
                      {user.accountStatus}
                    </div>
                    <p className="text-xs text-white/60 mt-1">{user.joined}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <UsersIcon className="w-16 h-16 text-white/40 mx-auto mb-4" />
                <p className="text-white/60 text-lg">No recent users</p>
                <p className="text-white/40 text-sm mt-2">
                  New user registrations will appear here
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="card-gradient p-6 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Latest Transactions</h2>
                      <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/admin/transactions')}
            className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
          >
            View All
          </motion.button>
          </div>
          <div className="space-y-4">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
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
              ))
            ) : (
              <div className="text-center py-8">
                <CreditCardIcon className="w-16 h-16 text-white/40 mx-auto mb-4" />
                <p className="text-white/60 text-lg">No recent transactions</p>
                <p className="text-white/40 text-sm mt-2">
                  New transactions will appear here
                </p>
              </div>
            )}
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
            onClick={() => navigate('/admin/users')}
            className="btn-primary"
          >
            Manage Users
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/admin/transactions')}
            className="btn-secondary"
          >
            Transaction History
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/admin/settings')}
            className="btn-success"
          >
            System Settings
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={async () => {
              try {
                setIsGeneratingReport(true);
                
                // Get the auth token
                const token = localStorage.getItem('access_token');
                if (!token) {
                  throw new Error('No authentication token found');
                }
                
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/wallet/admin/report/`, {
                  method: 'GET',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                  },
                });

                if (!response.ok) {
                  const errorData = await response.json().catch(() => ({}));
                  throw new Error(errorData.message || 'Failed to generate report');
                }

                const blob = await response.blob();
                
                // Create download link
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `eazipurse_report_${new Date().toISOString().slice(0, 10)}.pdf`;
                
                // Trigger download
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Clean up
                window.URL.revokeObjectURL(url);
                
                toast.success('Report generated successfully!');
              } catch (error) {
                console.error('Failed to generate report:', error);
                toast.error(error.message || 'Failed to generate report. Please try again.');
              } finally {
                setIsGeneratingReport(false);
              }
            }}
            disabled={isGeneratingReport}
            className={`btn-warning ${isGeneratingReport ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isGeneratingReport ? 'Generating...' : 'Generate Report'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard; 