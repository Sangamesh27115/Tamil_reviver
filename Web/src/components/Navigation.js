import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Gamepad2, 
  Trophy, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  BookOpen,
  Users,
  BarChart3,
  FileText,
  GraduationCap,
  Shield
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Student':
        return <GraduationCap className="w-5 h-5" />;
      case 'Teacher':
        return <BookOpen className="w-5 h-5" />;
      case 'Admin':
        return <Shield className="w-5 h-5" />;
      default:
        return <User className="w-5 h-5" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Student':
        return 'bg-blue-100 text-blue-800';
      case 'Teacher':
        return 'bg-green-100 text-green-800';
      case 'Admin':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const commonNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/game-selection', label: 'Games', icon: Gamepad2 },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  const studentNavItems = [
    { path: '/student/dashboard', label: 'My Dashboard', icon: Home },
    { path: '/student/tasks', label: 'My Tasks', icon: FileText },
    { path: '/student/stats', label: 'My Stats', icon: BarChart3 },
  ];

  const teacherNavItems = [
    { path: '/teacher/dashboard', label: 'Teacher Dashboard', icon: Home },
    { path: '/teacher/tasks', label: 'Manage Tasks', icon: FileText },
    { path: '/teacher/students', label: 'My Students', icon: Users },
    { path: '/teacher/stats', label: 'Analytics', icon: BarChart3 },
  ];

  const adminNavItems = [
    { path: '/admin/dashboard', label: 'Admin Dashboard', icon: Home },
    { path: '/admin/words', label: 'Manage Words', icon: BookOpen },
    { path: '/admin/users', label: 'Manage Users', icon: Users },
    { path: '/admin/stats', label: 'System Stats', icon: BarChart3 },
  ];

  const getNavItems = () => {
    switch (user?.role) {
      case 'Student':
        return [...commonNavItems, ...studentNavItems];
      case 'Teacher':
        return [...commonNavItems, ...teacherNavItems];
      case 'Admin':
        return [...commonNavItems, ...adminNavItems];
      default:
        return commonNavItems;
    }
  };

  const navItems = getNavItems();

  const NavItem = ({ item, onClick }) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;

    return (
      <Link
        to={item.path}
        onClick={onClick}
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
          isActive
            ? 'bg-blue-100 text-blue-700 font-medium'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`}
      >
        <Icon className="w-5 h-5" />
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TW</span>
            </div>
            <span className="text-xl font-bold text-gray-800">Tamil Word Game</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user?.role)}`}>
                <div className="flex items-center space-x-1">
                  {getRoleIcon(user?.role)}
                  <span>{user?.role}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-4 space-y-2">
              {/* User Info */}
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`p-2 rounded-full ${getRoleColor(user?.role)}`}>
                  {getRoleIcon(user?.role)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user?.username}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  <p className="text-xs text-gray-400">{user?.role}</p>
                </div>
              </div>

              {/* Navigation Items */}
              <div className="space-y-1">
                {navItems.map((item) => (
                  <NavItem key={item.path} item={item} onClick={() => setIsMobileMenuOpen(false)} />
                ))}
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;
