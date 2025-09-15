import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <motion.h1
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="text-4xl font-bold text-white mb-2"
          >
            Welcome Back
          </motion.h1>
          <p className="text-white/80 text-lg">
            Sign in to continue your journey
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="form">
            {/* Email Field */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className="input pl-12"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.email.message}
                </motion.p>
              )}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  className="input pl-12 pr-12"
                  placeholder="Enter your password"
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </motion.button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.password.message}
                </motion.p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="btn btn-primary w-full"
            >
              Sign In
              <ArrowRight size={20} />
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Register Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-purple-600 hover:text-purple-700 font-semibold"
              >
                Sign up here
              </Link>
            </p>
          </motion.div>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{ 
            y: [0, 10, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-20 right-10 w-32 h-32 bg-white/5 rounded-full blur-xl"
        />
      </motion.div>
    </div>
  );
};

export default Login;
