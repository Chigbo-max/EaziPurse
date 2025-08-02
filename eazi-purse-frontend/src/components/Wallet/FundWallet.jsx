import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, CurrencyDollarIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { useFundWalletMutation } from '../../store/apiSlice';
import { useGetDashboardQuery } from '../../store/apiSlice';
import toast from 'react-hot-toast';
import { showErrorMessages } from '../../utils/errorHandler';

const FundWallet = () => {
  const [amount, setAmount] = useState('');
  const [fundWallet, { isLoading }] = useFundWalletMutation();
  const { data: dashboardData } = useGetDashboardQuery();
  const navigate = useNavigate();

  const wallet = dashboardData?.wallet;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || amount < 1000) {
      toast.error('Minimum amount is ₦1,000');
      return;
    }

    try {
      const result = await fundWallet({ amount: parseInt(amount) }).unwrap();
      
      if (result.authorization_url) {
        // Redirect to Paystack payment page
        window.location.href = result.authorization_url;
      } else {
        toast.success('Wallet funded successfully!');
        navigate('/wallet');
      }
    } catch (error) {
      showErrorMessages(error, toast);
    }
  };

  const presetAmounts = [1000, 5000, 10000, 25000, 50000, 100000];

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
            Fund Wallet
          </h1>
          <p className="text-white/60 mt-1">
            Add money to your wallet securely
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fund Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="card-gradient p-6 rounded-2xl"
        >
          <h2 className="text-xl font-bold text-white mb-6">Add Funds</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Amount (₦)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-field pr-12"
                  placeholder="Enter amount"
                  min="1000"
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <CurrencyDollarIcon className="w-5 h-5 text-white/60" />
                </div>
              </div>
              <p className="text-xs text-white/60 mt-1">
                Minimum amount: ₦1,000
              </p>
            </div>

            {/* Preset Amounts */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-3">
                Quick Amounts
              </label>
              <div className="grid grid-cols-3 gap-3">
                {presetAmounts.map((presetAmount) => (
                  <motion.button
                    key={presetAmount}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setAmount(presetAmount.toString())}
                    className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      amount === presetAmount.toString()
                        ? 'bg-primary-600 text-white'
                        : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                  >
                    ₦{presetAmount.toLocaleString()}
                  </motion.button>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading || !amount}
              className="btn-primary w-full"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                'Fund Wallet'
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Wallet Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Current Balance */}
          <div className="gold-gradient p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">Current Balance</h3>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">
                ₦{wallet?.balance || '0.00'}
              </p>
              <p className="text-white/60 text-sm mt-1">Available for transactions</p>
            </div>
          </div>

          {/* Account Details */}
          <div className="card-gradient p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">Account Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/60">Account Number</span>
                <span className="text-white font-medium">{wallet?.account_number || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Status</span>
                <span className="text-success-400 font-medium">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Last Updated</span>
                <span className="text-white/80 text-sm">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="success-gradient p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-3">Security Notice</h3>
            <ul className="text-white/80 text-sm space-y-2">
              <li>• All transactions are secured with bank-level encryption</li>
              <li>• Your funds are protected by our security protocols</li>
                              <li>• You&apos;ll receive instant confirmation for all transactions</li>
              <li>• 24/7 customer support available</li>
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Payment Methods Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card-gradient p-6 rounded-2xl"
      >
        <h2 className="text-xl font-bold text-white mb-4">Payment Methods</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-xl p-4">
            <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center mb-3">
              <CreditCardIcon className="w-6 h-6 text-primary-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Debit/Credit Card</h3>
            <p className="text-white/60 text-sm">
              Secure payment processing via Paystack
            </p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="w-12 h-12 bg-success-500/20 rounded-full flex items-center justify-center mb-3">
              <CurrencyDollarIcon className="w-6 h-6 text-success-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Bank Transfer</h3>
            <p className="text-white/60 text-sm">
              Direct bank transfer to your account
            </p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="w-12 h-12 bg-warning-500/20 rounded-full flex items-center justify-center mb-3">
              <CurrencyDollarIcon className="w-6 h-6 text-warning-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">USSD</h3>
            <p className="text-white/60 text-sm">
              Quick payment via USSD codes
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FundWallet; 