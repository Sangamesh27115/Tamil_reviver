import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Gift, 
  Trophy, 
  Star, 
  Lock, 
  CheckCircle, 
  Target,
  Zap,
  Award,
  Crown,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';

const Rewards = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('available');

  // Mock rewards data - in real app, this would come from API
  const availableRewards = [
    {
      id: 1,
      name: 'First Quiz Master',
      description: 'Complete your first quiz with 100% accuracy',
      points: 50,
      icon: Trophy,
      color: 'from-yellow-400 to-orange-500',
      category: 'achievement',
      unlocked: false
    },
    {
      id: 2,
      name: 'Streak Champion',
      description: 'Maintain a 7-day learning streak',
      points: 100,
      icon: Zap,
      color: 'from-red-400 to-pink-500',
      category: 'streak',
      unlocked: false
    },
    {
      id: 3,
      name: 'Perfect Score',
      description: 'Get 100% on 5 quizzes in a row',
      points: 200,
      icon: Star,
      color: 'from-purple-400 to-pink-500',
      category: 'achievement',
      unlocked: false
    },
    {
      id: 4,
      name: 'Social Butterfly',
      description: 'Connect with 10 other learners',
      points: 75,
      icon: Award,
      color: 'from-blue-400 to-cyan-500',
      category: 'social',
      unlocked: false
    },
    {
      id: 5,
      name: 'Knowledge Seeker',
      description: 'Complete 50 learning modules',
      points: 300,
      icon: Crown,
      color: 'from-green-400 to-blue-500',
      category: 'achievement',
      unlocked: false
    },
    {
      id: 6,
      name: 'Early Bird',
      description: 'Log in for 5 consecutive days before 8 AM',
      points: 150,
      icon: Sparkles,
      color: 'from-indigo-400 to-purple-500',
      category: 'habit',
      unlocked: false
    }
  ];

  const earnedRewards = [
    {
      id: 7,
      name: 'Welcome Gift',
      description: 'Joined the learning platform',
      points: 25,
      icon: Gift,
      color: 'from-green-400 to-blue-500',
      category: 'welcome',
      unlocked: true,
      earnedDate: '2024-01-15'
    },
    {
      id: 8,
      name: 'First Steps',
      description: 'Completed your first learning session',
      points: 30,
      icon: Target,
      color: 'from-purple-400 to-pink-500',
      category: 'achievement',
      unlocked: true,
      earnedDate: '2024-01-16'
    }
  ];

  const allRewards = [...availableRewards, ...earnedRewards];

  const getRewardIcon = (reward) => {
    const Icon = reward.icon;
    return <Icon className="text-white" size={24} />;
  };

  const getCategoryColor = (category) => {
    const colors = {
      achievement: 'bg-purple-100 text-purple-700',
      streak: 'bg-red-100 text-red-700',
      social: 'bg-blue-100 text-blue-700',
      habit: 'bg-indigo-100 text-indigo-700',
      welcome: 'bg-green-100 text-green-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
            Rewards
          </h1>
          <p className="text-gray-600 text-lg">
            Unlock achievements and earn points
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="card text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="text-white" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Points</h3>
            <p className="text-3xl font-bold text-gray-800">{user?.points || 0}</p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-white" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Earned Rewards</h3>
            <p className="text-3xl font-bold text-gray-800">{earnedRewards.length}</p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="text-white" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Available</h3>
            <p className="text-3xl font-bold text-gray-800">{availableRewards.length}</p>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-6"
        >
          <div className="flex bg-white rounded-lg p-1 shadow-sm">
            {[
              { key: 'available', label: 'Available', count: availableRewards.length },
              { key: 'earned', label: 'Earned', count: earnedRewards.length },
              { key: 'all', label: 'All Rewards', count: allRewards.length }
            ].map((tab) => (
              <motion.button
                key={tab.key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-3 px-4 rounded-md font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-purple-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.label} ({tab.count})
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Rewards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allRewards
              .filter(reward => {
                if (activeTab === 'available') return !reward.unlocked;
                if (activeTab === 'earned') return reward.unlocked;
                return true;
              })
              .map((reward, index) => (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className={`card relative overflow-hidden ${
                    reward.unlocked ? 'ring-2 ring-green-200' : ''
                  }`}
                >
                  {/* Reward Status */}
                  {reward.unlocked && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle className="text-green-500" size={24} />
                    </div>
                  )}

                  {/* Reward Icon */}
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-r ${reward.color} mx-auto mb-4`}>
                    {getRewardIcon(reward)}
                  </div>

                  {/* Reward Info */}
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{reward.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{reward.description}</p>
                    
                    {/* Category Badge */}
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(reward.category)}`}>
                      {reward.category}
                    </span>
                  </div>

                  {/* Points */}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800 mb-1">+{reward.points}</div>
                    <div className="text-sm text-gray-500">points</div>
                  </div>

                  {/* Earned Date */}
                  {reward.unlocked && reward.earnedDate && (
                    <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                      <p className="text-xs text-gray-500">
                        Earned on {new Date(reward.earnedDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {/* Lock Icon for Unavailable */}
                  {!reward.unlocked && (
                    <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
                      <Lock className="text-gray-400" size={32} />
                    </div>
                  )}
                </motion.div>
              ))}
          </div>
        </motion.div>

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-8"
        >
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Your Progress</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Rewards Progress</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {earnedRewards.length}/{allRewards.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(earnedRewards.length / allRewards.length) * 100}%` }}
                    transition={{ duration: 1, delay: 1.2 }}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Points Goal</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {user?.points || 0}/1000
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((user?.points || 0) / 1000 * 100, 100)}%` }}
                    transition={{ duration: 1, delay: 1.4 }}
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Rewards;
