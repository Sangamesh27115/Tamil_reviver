import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import navItems from '../routes/navConfig';

const Navigation = () => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  const items = navItems;

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile menu button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 lg:hidden bg-white/20 backdrop-blur-md p-3 rounded-full"
      >
        {isOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
      </motion.button>

      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Navigation */}
      <motion.nav
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-md z-50 lg:relative lg:w-auto lg:bg-transparent lg:backdrop-blur-none lg:z-auto lg:transform-none`}
      >
        <div className="flex flex-col h-full p-6 lg:p-0 lg:flex-row lg:items-center lg:gap-8">
          {/* User info */}
          <div className="mb-8 lg:mb-0 lg:mr-8">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg"
              >
                {user?.username?.charAt(0).toUpperCase()}
              </motion.div>
              <div>
                <h3 className="font-semibold text-gray-800 lg:text-white">
                  {user?.username}
                </h3>
                <p className="text-sm text-gray-600 lg:text-white/80">
                  {user?.points || 0} points
                </p>
              </div>
            </div>
          </div>

          {/* Navigation items */}
          <div className="flex flex-col gap-2 lg:flex-row lg:gap-6">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 lg:p-2"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-2 rounded-lg ${
                      isActive(item.path)
                        ? 'bg-purple-500 text-white'
                        : 'text-gray-600 lg:text-white/80 hover:bg-purple-100 lg:hover:bg-white/20'
                    }`}
                  >
                    <Icon size={20} />
                  </motion.div>
                  <span className={`font-medium ${
                    isActive(item.path)
                      ? 'text-purple-600 lg:text-white'
                      : 'text-gray-700 lg:text-white/90'
                  }`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Logout button */}
          <div className="mt-auto lg:mt-0 lg:ml-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="flex items-center gap-3 p-3 rounded-lg text-red-600 hover:bg-red-50 lg:text-white/80 lg:hover:bg-white/20 transition-all duration-200"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </motion.button>
          </div>
        </div>
      </motion.nav>
    </>
  );
};

export default Navigation;
