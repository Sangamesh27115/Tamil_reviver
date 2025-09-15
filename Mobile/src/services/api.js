import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Game API functions
export const gameAPI = {
  // Start a new game
  startGame: (gameData) => api.post('/game/start-game', gameData),
  
  // Submit answer
  submitAnswer: (answerData) => api.post('/game/submit-answer', answerData),
  
  // Complete game
  completeGame: (sessionId) => api.post('/game/complete-game', { sessionId }),
  
  // Get game history
  getGameHistory: (params = {}) => api.get('/game/history', { params }),
  
  // Get leaderboard
  getLeaderboard: (limit = 10) => api.get('/game/leaderboard', { params: { limit } }),
  
  // Get user stats
  getUserStats: () => api.get('/game/stats'),
};

// Word API functions
export const wordAPI = {
  // Get all words
  getWords: (params = {}) => api.get('/words', { params }),
  
  // Get word by ID
  getWord: (id) => api.get(`/words/${id}`),
  
  // Get word statistics
  getWordStats: () => api.get('/words/stats/overview'),
};

// Auth API functions
export const authAPI = {
  // Register user
  register: (userData) => api.post('/auth/register', userData),
  
  // Login user
  login: (credentials) => api.post('/auth/login', credentials),
};

export default api;
