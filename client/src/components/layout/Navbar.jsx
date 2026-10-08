import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  FiMenu, FiX, FiSun, FiMoon, FiUser, FiLogOut, FiBookOpen,
  FiChevronDown, FiBell, FiGrid, FiBarChart2, FiSettings,
} from 'react-icons/fi';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setShowDropdown(false);
  }, [location]);

  const navLinks = [
    { to: '/courses', label: 'Explore', icon: FiBookOpen },
  ];

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'student': return '/student/dashboard';
      case 'instructor': return '/instructor/dashboard';
      case 'admin': return '/admin/dashboard';
      default: return '/';
    }
  };

  const getDashboardLabel = () => {
    if (!user) return '';
    return user.role === 'admin' ? 'Admin' : user.role === 'instructor' ? 'Instructor' : 'Dashboard';
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'glass shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-purple-500 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform">
              <FiBookOpen className="text-white text-lg" />
            </div>
            <span className="text-xl font-bold gradient-text">LearnHub</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-dark-600 dark:text-dark-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-300 hover:bg-dark-200 dark:hover:bg-dark-700 transition-colors"
            >
              {theme === 'dark' ? <FiSun className="text-lg" /> : <FiMoon className="text-lg" />}
            </motion.button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 p-2 rounded-xl hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-dark-700 dark:text-dark-200">
                    {user.name?.split(' ')[0]}
                  </span>
                  <FiChevronDown className="text-dark-400 text-sm" />
                </button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 glass-card rounded-2xl shadow-2xl border border-dark-200 dark:border-dark-700 overflow-hidden"
                    >
                      <div className="p-3 border-b border-dark-100 dark:border-dark-700">
                        <p className="text-sm font-semibold text-dark-900 dark:text-dark-100">{user.name}</p>
                        <p className="text-xs text-dark-500 dark:text-dark-400 capitalize">{user.role}</p>
                      </div>
                      <div className="p-2 space-y-1">
                        <Link to={getDashboardLink()} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-dark-100 dark:hover:bg-dark-700 text-sm text-dark-700 dark:text-dark-200 transition-colors">
                          <FiGrid className="text-primary-500" />
                          {getDashboardLabel()}
                        </Link>
                        <Link to="/student/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-dark-100 dark:hover:bg-dark-700 text-sm text-dark-700 dark:text-dark-200 transition-colors">
                          <FiUser className="text-primary-500" />
                          Profile
                        </Link>
                        <Link to="/student/notifications" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-dark-100 dark:hover:bg-dark-700 text-sm text-dark-700 dark:text-dark-200 transition-colors">
                          <FiBell className="text-primary-500" />
                          Notifications
                        </Link>
                        <Link to="/student/messages" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-dark-100 dark:hover:bg-dark-700 text-sm text-dark-700 dark:text-dark-200 transition-colors">
                          <FiBarChart2 className="text-primary-500" />
                          Messages
                        </Link>
                      </div>
                      <div className="p-2 border-t border-dark-100 dark:border-dark-700">
                        <button onClick={logout} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-sm text-red-500 transition-colors">
                          <FiLogOut />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  to="/auth/login"
                  className="px-5 py-2.5 text-sm font-semibold text-dark-700 dark:text-dark-200 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-xl transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/auth/register"
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-xl shadow-lg shadow-primary-500/25 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
            >
              {isOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-dark-200 dark:border-dark-700"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-dark-100 dark:hover:bg-dark-800 text-sm font-medium text-dark-700 dark:text-dark-200 transition-colors"
                >
                  <link.icon className="text-primary-500" />
                  {link.label}
                </Link>
              ))}
              {!user && (
                <div className="flex flex-col gap-2 pt-2">
                  <Link to="/auth/login" className="w-full text-center px-4 py-3 text-sm font-semibold bg-dark-100 dark:bg-dark-800 text-dark-700 dark:text-dark-200 rounded-xl">
                    Log In
                  </Link>
                  <Link to="/auth/register" className="w-full text-center px-4 py-3 text-sm font-semibold bg-primary-500 text-white rounded-xl">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
