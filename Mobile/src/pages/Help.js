import React from 'react';
import { motion } from 'framer-motion';

const Help = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold text-gray-800">Help & About</h1>
      <div className="card space-y-3">
        <p className="text-gray-700">Learn Tamil words by playing interactive games.</p>
        <p className="text-gray-600">Need support? Email support@example.com</p>
      </div>
    </motion.div>
  );
};

export default Help;


