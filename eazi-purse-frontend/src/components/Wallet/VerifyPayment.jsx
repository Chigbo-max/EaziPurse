import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useVerifyFundMutation } from '../../store/apiSlice';
import toast from 'react-hot-toast';
import { showErrorMessages } from '../../utils/errorHandler';

const VerifyPayment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifyFund] = useVerifyFundMutation();
  const [verificationStatus, setVerificationStatus] = useState('verifying'); // 'verifying', 'success', 'error'

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get('reference');
      const trxref = searchParams.get('trxref');

      if (!reference && !trxref) {
        setVerificationStatus('error');
        toast.error('No payment reference found');
        return;
      }

      try {
        await verifyFund({ reference: reference || trxref }).unwrap();
        setVerificationStatus('success');
        toast.success('Payment verified successfully!');
        
        // Redirect to wallet after 3 seconds
        setTimeout(() => {
          navigate('/wallet');
        }, 3000);
      } catch (error) {
        setVerificationStatus('error');
        showErrorMessages(error, toast);
      }
    };

    verifyPayment();
  }, [searchParams, verifyFund, navigate]);

  const getStatusContent = () => {
    switch (verificationStatus) {
      case 'verifying':
        return {
          icon: <ArrowPathIcon className="w-12 h-12 text-blue-500 animate-spin" />,
          title: 'Verifying Payment',
          message: 'Please wait while we verify your payment...',
          color: 'text-blue-500'
        };
      case 'success':
        return {
          icon: <CheckCircleIcon className="w-12 h-12 text-green-500" />,
          title: 'Payment Successful!',
          message: 'Your wallet has been funded successfully.',
          color: 'text-green-500'
        };
      case 'error':
        return {
          icon: <XCircleIcon className="w-12 h-12 text-red-500" />,
          title: 'Verification Failed',
          message: 'There was an issue verifying your payment. Please contact support.',
          color: 'text-red-500'
        };
      default:
        return {
          icon: <ArrowPathIcon className="w-12 h-12 text-blue-500 animate-spin" />,
          title: 'Verifying Payment',
          message: 'Please wait while we verify your payment...',
          color: 'text-blue-500'
        };
    }
  };

  const statusContent = getStatusContent();

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-gradient p-8 rounded-2xl max-w-md w-full text-center"
      >
        <div className="flex flex-col items-center space-y-6">
          {statusContent.icon}
          
          <div>
            <h1 className={`text-2xl font-bold ${statusContent.color} mb-2`}>
              {statusContent.title}
            </h1>
            <p className="text-white/80">
              {statusContent.message}
            </p>
          </div>

          {verificationStatus === 'success' && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/wallet')}
              className="btn-primary"
            >
              Go to Wallet
            </motion.button>
          )}

          {verificationStatus === 'error' && (
            <div className="space-y-3">
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/wallet/fund')}
                className="btn-primary"
              >
                Try Again
              </motion.button>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/wallet')}
                className="btn-secondary"
              >
                Go to Wallet
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyPayment; 