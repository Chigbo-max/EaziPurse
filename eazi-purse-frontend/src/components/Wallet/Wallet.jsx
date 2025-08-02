import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CreditCardIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { useGetDashboardQuery } from '../../store/apiSlice';

const Wallet = () => {
  const { data: dashboardData, isLoading } = useGetDashboardQuery();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const wallet = dashboardData?.wallet;

  const actions = [
    {
      name: 'Fund Wallet',
      description: 'Add money to your wallet',
      icon: ArrowDownIcon,
      color: 'success',
              href: '/wallet/fund',
    },
    {
      name: 'Transfer Money',
      description: 'Send money to other users',
      icon: ArrowUpIcon,
      color: 'warning',
      href: '/transfer',
    },
    {
      name: 'Transaction History',
      description: 'View your latest 4 transactions',
      icon: ClockIcon,
      color: 'primary',
      href: '/wallet/history',
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
            My Wallet
          </h1>
          <p className="text-white/60 mt-2">
            Manage your finances with ease
          </p>
        </div>
      </motion.div>

      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="gold-gradient p-8 rounded-2xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 to-gold-600/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-white/60 text-sm">Current Balance</p>
              <h2 className="text-4xl font-bold text-white mt-1">
                ₦{wallet?.balance || '0.00'}
              </h2>
            </div>
            <div className="w-16 h-16 bg-gold-500/20 rounded-full flex items-center justify-center">
              <CurrencyDollarIcon className="w-8 h-8 text-gold-400" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-white/60 text-sm">Account Number</p>
              <p className="text-white font-semibold">{wallet?.account_number || 'N/A'}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-white/60 text-sm">Status</p>
              <p className="text-success-400 font-semibold">Active</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-gradient p-6 rounded-2xl"
      >
        <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {actions.map((action, index) => (
            <motion.div
              key={action.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(action.href)}
              className="bg-white/5 hover:bg-white/10 rounded-xl p-6 cursor-pointer transition-all duration-200 border border-white/10"
            >
              <div className={`w-12 h-12 bg-${action.color}-500/20 rounded-full flex items-center justify-center mb-4`}>
                <action.icon className={`w-6 h-6 text-${action.color}-400`} />
              </div>
              <h3 className="text-white font-semibold mb-2">{action.name}</h3>
              <p className="text-white/60 text-sm">{action.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card-gradient p-6 rounded-2xl"
      >
        <h2 className="text-xl font-bold text-white mb-6">Sample Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-success-500/20 rounded-full flex items-center justify-center">
                <ArrowDownIcon className="w-5 h-5 text-success-400" />
              </div>
              <div>
                <p className="text-white font-medium">Wallet Funded</p>
                <p className="text-sm text-white/60">Today, 2:30 PM</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-success-400 font-semibold">+₦50,000</p>
              <p className="text-sm text-white/60">Completed</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-warning-500/20 rounded-full flex items-center justify-center">
                <ArrowUpIcon className="w-5 h-5 text-warning-400" />
              </div>
              <div>
                <p className="text-white font-medium">Transfer to John</p>
                <p className="text-sm text-white/60">Yesterday, 4:15 PM</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-warning-400 font-semibold">-₦25,000</p>
              <p className="text-sm text-white/60">Completed</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Security Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="success-gradient p-6 rounded-2xl"
      >
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-success-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <CreditCardIcon className="w-6 h-6 text-success-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Security Tips</h3>
            <ul className="text-white/80 text-sm space-y-1">
              <li>• Never share your account number with strangers</li>
              <li>• Enable two-factor authentication for extra security</li>
              <li>• Regularly check your transaction history</li>
              <li>• Keep your login credentials secure</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Wallet; 