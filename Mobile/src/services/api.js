// Mobile/src/services/api.js
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with proper error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token
      try {
        await SecureStore.deleteItemAsync('token');
      } catch (e) {
        // ignore
      }
      // Optionally trigger app-wide logout flow here
    }
    return Promise.reject(error);
  }
);

// Game API functions - match backend endpoints
export const gameAPI = {
  startGame: (gameData) => api.post('/game/start', gameData),
  submitAnswer: (sessionId, questionIndex, answer, timeSpent = 0) =>
    api.post(`/game/${sessionId}/answer`, { questionIndex, answer, timeSpent }),
  useHint: (sessionId, questionIndex) => api.post(`/game/${sessionId}/hint`, { questionIndex }),
  completeGame: (sessionId) => api.post(`/game/${sessionId}/complete`),
  abandonGame: (sessionId) => api.post(`/game/${sessionId}/abandon`),
  getGameHistory: (params = {}) => api.get('/game/history', { params }),
  getLeaderboard: (params = {}) => api.get('/game/leaderboard', { params }),
  getUserStats: () => api.get('/game/stats'),
  getActiveGame: () => api.get('/game/active')
};

// Word API functions
export const wordAPI = {
  getWords: (params = {}) => api.get('/words', { params }),
  getRandomWords: (params = {}) => api.get('/words/random', { params }),
  searchWords: (params = {}) => api.get('/words/search', { params }),
  getWord: (id) => api.get(`/words/${id}`),
  getWordStats: () => api.get('/words/stats/overview')
};

// Auth API functions
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  changePassword: (currentPassword, newPassword) => api.put('/auth/change-password', { currentPassword, newPassword })
};

export default api;
