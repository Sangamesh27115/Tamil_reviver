import React from 'react';
import { motion } from 'framer-motion';

const Settings = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <h1 className="text-3xl font-bold text-gray-800">Settings</h1>

      <div className="card">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Enable sounds</span>
            <input type="checkbox" className="toggle" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Daily reminders</span>
            <input type="checkbox" className="toggle" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;


