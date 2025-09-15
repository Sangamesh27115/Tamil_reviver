import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { GameProvider } from './contexts/GameContext';
import LoadingScreen from './components/LoadingScreen';
import Navigation from './components/Navigation';
import './index.css';

// Lazy load pages for better performance
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const GameSelection = lazy(() => import('./pages/GameSelection'));
const Game = lazy(() => import('./pages/Game'));
const Settings = lazy(() => import('./pages/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Student specific pages
const StudentDashboard = lazy(() => import('./pages/student/StudentDashboard'));
const StudentTasks = lazy(() => import('./pages/student/StudentTasks'));
const StudentStats = lazy(() => import('./pages/student/StudentStats'));

// Teacher specific pages
const TeacherDashboard = lazy(() => import('./pages/teacher/TeacherDashboard'));
const TeacherTasks = lazy(() => import('./pages/teacher/TeacherTasks'));
const TeacherStudents = lazy(() => import('./pages/teacher/TeacherStudents'));
const TeacherStats = lazy(() => import('./pages/teacher/TeacherStats'));

// Admin specific pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminWords = lazy(() => import('./pages/admin/AdminWords'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminStats = lazy(() => import('./pages/admin/AdminStats'));

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

const ProtectedLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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
          {/* Public Routes */}
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

          {/* Protected Routes */}
          <Route
            element={
              <ProtectedRoute>
                <ProtectedLayout />
              </ProtectedRoute>
            }
          >
            {/* Common Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/game-selection" element={<GameSelection />} />
            <Route path="/game" element={<Game />} />
            <Route path="/settings" element={<Settings />} />

            {/* Student Routes */}
            <Route 
              path="/student/*" 
              element={
                <ProtectedRoute allowedRoles={['Student']}>
                  <Routes>
                    <Route path="dashboard" element={<StudentDashboard />} />
                    <Route path="tasks" element={<StudentTasks />} />
                    <Route path="stats" element={<StudentStats />} />
                  </Routes>
                </ProtectedRoute>
              } 
            />

            {/* Teacher Routes */}
            <Route 
              path="/teacher/*" 
              element={
                <ProtectedRoute allowedRoles={['Teacher']}>
                  <Routes>
                    <Route path="dashboard" element={<TeacherDashboard />} />
                    <Route path="tasks" element={<TeacherTasks />} />
                    <Route path="students" element={<TeacherStudents />} />
                    <Route path="stats" element={<TeacherStats />} />
                  </Routes>
                </ProtectedRoute>
              } 
            />

            {/* Admin Routes */}
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="words" element={<AdminWords />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="stats" element={<AdminStats />} />
                  </Routes>
                </ProtectedRoute>
              } 
            />
          </Route>

          {/* Error Routes */}
          <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
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
