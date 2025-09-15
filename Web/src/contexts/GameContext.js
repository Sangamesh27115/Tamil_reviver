import React, { createContext, useContext, useReducer } from 'react';
import { gameAPI } from '../services/api';
import toast from 'react-hot-toast';

const GameContext = createContext();

const initialState = {
  currentGame: null,
  gameHistory: [],
  leaderboard: [],
  stats: null,
  loading: false,
  error: null
};

const gameReducer = (state, action) => {
  switch (action.type) {
    case 'GAME_START':
      return {
        ...state,
        currentGame: action.payload,
        loading: false,
        error: null
      };
    case 'GAME_UPDATE':
      return {
        ...state,
        currentGame: { ...state.currentGame, ...action.payload }
      };
    case 'GAME_END':
      return {
        ...state,
        currentGame: null,
        loading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'SET_HISTORY':
      return {
        ...state,
        gameHistory: action.payload
      };
    case 'SET_LEADERBOARD':
      return {
        ...state,
        leaderboard: action.payload
      };
    case 'SET_STATS':
      return {
        ...state,
        stats: action.payload
      };
    default:
      return state;
  }
};

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const startGame = async (gameData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await gameAPI.startGame(gameData);
      
      dispatch({ type: 'GAME_START', payload: response.data });
      toast.success('Game started!');
      
      return { success: true, game: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to start game';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const submitAnswer = async (sessionId, questionIndex, answer, timeSpent = 0) => {
    try {
      const response = await gameAPI.submitAnswer(sessionId, questionIndex, answer, timeSpent);
      
      // Update current game state
      dispatch({ 
        type: 'GAME_UPDATE', 
        payload: {
          score: response.data.score,
          correctAnswers: response.data.correctAnswers,
          wrongAnswers: response.data.wrongAnswers
        }
      });
      
      return { success: true, result: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to submit answer';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const useHint = async (sessionId, questionIndex) => {
    try {
      const response = await gameAPI.useHint(sessionId, questionIndex);
      return { success: true, hint: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to use hint';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const completeGame = async (sessionId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await gameAPI.completeGame(sessionId);
      
      dispatch({ type: 'GAME_END' });
      toast.success('Game completed!');
      
      return { success: true, result: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to complete game';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const abandonGame = async (sessionId) => {
    try {
      await gameAPI.abandonGame(sessionId);
      dispatch({ type: 'GAME_END' });
      toast.success('Game abandoned');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to abandon game';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const fetchGameHistory = async (params = {}) => {
    try {
      const response = await gameAPI.getGameHistory(params);
      dispatch({ type: 'SET_HISTORY', payload: response.data.gameSessions });
      return { success: true, history: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch game history';
      dispatch({ type: 'SET_ERROR', payload: message });
      return { success: false, error: message };
    }
  };

  const fetchLeaderboard = async (params = {}) => {
    try {
      const response = await gameAPI.getLeaderboard(params);
      dispatch({ type: 'SET_LEADERBOARD', payload: response.data.leaderboard });
      return { success: true, leaderboard: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch leaderboard';
      dispatch({ type: 'SET_ERROR', payload: message });
      return { success: false, error: message };
    }
  };

  const fetchStats = async () => {
    try {
      const response = await gameAPI.getStats();
      dispatch({ type: 'SET_STATS', payload: response.data });
      return { success: true, stats: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch stats';
      dispatch({ type: 'SET_ERROR', payload: message });
      return { success: false, error: message };
    }
  };

  const getActiveGame = async () => {
    try {
      const response = await gameAPI.getActiveGame();
      dispatch({ type: 'GAME_START', payload: response.data.gameSession });
      return { success: true, game: response.data.gameSession };
    } catch (error) {
      if (error.response?.status === 404) {
        return { success: false, error: 'No active game found' };
      }
      const message = error.response?.data?.message || 'Failed to fetch active game';
      dispatch({ type: 'SET_ERROR', payload: message });
      return { success: false, error: message };
    }
  };

  const value = {
    ...state,
    startGame,
    submitAnswer,
    useHint,
    completeGame,
    abandonGame,
    fetchGameHistory,
    fetchLeaderboard,
    fetchStats,
    getActiveGame
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
