import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiHome, HiClipboardList, HiUser, HiUsers,
  HiPlus, HiMenu, HiX, HiMoon, HiSun, HiLogout, HiBell
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const homeownerLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: HiHome },
    { to: '/jobs', label: 'My Jobs', icon: HiClipboardList },
    { to: '/jobs/new', label: 'Post Job', icon: HiPlus },
    { to: '/technicians', label: 'Technicians', icon: HiUsers },
    { to: '/profile', label: 'Profile', icon: HiUser },
  ];

  const technicianLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: HiHome },
    { to: '/jobs', label: 'Browse Jobs', icon: HiClipboardList },
    { to: '/profile', label: 'Profile', icon: HiUser },
  ];

  const links = user?.role === 'homeowner' ? homeownerLinks : technicianLinks;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-outline">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-400 to-brand-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-display font-bold text-sm">F</span>
            </div>
            <span className="font-display font-bold text-xl text-ink">
              Fix<span className="text-brand-500">ora</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(to)
                    ? 'bg-brand/10 dark:bg-brand-900/30 text-brand hover:text-brand-hover'
                    : 'text-ink-2 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-ink dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg text-ink-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
            </motion.button>

            {/* User pill (desktop) */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-canvas-alt rounded-full">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-brand/100 flex items-center justify-center text-white text-xs font-bold">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-medium text-ink-2 max-w-[100px] truncate">
                  {user?.name}
                </span>
                <span className="text-xs px-1.5 py-0.5 bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 rounded-full capitalize">
                  {user?.role}
                </span>
              </div>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleLogout}
                className="p-2 rounded-lg text-ink-2 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
                title="Logout"
              >
                <HiLogout className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg text-ink-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <HiX className="w-5 h-5" /> : <HiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-outline bg-surface"
          >
            <div className="px-4 py-3 space-y-1">
              {links.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(to)
                      ? 'bg-brand/10 dark:bg-brand-900/30 text-brand hover:text-brand-hover'
                      : 'text-ink-2 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <HiLogout className="w-5 h-5" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
