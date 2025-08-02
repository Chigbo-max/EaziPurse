import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, UserIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { useTransferFundMutation, useGetDashboardQuery } from '../../store/apiSlice';
import toast from 'react-hot-toast';
import { showErrorMessages } from '../../utils/errorHandler';

const Transfer = () => {
  const [formData, setFormData] = useState({
    account_number: '',
    amount: '',
  });
  const [transferFund, { isLoading }] = useTransferFundMutation();
  const { data: dashboardData } = useGetDashboardQuery();
  const navigate = useNavigate();

  const wallet = dashboardData?.wallet;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.account_number || !formData.amount) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.amount < 1000) {
      toast.error('Minimum transfer amount is ₦1,000');
      return;
    }

    if (parseFloat(formData.amount) > parseFloat(wallet?.balance || 0)) {
      toast.error('Insufficient balance');
      return;
    }

    try {
      await transferFund({
        account_number: formData.account_number,
        amount: parseInt(formData.amount),
      }).unwrap();
      
      toast.success('Transfer completed successfully!');
      navigate('/wallet');
    } catch (error) {
      showErrorMessages(error, toast);
    }
  };

  const presetAmounts = [1000, 5000, 10000, 25000, 50000];

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
            Transfer Money
          </h1>
          <p className="text-white/60 mt-1">
            Send money to other EaziPurse users
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transfer Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="card-gradient p-6 rounded-2xl"
        >
          <h2 className="text-xl font-bold text-white mb-6">Transfer Details</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Recipient Account Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="account_number"
                  value={formData.account_number}
                  onChange={handleChange}
                  className="input-field pr-12"
                  placeholder="Enter account number"
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <UserIcon className="w-5 h-5 text-white/60" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Amount (₦)
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
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
                    onClick={() => setFormData({ ...formData, amount: presetAmount.toString() })}
                    className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      formData.amount === presetAmount.toString()
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
              disabled={isLoading || !formData.account_number || !formData.amount}
              className="btn-warning w-full"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                'Send Money'
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Account Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Current Balance */}
          <div className="gold-gradient p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">Available Balance</h3>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">
                ₦{wallet?.balance || '0.00'}
              </p>
              <p className="text-white/60 text-sm mt-1">Available for transfer</p>
            </div>
          </div>

          {/* Transfer Guidelines */}
          <div className="card-gradient p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">Transfer Guidelines</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-white/80 text-sm">
                  Ensure the recipient account number is correct
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-white/80 text-sm">
                  Minimum transfer amount is ₦1,000
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-white/80 text-sm">
                  Transfers are instant and cannot be reversed
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-white/80 text-sm">
                  You&apos;ll receive a confirmation email
                </p>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="warning-gradient p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-3">Security Notice</h3>
            <ul className="text-white/80 text-sm space-y-2">
              <li>• Double-check the account number before sending</li>
              <li>• Only transfer to trusted recipients</li>
              <li>• Keep your transfer history for reference</li>
              <li>• Contact support if you notice any issues</li>
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Transfer History Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card-gradient p-6 rounded-2xl"
      >
        <h2 className="text-xl font-bold text-white mb-4">Recent Transfers</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-warning-500/20 rounded-full flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-warning-400" />
              </div>
              <div>
                <p className="text-white font-medium">John Doe</p>
                <p className="text-sm text-white/60">Account: 1234567890</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-warning-400 font-semibold">-₦25,000</p>
              <p className="text-sm text-white/60">Yesterday</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-warning-500/20 rounded-full flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-warning-400" />
              </div>
              <div>
                <p className="text-white font-medium">Jane Smith</p>
                <p className="text-sm text-white/60">Account: 0987654321</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-warning-400 font-semibold">-₦15,000</p>
              <p className="text-sm text-white/60">2 days ago</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Transfer; 