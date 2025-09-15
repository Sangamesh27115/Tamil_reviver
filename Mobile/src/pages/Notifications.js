import React from 'react';
import { motion } from 'framer-motion';

const Notifications = () => {
  const notifications = [
    { id: 1, title: 'Welcome!', message: 'Thanks for joining. Start with a quick game.' },
    { id: 2, title: 'Daily Goal', message: 'Complete one game to keep your streak.' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
      <div className="card space-y-4">
        {notifications.map(n => (
          <div key={n.id} className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800">{n.title}</h3>
            <p className="text-gray-600">{n.message}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Notifications;


