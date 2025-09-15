import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { gameAPI } from '../services/api';
import toast from 'react-hot-toast';

const GameContext = createContext();

// Game state reducer
const gameReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'START_GAME':
      return {
        ...state,
        currentGame: {
          sessionId: action.payload.sessionId,
          gameType: action.payload.gameType,
          totalQuestions: action.payload.totalQuestions,
          questions: action.payload.questions,
          currentQuestionIndex: 0,
          answers: [],
          startTime: Date.now(),
        },
        loading: false,
      };
    
    case 'SUBMIT_ANSWER':
      const newAnswers = [...state.currentGame.answers];
      newAnswers[action.payload.questionIndex] = {
        questionId: action.payload.questionId,
        answer: action.payload.answer,
        timeSpent: action.payload.timeSpent,
        isCorrect: action.payload.isCorrect,
        points: action.payload.points,
        correctAnswer: action.payload.correctAnswer,
      };
      
      return {
        ...state,
        currentGame: {
          ...state.currentGame,
          answers: newAnswers,
          currentQuestionIndex: state.currentGame.currentQuestionIndex + 1,
        },
      };
    
    case 'COMPLETE_GAME':
      return {
        ...state,
        currentGame: null,
        gameResult: action.payload,
        loading: false,
      };
    
    case 'RESET_GAME':
      return {
        ...state,
        currentGame: null,
        gameResult: null,
        loading: false,
      };
    
    case 'SET_USER_STATS':
      return {
        ...state,
        userStats: action.payload,
      };
    
    case 'SET_LEADERBOARD':
      return {
        ...state,
        leaderboard: action.payload,
      };
    
    case 'SET_GAME_HISTORY':
      return {
        ...state,
        gameHistory: action.payload,
      };
    
    default:
      return state;
  }
};

const initialState = {
  loading: false,
  currentGame: null,
  gameResult: null,
  userStats: null,
  leaderboard: [],
  gameHistory: [],
};

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Start a new game
  const startGame = async (gameConfig) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await gameAPI.startGame(gameConfig);
      
      dispatch({
        type: 'START_GAME',
        payload: response.data,
      });
      
      toast.success('Game started! Good luck!');
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      toast.error(error.response?.data?.message || 'Failed to start game');
      throw error;
    }
  };

  // Submit an answer
  const submitAnswer = async (questionId, answer, timeSpent) => {
    try {
      const response = await gameAPI.submitAnswer({
        sessionId: state.currentGame.sessionId,
        questionId,
        answer,
        timeSpent,
      });

      dispatch({
        type: 'SUBMIT_ANSWER',
        payload: {
          questionIndex: state.currentGame.currentQuestionIndex,
          questionId,
          answer,
          timeSpent,
          ...response.data,
        },
      });

      if (response.data.isCorrect) {
        toast.success(`Correct! +${response.data.points} points`);
      } else {
        toast.error(`Wrong! The correct answer is: ${response.data.correctAnswer}`);
      }

      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit answer');
      throw error;
    }
  };

  // Complete the game
  const completeGame = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await gameAPI.completeGame(state.currentGame.sessionId);
      
      dispatch({
        type: 'COMPLETE_GAME',
        payload: response.data,
      });

      // Refresh user stats
      await fetchUserStats();
      
      toast.success(`Game completed! Score: ${response.data.totalScore}`);
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      toast.error(error.response?.data?.message || 'Failed to complete game');
      throw error;
    }
  };

  // Fetch user statistics
  const fetchUserStats = async () => {
    try {
      const response = await gameAPI.getUserStats();
      dispatch({ type: 'SET_USER_STATS', payload: response.data });
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    }
  };

  // Fetch leaderboard
  const fetchLeaderboard = async (limit = 10) => {
    try {
      const response = await gameAPI.getLeaderboard(limit);
      dispatch({ type: 'SET_LEADERBOARD', payload: response.data });
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    }
  };

  // Fetch game history
  const fetchGameHistory = async (params = {}) => {
    try {
      const response = await gameAPI.getGameHistory(params);
      dispatch({ type: 'SET_GAME_HISTORY', payload: response.data });
    } catch (error) {
      console.error('Failed to fetch game history:', error);
    }
  };

  // Reset current game
  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  // Get current question
  const getCurrentQuestion = () => {
    if (!state.currentGame || state.currentGame.currentQuestionIndex >= state.currentGame.questions.length) {
      return null;
    }
    return state.currentGame.questions[state.currentGame.currentQuestionIndex];
  };

  // Check if game is completed
  const isGameCompleted = () => {
    return state.currentGame && 
           state.currentGame.currentQuestionIndex >= state.currentGame.questions.length;
  };

  // Get game progress
  const getGameProgress = () => {
    if (!state.currentGame) return 0;
    return (state.currentGame.currentQuestionIndex / state.currentGame.totalQuestions) * 100;
  };

  // Get current score
  const getCurrentScore = () => {
    if (!state.currentGame) return 0;
    return state.currentGame.answers.reduce((total, answer) => total + (answer?.points || 0), 0);
  };

  // Get correct answers count
  const getCorrectAnswersCount = () => {
    if (!state.currentGame) return 0;
    return state.currentGame.answers.filter(answer => answer?.isCorrect).length;
  };

  const value = {
    ...state,
    startGame,
    submitAnswer,
    completeGame,
    fetchUserStats,
    fetchLeaderboard,
    fetchGameHistory,
    resetGame,
    getCurrentQuestion,
    isGameCompleted,
    getGameProgress,
    getCurrentScore,
    getCorrectAnswersCount,
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

