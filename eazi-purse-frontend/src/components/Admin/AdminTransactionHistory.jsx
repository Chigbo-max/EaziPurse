import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { useGetAdminTransactionsQuery } from '../../store/apiSlice';
import toast from 'react-hot-toast';

const AdminTransactionHistory = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: transactions, isLoading, error } = useGetAdminTransactionsQuery({
    filter,
    search: searchTerm
  });

  const getTransactionType = (transaction) => {
    if (transaction.transaction_type === 'D') {
      return 'Deposit';
    } else if (transaction.transaction_type === 'T') {
      return 'Transfer';
    } else if (transaction.transaction_type === 'W') {
      return 'Withdrawal';
    }
    return 'Transaction';
  };

  const getTransactionIcon = (transaction) => {
    if (transaction.transaction_type === 'D') {
      return <ArrowTrendingUpIcon className="w-5 h-5 text-success-400" />;
    } else if (transaction.transaction_type === 'T') {
      return <ArrowTrendingDownIcon className="w-5 h-5 text-warning-400" />;
    }
    return <ArrowTrendingUpIcon className="w-5 h-5 text-primary-400" />;
  };

  const getTransactionColor = (transaction) => {
    if (transaction.transaction_type === 'D') {
      return 'text-success-400';
    } else if (transaction.transaction_type === 'T') {
      return 'text-warning-400';
    }
    return 'text-primary-400';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const getTransactionDescription = (transaction) => {
    if (transaction.transaction_type === 'T') {
      const senderName = transaction.sender?.full_name || transaction.sender?.email || 'Unknown';
      const receiverName = transaction.receiver?.full_name || transaction.receiver?.email || 'Unknown';
      return `${senderName} → ${receiverName}`;
    } else if (transaction.transaction_type === 'D') {
      const user = transaction.sender?.full_name || transaction.sender?.email || 'Unknown';
      return `Wallet funding by ${user}`;
    }
    return 'Transaction';
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
        <p className="text-white/60">Failed to load transaction history</p>
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
        className="flex items-center space-x-4"
      >
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
            Platform Transaction History
          </h1>
          <p className="text-white/60 mt-1">
            View all transactions across the platform
          </p>
        </div>
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
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center space-x-2">
            <FunnelIcon className="w-5 h-5 text-white/60" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-3 bg-dark-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              style={{
                backgroundColor: '#1f2937',
                color: 'white',
              }}
            >
              <option value="all" className="bg-dark-700 text-white">All Transactions</option>
              <option value="deposits" className="bg-dark-700 text-white">Deposits</option>
              <option value="transfers" className="bg-dark-700 text-white">Transfers</option>
              <option value="withdrawals" className="bg-dark-700 text-white">Withdrawals</option>
              <option value="verified" className="bg-dark-700 text-white">Verified</option>
              <option value="pending" className="bg-dark-700 text-white">Pending</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Transaction List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {transactions && transactions.length > 0 ? (
          transactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="card-gradient p-6 rounded-2xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    transaction.transaction_type === 'D'
                      ? 'bg-success-500/20' 
                      : 'bg-warning-500/20'
                  }`}>
                    {getTransactionIcon(transaction)}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">
                      {getTransactionType(transaction)}
                    </h3>
                    <p className="text-white/60 text-sm">
                      {getTransactionDescription(transaction)}
                    </p>
                    <p className="text-white/40 text-xs mt-1">
                      {formatDate(transaction.timestamp)}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`text-lg font-bold ${getTransactionColor(transaction)}`}>
                    {transaction.transaction_type === 'D' ? '+' : '-'}
                    {formatAmount(transaction.amount)}
                  </p>
                  <div className="flex items-center justify-end space-x-2 mt-2">
                    {transaction.verified ? (
                      <CheckCircleIcon className="w-4 h-4 text-success-400" />
                    ) : (
                      <XCircleIcon className="w-4 h-4 text-warning-400" />
                    )}
                    <span className={`text-xs ${
                      transaction.verified ? 'text-success-400' : 'text-warning-400'
                    }`}>
                      {transaction.verified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-white/40 text-xs mt-1">
                    Ref: {transaction.reference}
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12">
            <ClockIcon className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <p className="text-white/60 text-lg">No transactions found</p>
            <p className="text-white/40 text-sm mt-2">
              {filter === 'all' 
                ? 'No transactions have been performed on the platform yet'
                : `No ${filter} transactions found`
              }
            </p>
          </div>
        )}
      </motion.div>

      {/* Summary */}
      {transactions && transactions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-gradient p-6 rounded-2xl"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Platform Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-white/60 text-sm">Total Transactions</p>
              <p className="text-white font-semibold">{transactions.length}</p>
            </div>
            <div>
              <p className="text-white/60 text-sm">Verified</p>
              <p className="text-success-400 font-semibold">
                {transactions.filter(t => t.verified).length}
              </p>
            </div>
            <div>
              <p className="text-white/60 text-sm">Pending</p>
              <p className="text-warning-400 font-semibold">
                {transactions.filter(t => !t.verified).length}
              </p>
            </div>
            <div>
              <p className="text-white/60 text-sm">Total Volume</p>
              <p className="text-primary-400 font-semibold">
                {formatAmount(transactions.reduce((sum, t) => sum + Number(t.amount), 0))}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminTransactionHistory; 