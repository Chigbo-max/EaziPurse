import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  UserIcon,
  CreditCardIcon,
  ArrowLeftStartOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { logout } from '../../store/authSlice';
import { selectCurrentUser } from '../../store/authSlice';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectCurrentUser);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Profile', href: '/profile', icon: UserIcon },
    { name: 'Wallet', href: '/wallet', icon: CreditCardIcon },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          className="fixed left-0 top-0 h-full w-64 bg-dark-800/95 backdrop-blur-md border-r border-white/10"
        >
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-white">₦</span>
              </div>
              <span className="text-xl font-bold text-white">EaziPurse</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-white/60 hover:text-white"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <nav className="mt-8 px-4">
            <div className="space-y-2">
              {navigation.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive(item.href)
                      ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </motion.a>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="px-4 py-3">
                <p className="text-sm text-white/60">Welcome back,</p>
                <p className="text-white font-medium">{user?.first_name || user?.username}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200"
              >
                <ArrowLeftStartOnRectangleIcon className="w-5 h-5" />
                <span>Sign out</span>
              </button>
            </div>
          </nav>
        </motion.div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-dark-800/95 backdrop-blur-md border-r border-white/10">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24">
              <text
                x="12"
                y="16"
                textAnchor="middle"
                fontSize="16"
                fill="currentColor"
                fontFamily="Arial, sans-serif"
              >
                ₦
              </text>
            </svg>
            <span className="text-xl font-bold text-white">EaziPurse</span>
          </div>


          <nav className="flex-1 px-4 mt-8">
            <div className="space-y-2">
              {navigation.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive(item.href)
                      ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </motion.a>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="px-4 py-3">
                <p className="text-sm text-white/60">Welcome back,</p>
                <p className="text-white font-medium">{user?.first_name || user?.username}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200"
              >
                <ArrowLeftStartOnRectangleIcon className="w-5 h-5" />
                <span>Sign out</span>
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white/60 hover:text-white"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-white">₦</span>
            </div>
            <span className="text-lg font-bold text-white">EaziPurse</span>
          </div>
          <div className="w-6" />
        </div>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout; 