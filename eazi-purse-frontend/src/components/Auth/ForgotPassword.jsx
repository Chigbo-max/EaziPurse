import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { showErrorMessages } from '../../utils/errorHandler';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/auth/users/reset_password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        toast.success('Password reset email sent! Check your inbox.');
      } else {
        const errorData = await response.json();
        showErrorMessages({ data: errorData }, toast);
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-dark-900 to-primary-800/20"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-md"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center"
            >
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2 font-display">
              Check Your Email
            </h1>
            <p className="text-white/60">We&apos;ve sent a password reset link to your email</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-gradient p-8 rounded-2xl shadow-2xl"
          >
            <div className="text-center space-y-4">
              <p className="text-white/80">
                We&apos;ve sent a password reset link to <strong>{email}</strong>. 
                Please check your email and click the link to reset your password.
              </p>
              
              <div className="pt-4">
                <Link 
                  to="/login" 
                  className="text-primary-400 hover:text-primary-300 font-medium"
                >
                  ← Back to Login
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-dark-900 to-primary-800/20"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center pulse-glow"
          >
            <span className="text-4xl font-bold text-white">₦</span>
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2 font-display">
            EaziPurse
          </h1>
          <p className="text-white/60">Reset Your Password</p>
        </div>

        {/* Forgot Password Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-gradient p-8 rounded-2xl shadow-2xl"
        >
          <div className="mb-6">
            <Link 
              to="/login" 
              className="inline-flex items-center text-primary-400 hover:text-primary-300 font-medium"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Login
            </Link>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Forgot Password?
          </h2>

          <p className="text-white/60 text-center mb-6">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="Enter your email address"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sending...
                </div>
              ) : (
                'Send Reset Link'
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-primary-500/20 rounded-full blur-xl"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary-600/20 rounded-full blur-xl"></div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword; 