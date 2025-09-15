import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { ArrowLeft, Clock, Target, CheckCircle, XCircle } from 'lucide-react';
import styled from 'styled-components';
import MatchGame from '../components/games/MatchGame';
import FillBlanksGame from '../components/games/FillBlanksGame';
import MCQGame from '../components/games/MCQGame';
import GameResult from '../components/games/GameResult';

const GameContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
  display: flex;
  flex-direction: column;
`;

const GameHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  color: white;
`;

const BackButton = styled(motion.button)`
  background: rgba(255,255,255,0.2);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  backdrop-filter: blur(10px);
`;

const GameInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255,255,255,0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  backdrop-filter: blur(10px);
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255,255,255,0.2);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 2rem;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #8BC34A);
  border-radius: 4px;
`;

const GameContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const QuestionCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  width: 100%;
  max-width: 600px;
  margin-bottom: 2rem;
`;

const QuestionNumber = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
  margin-bottom: 1rem;
  display: inline-block;
`;

const QuestionText = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1.5rem;
  line-height: 1.4;
  text-align: center;
`;

const GameTypeIndicator = styled.div`
  background: ${props => {
    switch(props.gameType) {
      case 'match': return '#4CAF50';
      case 'fill_blanks': return '#FF9800';
      case 'mcq': return '#2196F3';
      default: return '#666';
    }
  }};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: bold;
  margin-bottom: 1rem;
  display: inline-block;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  color: white;
`;

const LoadingSpinner = styled(motion.div)`
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255,255,255,0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  margin-bottom: 1rem;
`;

const Game = () => {
  const navigate = useNavigate();
  const {
    currentGame,
    gameResult,
    loading,
    getCurrentQuestion,
    isGameCompleted,
    getGameProgress,
    getCurrentScore,
    getCorrectAnswersCount,
    submitAnswer,
    completeGame,
    resetGame,
  } = useGame();

  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  useEffect(() => {
    if (!currentGame && !gameResult) {
      navigate('/game-selection');
    }
  }, [currentGame, gameResult, navigate]);

  useEffect(() => {
    if (currentGame) {
      setQuestionStartTime(Date.now());
    }
  }, [currentGame?.currentQuestionIndex]);

  const handleAnswerSubmit = async (answer) => {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return;

    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    
    try {
      await submitAnswer(currentQuestion.questionId, answer, timeSpent);
    } catch (error) {
      console.error('Failed to submit answer:', error);
    }
  };

  const handleGameComplete = async () => {
    try {
      await completeGame();
    } catch (error) {
      console.error('Failed to complete game:', error);
    }
  };

  const handleBackToSelection = () => {
    resetGame();
    navigate('/game-selection');
  };

  const handlePlayAgain = () => {
    resetGame();
    navigate('/game-selection');
  };

  if (loading) {
    return (
      <GameContainer>
        <LoadingContainer>
          <LoadingSpinner
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p>Loading game...</p>
        </LoadingContainer>
      </GameContainer>
    );
  }

  if (gameResult) {
    return (
      <GameResult
        result={gameResult}
        onPlayAgain={handlePlayAgain}
        onBackToDashboard={() => navigate('/dashboard')}
      />
    );
  }

  if (!currentGame) {
    return (
      <GameContainer>
        <LoadingContainer>
          <p>No active game found</p>
          <button onClick={handleBackToSelection}>Back to Game Selection</button>
        </LoadingContainer>
      </GameContainer>
    );
  }

  const currentQuestion = getCurrentQuestion();
  const progress = getGameProgress();
  const currentScore = getCurrentScore();
  const correctCount = getCorrectAnswersCount();

  const getGameTypeLabel = (type) => {
    switch(type) {
      case 'match': return 'Match the Following';
      case 'fill_blanks': return 'Fill in the Blanks';
      case 'mcq': return 'Multiple Choice';
      default: return 'Game';
    }
  };

  return (
    <GameContainer>
      <GameHeader>
        <BackButton
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleBackToSelection}
        >
          <ArrowLeft size={24} />
        </BackButton>

        <GameInfo>
          <InfoItem>
            <Target size={16} />
            <span>{currentScore} pts</span>
          </InfoItem>
          <InfoItem>
            <CheckCircle size={16} />
            <span>{correctCount}/{currentGame.totalQuestions}</span>
          </InfoItem>
        </GameInfo>
      </GameHeader>

      <ProgressBar>
        <ProgressFill
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </ProgressBar>

      <GameContent>
        <AnimatePresence mode="wait">
          {currentQuestion && (
            <QuestionCard
              key={currentGame.currentQuestionIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <GameTypeIndicator gameType={currentGame.gameType}>
                {getGameTypeLabel(currentGame.gameType)}
              </GameTypeIndicator>
              
              <QuestionNumber>
                Question {currentGame.currentQuestionIndex + 1} of {currentGame.totalQuestions}
              </QuestionNumber>

              <QuestionText>{currentQuestion.question}</QuestionText>

              {currentGame.gameType === 'match' && (
                <MatchGame
                  question={currentQuestion}
                  onSubmit={handleAnswerSubmit}
                />
              )}

              {currentGame.gameType === 'fill_blanks' && (
                <FillBlanksGame
                  question={currentQuestion}
                  onSubmit={handleAnswerSubmit}
                />
              )}

              {currentGame.gameType === 'mcq' && (
                <MCQGame
                  question={currentQuestion}
                  onSubmit={handleAnswerSubmit}
                />
              )}
            </QuestionCard>
          )}
        </AnimatePresence>

        {isGameCompleted() && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', color: 'white' }}
          >
            <h3>All questions completed!</h3>
            <p>Final Score: {currentScore} points</p>
            <button
              onClick={handleGameComplete}
              style={{
                background: 'white',
                color: '#667eea',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '25px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginTop: '1rem',
              }}
            >
              Complete Game
            </button>
          </motion.div>
        )}
      </GameContent>
    </GameContainer>
  );
};

export default Game;
