import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-gray-600 mb-6">The page you are looking for was not found.</p>
        <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
      </motion.div>
    </div>
  );
};

export default NotFound;


