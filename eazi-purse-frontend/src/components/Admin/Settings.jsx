import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CogIcon,
  BellIcon,
  ServerIcon,
} from '@heroicons/react/24/outline';
import { useGetAdminSettingsQuery, useUpdateAdminSettingsMutation } from '../../store/apiSlice';

const Settings = () => {
  const { data: settingsData } = useGetAdminSettingsQuery();
  const [updateSettings] = useUpdateAdminSettingsMutation();
  
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    transactionLimit: 1000000,
    currency: 'NGN',
    timezone: 'Africa/Lagos',
  });
  
  // Update local state when API data loads
  useEffect(() => {
    if (settingsData) {
      setSettings({
        emailNotifications: settingsData.email_notifications,
        smsNotifications: settingsData.sms_notifications,
        transactionLimit: settingsData.transaction_limit,
        currency: settingsData.currency,
        timezone: settingsData.timezone,
      });
    }
  }, [settingsData]);

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

  const saveSettings = async () => {
    try {
      await updateSettings({
        email_notifications: settings.emailNotifications,
        sms_notifications: settings.smsNotifications,
        transaction_limit: settings.transactionLimit,
        currency: 'NGN',
        timezone: 'Africa/Lagos',
      }).unwrap();
      console.log('Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
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
                <div className="input-field pr-12 bg-white/10 text-white/60 cursor-not-allowed">
                  Nigerian Naira (₦)
                </div>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 font-bold text-lg">
                  ₦
                </div>
              </div>
              <p className="text-white/40 text-xs mt-1">Currency is fixed to Nigerian Naira</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Timezone
              </label>
              <div className="input-field bg-white/10 text-white/60 cursor-not-allowed">
                West Africa/Lagos
              </div>
              <p className="text-white/40 text-xs mt-1">Timezone is fixed to West Africa/Lagos</p>
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

        {/* System Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="card-gradient p-6 rounded-2xl"
        >
          <div className="flex items-center space-x-3 mb-6">
            <ServerIcon className="w-6 h-6 text-primary-400" />
            <h2 className="text-xl font-bold text-white">System Information</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-white/60">Platform Version</span>
              <span className="text-white">{settingsData?.platform_version || 'v1.0.0'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Database</span>
              <span className="text-white">{settingsData?.database || 'PostgreSQL'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Last Backup</span>
              <span className="text-white">2 hours ago</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">System Status</span>
              <span className="text-success-400">{settingsData?.system_status || 'Healthy'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Uptime</span>
              <span className="text-white">{settingsData?.uptime || '99.9%'}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings; 