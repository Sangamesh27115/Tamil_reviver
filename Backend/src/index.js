import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';

// Load environment variables
dotenv.config();

// Import routes
import authRouts from './routes/authRouts.js';
import gameRoutes from './routes/gameRoutes.js';
import wordRoutes from './routes/wordRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { connectDB } from './lib/db.js';

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use("/api/auth", authRouts);
app.use("/api/game", gameRoutes);
app.use("/api/words", wordRoutes);
app.use("/api/tasks", taskRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Tamil Word Game API is running!",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl
  });
});

// General Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.message
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token'
    });
  }

  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production'
      ? 'Something went wrong'
      : err.message
  });
});

// Start the server
const server = app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
  console.log(`📡 Health check: http://localhost:${port}/api/health`);

  connectDB(process.env.MONGO_URL).catch(error => {
    console.error('❌ Database connection failed:', error.message);
  });
});

// Handle server errors
server.on('error', (error) => {
  console.error('❌ Server error:', error);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
