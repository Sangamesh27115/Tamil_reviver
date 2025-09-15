import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="mb-4"
        >
          <Loader2 size={48} className="text-white mx-auto" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white text-xl font-semibold"
        >
          Loading...
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-white/80 text-sm mt-2"
        >
          Please wait while we prepare your experience
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
