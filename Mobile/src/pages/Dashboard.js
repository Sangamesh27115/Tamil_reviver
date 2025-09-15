import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  Star, 
  Target, 
  Award,
  Zap,
  Play,
  BookOpen,
  Edit3,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';

const Dashboard = () => {
  const { user } = useAuth();
  const { userStats, fetchUserStats } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserStats();
  }, [fetchUserStats]);

  const stats = [
    {
      title: 'Total Points',
      value: userStats?.totalPoints || user?.points || 0,
      icon: Trophy,
      color: 'from-yellow-400 to-orange-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Games Played',
      value: userStats?.totalGamesPlayed || 0,
      icon: Award,
      color: 'from-purple-400 to-pink-500',
      change: '+2',
      changeType: 'positive'
    },
    {
      title: 'Correct Answers',
      value: userStats?.totalCorrectAnswers || 0,
      icon: Target,
      color: 'from-green-400 to-blue-500',
      change: '+1',
      changeType: 'positive'
    },
    {
      title: 'Current Streak',
      value: userStats?.currentStreak || 0,
      icon: Zap,
      color: 'from-red-400 to-pink-500',
      change: '+1',
      changeType: 'positive'
    }
  ];

  const recentActivities = [
    { id: 1, action: 'Completed Quiz', points: 50, time: '2 hours ago' },
    { id: 2, action: 'Earned Badge', points: 25, time: '1 day ago' },
    { id: 3, action: 'Won Challenge', points: 100, time: '3 days ago' },
    { id: 4, action: 'Daily Login', points: 10, time: '4 days ago' }
  ];

  const quickActions = [
    { 
      title: 'Play Games', 
      icon: Play, 
      color: 'bg-blue-500',
      onClick: () => navigate('/game-selection')
    },
    { 
      title: 'Match Game', 
      icon: BookOpen, 
      color: 'bg-green-500',
      onClick: () => navigate('/game-selection')
    },
    { 
      title: 'Fill Blanks', 
      icon: Edit3, 
      color: 'bg-purple-500',
      onClick: () => navigate('/game-selection')
    },
    { 
      title: 'MCQ Game', 
      icon: HelpCircle, 
      color: 'bg-orange-500',
      onClick: () => navigate('/game-selection')
    }
  ];

  return (
    <>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
            வணக்கம், {user?.username}! (Welcome back!)
          </h1>
          <p className="text-gray-600 text-lg">
            Ready to learn Tamil words? Let's play some games!
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="card"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <span className={`text-xs font-medium ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-gray-500 text-xs ml-1">from last week</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color}`}>
                    <Icon className="text-white" size={24} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-1"
          >
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <motion.button
                      key={action.title}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={action.onClick}
                      className={`${action.color} text-white p-4 rounded-lg flex flex-col items-center gap-2 hover:shadow-lg transition-all duration-200 cursor-pointer`}
                    >
                      <Icon size={24} />
                      <span className="text-sm font-medium">{action.title}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Recent Activities</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  View All
                </motion.button>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                        <Star className="text-white" size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{activity.action}</p>
                        <p className="text-sm text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 font-semibold">+{activity.points}</span>
                      <span className="text-gray-400">pts</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8"
        >
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Your Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Weekly Goal</span>
                  <span className="text-sm font-semibold text-gray-800">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '75%' }}
                    transition={{ duration: 1, delay: 1 }}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Monthly Target</span>
                  <span className="text-sm font-semibold text-gray-800">60%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '60%' }}
                    transition={{ duration: 1, delay: 1.2 }}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
    </>
  );
};

export default Dashboard;
