// Web/src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  changePassword: (currentPassword, newPassword) => 
    api.put('/auth/change-password', { currentPassword, newPassword }),
  getUsers: (params) => api.get('/auth/users', { params }),
  updateUserStatus: (userId, isActive) => 
    api.put(`/auth/users/${userId}/status`, { isActive }),
  getStudents: () => api.get('/auth/students'),
  assignStudents: (teacherId, studentIds) => 
    api.post(`/auth/teachers/${teacherId}/students`, { studentIds }),
};

// Game API
export const gameAPI = {
  startGame: (gameData) => api.post('/game/start', gameData),
  submitAnswer: (sessionId, questionIndex, answer, timeSpent) => 
    api.post(`/game/${sessionId}/answer`, { questionIndex, answer, timeSpent }),
  useHint: (sessionId, questionIndex) => 
    api.post(`/game/${sessionId}/hint`, { questionIndex }),
  completeGame: (sessionId) => api.post(`/game/${sessionId}/complete`),
  abandonGame: (sessionId) => api.post(`/game/${sessionId}/abandon`),
  getGameHistory: (params) => api.get('/game/history', { params }),
  getLeaderboard: (params) => api.get('/game/leaderboard', { params }),
  getStats: () => api.get('/game/stats'),
  getActiveGame: () => api.get('/game/active'),
};

// Word API
export const wordAPI = {
  getWords: (params) => api.get('/words', { params }),
  getRandomWords: (params) => api.get('/words/random', { params }),
  searchWords: (params) => api.get('/words/search', { params }),
  getWord: (id) => api.get(`/words/${id}`),
  createWord: (wordData) => api.post('/words', wordData),
  updateWord: (id, wordData) => api.put(`/words/${id}`, wordData),
  deleteWord: (id) => api.delete(`/words/${id}`),
  getWordStats: () => api.get('/words/stats/overview'),
  bulkImportWords: (words) => api.post('/words/bulk-import', { words }),
  getFilterMetadata: () => api.get('/words/meta/filters'),
};

// Task API
export const taskAPI = {
  createTask: (taskData) => api.post('/tasks', taskData),
  assignTask: (taskId, studentIds) => 
    api.post(`/tasks/${taskId}/assign`, { studentIds }),
  getTeacherTasks: (params) => api.get('/tasks/teacher', { params }),
  getStudentTasks: (params) => api.get('/tasks/student', { params }),
  getTask: (taskId) => api.get(`/tasks/${taskId}`),
  updateTask: (taskId, taskData) => api.put(`/tasks/${taskId}`, taskData),
  updateStudentProgress: (taskId, studentId, progressData) => 
    api.put(`/tasks/${taskId}/student/${studentId}`, progressData),
  submitTask: (taskId, submissionData) => 
    api.post(`/tasks/${taskId}/submit`, submissionData),
  getTaskStats: (taskId) => api.get(`/tasks/${taskId}/stats`),
  deleteTask: (taskId) => api.delete(`/tasks/${taskId}`),
  getAllTasks: (params) => api.get('/tasks', { params }),
  checkOverdueTasks: () => api.post('/tasks/check-overdue'),
};

export default api;
