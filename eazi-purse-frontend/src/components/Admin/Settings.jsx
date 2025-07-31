import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CogIcon,
  ShieldCheckIcon,
  BellIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  ServerIcon,
} from '@heroicons/react/24/outline';

const Settings = () => {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    emailNotifications: true,
    smsNotifications: true,
    transactionLimit: 1000000,
    currency: 'NGN',
    timezone: 'Africa/Lagos',
  });

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = () => {
    // In real app, this would save to API
    console.log('Saving settings:', settings);
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
            System Settings
          </h1>
          <p className="text-white/60 mt-2">
            Configure platform settings and preferences
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={saveSettings}
          className="btn-primary mt-4 lg:mt-0"
        >
          Save Settings
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="card-gradient p-6 rounded-2xl"
        >
          <div className="flex items-center space-x-3 mb-6">
            <CogIcon className="w-6 h-6 text-primary-400" />
            <h2 className="text-xl font-bold text-white">General Settings</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Maintenance Mode</p>
                <p className="text-white/60 text-sm">Temporarily disable the platform</p>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => handleToggle('maintenanceMode')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.maintenanceMode ? 'bg-danger-500' : 'bg-white/20'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.maintenanceMode ? 'transform translate-x-6' : 'transform translate-x-1'
                  }`} />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Transaction Limit (₦)
              </label>
              <input
                type="number"
                value={settings.transactionLimit}
                onChange={(e) => handleChange('transactionLimit', e.target.value)}
                className="input-field"
                placeholder="Enter transaction limit"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Currency
              </label>
              <div className="relative">
                <select
                  value={settings.currency}
                  onChange={(e) => handleChange('currency', e.target.value)}
                  className="input-field pr-12"
                >
                  <option value="NGN">Nigerian Naira (₦)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 font-bold text-lg">
                  ₦
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Timezone
              </label>
              <select
                value={settings.timezone}
                onChange={(e) => handleChange('timezone', e.target.value)}
                className="input-field"
              >
                <option value="Africa/Lagos">Africa/Lagos</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="card-gradient p-6 rounded-2xl"
        >
          <div className="flex items-center space-x-3 mb-6">
            <BellIcon className="w-6 h-6 text-warning-400" />
            <h2 className="text-xl font-bold text-white">Notification Settings</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Email Notifications</p>
                <p className="text-white/60 text-sm">Send email alerts to users</p>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => handleToggle('emailNotifications')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.emailNotifications ? 'bg-success-500' : 'bg-white/20'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.emailNotifications ? 'transform translate-x-6' : 'transform translate-x-1'
                  }`} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">SMS Notifications</p>
                <p className="text-white/60 text-sm">Send SMS alerts to users</p>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => handleToggle('smsNotifications')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.smsNotifications ? 'bg-success-500' : 'bg-white/20'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.smsNotifications ? 'transform translate-x-6' : 'transform translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Security Settings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="card-gradient p-6 rounded-2xl"
        >
          <div className="flex items-center space-x-3 mb-6">
            <ShieldCheckIcon className="w-6 h-6 text-success-400" />
            <h2 className="text-xl font-bold text-white">Security Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-xl">
              <h3 className="text-white font-medium mb-2">Two-Factor Authentication</h3>
              <p className="text-white/60 text-sm mb-3">Require 2FA for all admin accounts</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-secondary"
              >
                Configure 2FA
              </motion.button>
            </div>

            <div className="p-4 bg-white/5 rounded-xl">
              <h3 className="text-white font-medium mb-2">Session Management</h3>
              <p className="text-white/60 text-sm mb-3">Manage active admin sessions</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-secondary"
              >
                View Sessions
              </motion.button>
            </div>

            <div className="p-4 bg-white/5 rounded-xl">
              <h3 className="text-white font-medium mb-2">API Keys</h3>
              <p className="text-white/60 text-sm mb-3">Manage API access keys</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-secondary"
              >
                Manage Keys
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* System Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="card-gradient p-6 rounded-2xl"
        >
          <div className="flex items-center space-x-3 mb-6">
            <ServerIcon className="w-6 h-6 text-primary-400" />
            <h2 className="text-xl font-bold text-white">System Information</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-white/60">Platform Version</span>
              <span className="text-white">v1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Database</span>
              <span className="text-white">PostgreSQL 14</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Last Backup</span>
              <span className="text-white">2 hours ago</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">System Status</span>
              <span className="text-success-400">Healthy</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Uptime</span>
              <span className="text-white">99.9%</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-warning w-full"
            >
              System Maintenance
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings; 