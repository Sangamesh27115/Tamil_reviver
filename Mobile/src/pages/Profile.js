import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Trophy, 
  Edit, 
  Save, 
  X,
  Camera,
  Settings,
  Shield,
  Bell,
  Palette
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: user?.username || '',
    email: user?.email || ''
  });

  const handleSave = () => {
    updateUser({ ...user, ...editData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      username: user?.username || '',
      email: user?.email || ''
    });
    setIsEditing(false);
  };

  const profileStats = [
    { label: 'Total Points', value: user?.points || 0, icon: Trophy },
    { label: 'Member Since', value: new Date(user?.createdAt).toLocaleDateString(), icon: Calendar },
    { label: 'Current Rank', value: `#${user?.leaderboardRank || 'N/A'}`, icon: Trophy },
    { label: 'Rewards Earned', value: user?.rewards?.length || 0, icon: Trophy }
  ];

  const settingsOptions = [
    { title: 'Account Settings', icon: Settings, description: 'Manage your account preferences' },
    { title: 'Privacy & Security', icon: Shield, description: 'Control your privacy settings' },
    { title: 'Notifications', icon: Bell, description: 'Configure notification preferences' },
    { title: 'Appearance', icon: Palette, description: 'Customize the app appearance' }
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
            Profile
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your account and preferences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="card text-center">
              {/* Profile Picture */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative inline-block mb-6"
              >
                <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-lg"
                >
                  <Camera size={20} className="text-gray-600" />
                </motion.button>
              </motion.div>

              {/* User Info */}
              <div className="space-y-4">
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editData.username}
                      onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                      className="input text-center font-semibold text-lg"
                    />
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      className="input text-center"
                    />
                    <div className="flex gap-2 justify-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSave}
                        className="btn btn-primary"
                      >
                        <Save size={16} />
                        Save
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCancel}
                        className="btn btn-secondary"
                      >
                        <X size={16} />
                        Cancel
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-800">{user?.username}</h2>
                    <p className="text-gray-600">{user?.email}</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsEditing(true)}
                      className="btn btn-ghost"
                    >
                      <Edit size={16} />
                      Edit Profile
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Stats and Settings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Stats */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Profile Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {profileStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                      className="text-center p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Icon className="text-white" size={24} />
                      </div>
                      <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Settings */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Settings</h2>
              <div className="space-y-4">
                {settingsOptions.map((option, index) => {
                  const Icon = option.icon;
                  return (
                    <motion.div
                      key={option.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center">
                          <Icon className="text-white" size={20} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{option.title}</h3>
                          <p className="text-sm text-gray-600">{option.description}</p>
                        </div>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="text-gray-400"
                      >
                        <Icon size={20} />
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Recent Rewards */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Recent Rewards</h2>
              {user?.rewards && user.rewards.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.rewards.slice(0, 4).map((reward, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                      className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
                    >
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                        <Trophy className="text-white" size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{reward}</p>
                        <p className="text-sm text-gray-600">Earned recently</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-center py-8"
                >
                  <Trophy className="text-gray-400 mx-auto mb-4" size={48} />
                  <p className="text-gray-600">No rewards earned yet</p>
                  <p className="text-sm text-gray-500 mt-2">Complete activities to earn rewards!</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
    </>
  );
};

export default Profile;
