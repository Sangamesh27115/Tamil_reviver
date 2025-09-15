import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Medal, 
  Crown, 
  TrendingUp, 
  Users, 
  Star,
  Target
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';

const Leaderboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('global');

  // Mock leaderboard data - in real app, this would come from API
  const leaderboardData = [
    { id: 1, username: 'Alex Johnson', points: 2847, rank: 1, avatar: 'A', change: '+2' },
    { id: 2, username: 'Sarah Chen', points: 2654, rank: 2, avatar: 'S', change: '+1' },
    { id: 3, username: 'Mike Rodriguez', points: 2489, rank: 3, avatar: 'M', change: '-1' },
    { id: 4, username: 'Emma Wilson', points: 2341, rank: 4, avatar: 'E', change: '+3' },
    { id: 5, username: 'David Kim', points: 2187, rank: 5, avatar: 'D', change: '+1' },
    { id: 6, username: 'Lisa Thompson', points: 2045, rank: 6, avatar: 'L', change: '-2' },
    { id: 7, username: 'James Brown', points: 1987, rank: 7, avatar: 'J', change: '+1' },
    { id: 8, username: 'Maria Garcia', points: 1876, rank: 8, avatar: 'M', change: '+2' },
    { id: 9, username: 'John Smith', points: 1754, rank: 9, avatar: 'J', change: '-1' },
    { id: 10, username: 'Anna Davis', points: 1643, rank: 10, avatar: 'A', change: '+1' }
  ];

  const currentUserRank = leaderboardData.find(entry => entry.username === user?.username) || {
    username: user?.username,
    points: user?.points || 0,
    rank: user?.leaderboardRank || 'N/A',
    avatar: user?.username?.charAt(0).toUpperCase(),
    change: '+0'
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="text-yellow-500" size={24} />;
    if (rank === 2) return <Medal className="text-gray-400" size={24} />;
    if (rank === 3) return <Medal className="text-amber-600" size={24} />;
    return <Trophy className="text-purple-500" size={20} />;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'from-yellow-400 to-orange-500';
    if (rank === 2) return 'from-gray-300 to-gray-400';
    if (rank === 3) return 'from-amber-500 to-orange-600';
    return 'from-purple-400 to-pink-500';
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
            Leaderboard
          </h1>
          <p className="text-gray-600 text-lg">
            See how you rank among your peers
          </p>
        </motion.div>

        {/* Current User Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="card bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                  {currentUserRank.avatar}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{currentUserRank.username}</h2>
                  <p className="text-white/80">Your current position</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{currentUserRank.points}</div>
                <div className="text-white/80">points</div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">#{currentUserRank.rank}</span>
                <span className="text-white/80">rank</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp size={20} />
                <span className="text-green-300">{currentUserRank.change}</span>
              </div>
            </div>
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
            {['global', 'weekly', 'monthly'].map((tab) => (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 px-4 rounded-md font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-purple-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Top Performers</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users size={16} />
                <span>{leaderboardData.length} participants</span>
              </div>
            </div>

            <div className="space-y-4">
              {leaderboardData.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className={`flex items-center justify-between p-4 rounded-lg transition-all duration-200 ${
                    entry.username === user?.username
                      ? 'bg-purple-50 border-2 border-purple-200'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r ${getRankColor(entry.rank)}`}>
                        {getRankIcon(entry.rank)}
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-800">#{entry.rank}</div>
                        <div className="text-xs text-gray-500">rank</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                        {entry.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{entry.username}</p>
                        <p className="text-sm text-gray-600">{entry.points} points</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      entry.change.startsWith('+') 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      <TrendingUp size={12} />
                      {entry.change}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="card text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="text-white" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Top Performer</h3>
            <p className="text-2xl font-bold text-gray-800">{leaderboardData[0]?.username}</p>
            <p className="text-sm text-gray-600">{leaderboardData[0]?.points} points</p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="text-white" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Goal</h3>
            <p className="text-2xl font-bold text-gray-800">Top 5</p>
            <p className="text-sm text-gray-600">Keep pushing!</p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="text-white" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Average Score</h3>
            <p className="text-2xl font-bold text-gray-800">1,847</p>
            <p className="text-sm text-gray-600">points</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;
