import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useGetLoginHistoryQuery } from '../../store/apiSlice';

const LoginHistoryModal = ({ onClose }) => {
  const { data: loginHistory, isLoading, error } = useGetLoginHistoryQuery();
  


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

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="card-gradient p-6 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Login History</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[60vh]">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-white/60">Failed to load login history</p>
                <p className="text-red-400 text-sm mt-2">
                  {error?.data?.message || 'Unknown error'}
                </p>
              </div>
            ) : loginHistory && loginHistory.length > 0 ? (
              <div className="space-y-3">
                {loginHistory.map((login, index) => (
                  <motion.div
                    key={login.id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        login.success ? 'bg-success-500/20' : 'bg-danger-500/20'
                      }`}>
                        {login.success ? (
                          <CheckCircleIcon className="w-5 h-5 text-success-400" />
                        ) : (
                          <XCircleIcon className="w-5 h-5 text-danger-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {login.success ? 'Successful Login' : 'Failed Login'}
                        </p>
                        <p className="text-sm text-white/60">
                          {login.ip_address || 'Unknown IP'} • {login.user_agent || 'Unknown Device'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white/80 text-sm">
                        {formatDate(login.timestamp)}
                      </p>
                      <p className={`text-xs ${
                        login.success ? 'text-success-400' : 'text-danger-400'
                      }`}>
                        {login.success ? 'Success' : 'Failed'}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ClockIcon className="w-16 h-16 text-white/40 mx-auto mb-4" />
                <p className="text-white/60 text-lg">No recent login history found</p>
                <p className="text-white/40 text-sm mt-2">
                  Your recent login activity will appear here
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="btn-secondary w-full"
            >
              Close
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoginHistoryModal; 