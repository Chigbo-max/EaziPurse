import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DocumentTextIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  UsersIcon,
  CalendarIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { useGetAdminAnalyticsQuery } from '../../store/apiSlice';
import toast from 'react-hot-toast';

const Reports = () => {
  const { data: analyticsData, isLoading, error } = useGetAdminAnalyticsQuery();
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [dateRange, setDateRange] = useState('month');

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
        <p className="text-white/60">Failed to load reports data</p>
        <p className="text-red-400 text-sm mt-2">
          Error: {error?.data?.message || error?.status || 'Unknown error'}
        </p>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-NG').format(num);
  };

  const generateReport = async (reportType) => {
    try {
      setIsDownloading(true);
      
      // Get the auth token
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // Make the request directly without going through Redux
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/admin/reports/download/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          report_type: reportType,
          date_range: dateRange,
        }),
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
      link.download = `${reportType.replace(/ /g, '_')}_${dateRange}_${new Date().toISOString().slice(0, 10)}.pdf`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      window.URL.revokeObjectURL(url);
      
      toast.success(`${reportType} downloaded successfully!`);
    } catch (error) {
      console.error('Failed to download report:', error);
      toast.error(error.message || 'Failed to download report. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const reports = [
    {
      id: 'user-activity',
      title: 'User Activity Report',
      description: 'Comprehensive user registration and activity analysis',
      icon: UsersIcon,
      color: 'primary',
      metrics: [
        { label: 'Total Users', value: formatNumber(analyticsData?.user_analytics?.total_users || 0) },
        { label: 'Active Users', value: formatNumber(analyticsData?.user_analytics?.active_users || 0) },
        { label: 'New Users (Month)', value: formatNumber(analyticsData?.user_analytics?.new_users_month || 0) },
      ]
    },
    {
      id: 'transaction-summary',
      title: 'Transaction Summary Report',
      description: 'Detailed transaction volume and type breakdown',
      icon: CurrencyDollarIcon,
      color: 'success',
      metrics: [
        { label: 'Total Transactions', value: formatNumber(analyticsData?.transaction_analytics?.total_transactions || 0) },
        { label: 'Total Volume', value: formatCurrency(analyticsData?.transaction_analytics?.total_volume || 0) },
        { label: 'Avg Transaction', value: formatCurrency(analyticsData?.transaction_analytics?.avg_transaction_value || 0) },
      ]
    },
    {
      id: 'revenue-analysis',
      title: 'Revenue Analysis Report',
      description: 'Platform revenue and financial performance metrics',
      icon: ChartBarIcon,
      color: 'warning',
      metrics: [
        { label: 'Total Revenue', value: formatCurrency(analyticsData?.revenue_analytics?.total_revenue || 0) },
        { label: 'Monthly Revenue', value: formatCurrency(analyticsData?.revenue_analytics?.revenue_month || 0) },
        { label: 'Daily Revenue', value: formatCurrency(analyticsData?.revenue_analytics?.revenue_today || 0) },
      ]
    },
    {
      id: 'system-performance',
      title: 'System Performance Report',
      description: 'Platform uptime, response times, and system health',
      icon: ClockIcon,
      color: 'danger',
      metrics: [
        { label: 'Uptime', value: analyticsData?.system_health?.uptime || '99.9%' },
        { label: 'Response Time', value: analyticsData?.system_health?.response_time || '120ms' },
        { label: 'Active Sessions', value: formatNumber(analyticsData?.system_health?.active_sessions || 0) },
      ]
    }
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'primary':
        return 'bg-primary-500/20 text-primary-400 border-primary-500/30';
      case 'success':
        return 'bg-success-500/20 text-success-400 border-success-500/30';
      case 'warning':
        return 'bg-warning-500/20 text-warning-400 border-warning-500/30';
      case 'danger':
        return 'bg-danger-500/20 text-danger-400 border-danger-500/30';
      default:
        return 'bg-primary-500/20 text-primary-400 border-primary-500/30';
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
            Reports & Analytics
          </h1>
          <p className="text-white/60 mt-2">
            Generate comprehensive reports and insights
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 lg:mt-0">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 bg-white/10 rounded-lg text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </motion.div>

      {/* Reports Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {reports.map((report, index) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            className="card-gradient p-6 rounded-2xl"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getColorClasses(report.color)}`}>
                  <report.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{report.title}</h3>
                  <p className="text-white/60 text-sm">{report.description}</p>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="space-y-3 mb-6">
              {report.metrics.map((metric, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">{metric.label}</span>
                  <span className="text-white font-semibold">{metric.value}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedReport(report)}
                className="flex-1 btn-secondary flex items-center justify-center space-x-2"
              >
                <EyeIcon className="w-4 h-4" />
                <span>Preview</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => generateReport(report.title)}
                disabled={isDownloading}
                className={`flex-1 btn-primary flex items-center justify-center space-x-2 ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                <span>{isDownloading ? 'Downloading...' : 'Download'}</span>
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card-gradient p-6 rounded-2xl"
      >
        <h2 className="text-xl font-bold text-white mb-6">Quick Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-white/60 text-sm">Total Users</p>
            <p className="text-2xl font-bold text-white">
              {formatNumber(analyticsData?.user_analytics?.total_users || 0)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-white/60 text-sm">Total Transactions</p>
            <p className="text-2xl font-bold text-white">
              {formatNumber(analyticsData?.transaction_analytics?.total_transactions || 0)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-white/60 text-sm">Total Volume</p>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(analyticsData?.transaction_analytics?.total_volume || 0)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-white/60 text-sm">Platform Revenue</p>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(analyticsData?.revenue_analytics?.total_revenue || 0)}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Report Preview Modal */}
      {selectedReport && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedReport(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="card-gradient p-6 rounded-2xl max-w-2xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">{selectedReport.title}</h3>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-white/60 hover:text-white"
              >
                ×
              </button>
            </div>
            <p className="text-white/60 mb-6">{selectedReport.description}</p>
            
            <div className="space-y-4 mb-6">
              {selectedReport.metrics.map((metric, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <span className="text-white/60">{metric.label}</span>
                  <span className="text-white font-semibold">{metric.value}</span>
                </div>
              ))}
            </div>

            <div className="flex space-x-2">
                             <motion.button
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
                 onClick={() => generateReport(selectedReport.title)}
                 disabled={isDownloading}
                 className={`btn-primary flex items-center space-x-2 ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
               >
                 <ArrowDownTrayIcon className="w-4 h-4" />
                 <span>{isDownloading ? 'Downloading...' : 'Download Report'}</span>
               </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedReport(null)}
                className="btn-secondary"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Reports; 