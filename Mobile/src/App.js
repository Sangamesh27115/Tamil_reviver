import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { GameProvider } from './contexts/GameContext';
import LoadingScreen from './components/LoadingScreen';
import Navigation from './components/Navigation';
import './App.css';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Rewards = lazy(() => import('./pages/Rewards'));
const GameSelection = lazy(() => import('./pages/GameSelection'));
const Game = lazy(() => import('./pages/Game'));
const Settings = lazy(() => import('./pages/Settings'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Help = lazy(() => import('./pages/Help'));
const NotFound = lazy(() => import('./pages/NotFound'));

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const ProtectedLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <Outlet />
      </div>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<LoadingScreen />}> 
        <Routes>
          <Route 
            path="/login" 
            element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Login />
              </motion.div>
            } 
          />
          <Route 
            path="/register" 
            element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Register />
              </motion.div>
            } 
          />

          <Route
            element={
              <ProtectedRoute>
                <ProtectedLayout />
              </ProtectedRoute>
            }
          >
            <Route 
              path="/dashboard" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.05 }}
                >
                  <Dashboard />
                </motion.div>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Profile />
                </motion.div>
              } 
            />
            <Route 
              path="/leaderboard" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.05 }}
                >
                  <Leaderboard />
                </motion.div>
              } 
            />
            <Route 
              path="/rewards" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.05 }}
                >
                  <Rewards />
                </motion.div>
              } 
            />
            <Route 
              path="/game-selection" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.05 }}
                >
                  <GameSelection />
                </motion.div>
              } 
            />
            <Route 
              path="/game" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.05 }}
                >
                  <Game />
                </motion.div>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Settings />
                </motion.div>
              } 
            />
            <Route 
              path="/notifications" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Notifications />
                </motion.div>
              } 
            />
            <Route 
              path="/help" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Help />
                </motion.div>
              } 
            />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <div className="App">
          <AppRoutes />
        </div>
      </GameProvider>
    </AuthProvider>
  );
}

export default App;
