import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGetProfileQuery, useUpdateProfileMutation } from '../../store/apiSlice';
import { useGetCurrentUserQuery } from '../../store/apiSlice';
import toast from 'react-hot-toast';
import { showErrorMessages } from '../../utils/errorHandler';

const Profile = () => {
  const { data: profileData, isLoading: profileLoading, error: profileError } = useGetProfileQuery();
  const { data: userData, isLoading: userLoading, error: userError } = useGetCurrentUserQuery();
  const [updateProfile, { isLoading: updateLoading }] = useUpdateProfileMutation();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    nin: '',
    bvn: '',
  });

  // Update formData when profileData loads
  React.useEffect(() => {
    if (profileData) {
      setFormData({
        address: profileData.address || '',
        nin: profileData.nin || '',
        bvn: profileData.bvn || '',
      });
    }
  }, [profileData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await updateProfile(formData).unwrap();
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      showErrorMessages(error, toast);
    }
  };

  if (profileLoading || userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (userError || profileError) {
    return (
      <div className="text-center py-12">
        <p className="text-white/60">Failed to load profile data</p>
        <p className="text-red-400 text-sm mt-2">
          User Error: {userError?.data?.message || userError?.status}
          <br />
          Profile Error: {profileError?.data?.message || profileError?.status}
        </p>
      </div>
    );
  }

  const user = userData;
  const profile = profileData;

  // Debug logging
  console.log('User data:', user);
  console.log('Profile data:', profile);
  console.log('User error:', userError);
  console.log('Profile error:', profileError);

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
            My Profile
          </h1>
          <p className="text-white/60 mt-2">
            Manage your account information and settings
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsEditing(!isEditing)}
          className="btn-secondary mt-4 lg:mt-0"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="card-gradient p-6 rounded-2xl"
        >
          <h2 className="text-xl font-bold text-white mb-6">Personal Information</h2>
          
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={`${user?.first_name || ''} ${user?.last_name || ''}`}
                  className="input-field"
                  disabled
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  className="input-field"
                  disabled
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={user?.phone || ''}
                  className="input-field"
                  disabled
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="input-field"
                  rows="3"
                  placeholder="Enter your address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  NIN (National Identity Number)
                </label>
                <input
                  type="text"
                  name="nin"
                  value={formData.nin}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter your NIN"
                  maxLength="11"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  BVN (Bank Verification Number)
                </label>
                <input
                  type="text"
                  name="bvn"
                  value={formData.bvn}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter your BVN"
                  maxLength="11"
                />
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={updateLoading}
                className="btn-primary w-full"
              >
                {updateLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Updating...
                  </div>
                ) : (
                  'Save Changes'
                )}
              </motion.button>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-white/60">Full Name</p>
                <p className="text-white font-medium">
                  {user?.first_name && user?.last_name 
                    ? `${user.first_name} ${user.last_name}` 
                    : user?.username || 'Not provided'}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-white/60">Email</p>
                <p className="text-white font-medium">{user?.email || 'Not provided'}</p>
              </div>
              
              <div>
                <p className="text-sm text-white/60">Phone Number</p>
                <p className="text-white font-medium">{user?.phone || 'Not provided'}</p>
              </div>
              
              <div>
                <p className="text-sm text-white/60">Address</p>
                <p className="text-white font-medium">
                  {profile?.address || 'Not provided'}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-white/60">NIN</p>
                <p className="text-white font-medium">
                  {profile?.nin || 'Not provided'}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-white/60">BVN</p>
                <p className="text-white font-medium">
                  {profile?.bvn || 'Not provided'}
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Account Security */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Account Status */}
          <div className="success-gradient p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">Account Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/60">Account Type</span>
                <span className="text-success-400 font-medium">Premium</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Verification Status</span>
                <span className="text-success-400 font-medium">Verified</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Member Since</span>
                <span className="text-white/80 text-sm">
                  {new Date(user?.date_joined).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="card-gradient p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">Security Settings</h3>
            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full text-left p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Two-Factor Authentication</p>
                    <p className="text-white/60 text-sm">Add an extra layer of security</p>
                  </div>
                  <div className="w-6 h-6 bg-success-500/20 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-success-400 rounded-full"></div>
                  </div>
                </div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full text-left p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Change Password</p>
                    <p className="text-white/60 text-sm">Update your login credentials</p>
                  </div>
                  <div className="w-6 h-6 bg-primary-500/20 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-primary-400 rounded-full"></div>
                  </div>
                </div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full text-left p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Login History</p>
                    <p className="text-white/60 text-sm">View recent login activity</p>
                  </div>
                  <div className="w-6 h-6 bg-warning-500/20 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-warning-400 rounded-full"></div>
                  </div>
                </div>
              </motion.button>
            </div>
          </div>

          {/* Preferences */}
          <div className="card-gradient p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Email Notifications</p>
                  <p className="text-white/60 text-sm">Receive transaction alerts</p>
                </div>
                <div className="w-12 h-6 bg-success-500 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">SMS Notifications</p>
                  <p className="text-white/60 text-sm">Receive SMS alerts</p>
                </div>
                <div className="w-12 h-6 bg-success-500 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile; 