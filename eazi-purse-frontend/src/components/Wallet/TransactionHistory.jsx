import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { useGetTransactionsQuery } from '../../store/apiSlice';

const TransactionHistory = () => {
  const navigate = useNavigate();
  const { data: transactions, isLoading, error } = useGetTransactionsQuery();
  const [filter, setFilter] = useState('all'); // 'all', 'sent', 'received', 'deposits'

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

  const getTransactionType = (transaction) => {
    if (transaction.transaction_type === 'D') {
      return 'Deposit';
    } else if (transaction.transaction_type === 'T') {
      return 'Transfer Sent';
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
    return new window.Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const filteredTransactions = transactions?.filter(transaction => {
    if (filter === 'all') return true;
    if (filter === 'sent') return transaction.transaction_type === 'T';
    if (filter === 'received') return transaction.transaction_type === 'D' && transaction.receiver;
    if (filter === 'deposits') return transaction.transaction_type === 'D';
    return true;
  }) || [];

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
          onClick={() => navigate('/wallet')}
          className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 text-white" />
        </motion.button>
        <div>
          <h1 className="text-3xl font-bold text-white font-display">
            Transaction History
          </h1>
          <p className="text-white/60 mt-1">
            View your latest 4 transfers and received funds
          </p>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-2"
      >
        {[
          { key: 'all', label: 'All Transactions' },
          { key: 'sent', label: 'Sent' },
          { key: 'received', label: 'Received' },
          { key: 'deposits', label: 'Deposits' }
        ].map((tab) => (
          <motion.button
            key={tab.key}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              filter === tab.key
                ? 'bg-primary-600 text-white'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            {tab.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Transaction List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <ClockIcon className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <p className="text-white/60 text-lg">No recent transactions found</p>
            <p className="text-white/40 text-sm mt-2">
              {filter === 'all' 
                ? 'You haven\'t made any transactions yet'
                : `No recent ${filter} transactions found`
              }
            </p>
          </div>
        ) : (
          filteredTransactions.map((transaction, index) => (
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
                      {transaction.transaction_type === 'T' 
                        ? (() => {
                            const firstName = transaction.receiver?.first_name || '';
                            const lastName = transaction.receiver?.last_name || '';
                            const fullName = `${firstName} ${lastName}`.trim();
                            const fallbackName = transaction.receiver?.username || transaction.receiver?.email || 'Unknown User';
                            return `To: ${fullName || fallbackName}`;
                          })()
                        : transaction.transaction_type === 'D' && transaction.sender
                        ? (() => {
                            const firstName = transaction.sender?.first_name || '';
                            const lastName = transaction.sender?.last_name || '';
                            const fullName = `${firstName} ${lastName}`.trim();
                            const fallbackName = transaction.sender?.username || transaction.sender?.email || 'Unknown User';
                            return `From: ${fullName || fallbackName}`;
                          })()
                        : transaction.transaction_type === 'D'
                        ? 'Wallet funding'
                        : 'Transaction'
                      }
                    </p>
                    <p className="text-white/40 text-xs mt-1">
                      {formatDate(transaction.transaction_time)}
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
        )}
      </motion.div>

      {/* Summary */}
      {filteredTransactions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-gradient p-6 rounded-2xl"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-white/60 text-sm">Total Transactions</p>
              <p className="text-white font-semibold">{filteredTransactions.length}</p>
            </div>
            <div>
              <p className="text-white/60 text-sm">Verified</p>
              <p className="text-success-400 font-semibold">
                {filteredTransactions.filter(t => t.verified).length}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TransactionHistory; 