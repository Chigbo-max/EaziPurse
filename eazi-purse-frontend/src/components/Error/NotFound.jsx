import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-dark-900 to-primary-800/20"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative text-center max-w-md"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center"
        >
          <span className="text-4xl font-bold text-white">₦</span>
        </motion.div>

        {/* Error Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-gradient p-8 rounded-2xl shadow-2xl"
        >
          <h1 className="text-6xl font-bold text-white mb-4">404</h1>
          <h2 className="text-2xl font-bold text-white mb-4">Page Not Found</h2>
          <p className="text-white/60 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(-1)}
              className="btn-secondary flex items-center justify-center"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Go Back
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/dashboard')}
              className="btn-primary flex items-center justify-center"
            >
              <HomeIcon className="w-5 h-5 mr-2" />
              Go Home
            </motion.button>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-primary-500/20 rounded-full blur-xl"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary-600/20 rounded-full blur-xl"></div>
      </motion.div>
    </div>
  );
};

export default NotFound; 