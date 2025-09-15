import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Trophy, Target, Clock, RotateCcw, Home } from 'lucide-react';
import styled from 'styled-components';

const ResultContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
`;

const ResultCard = styled(motion.div)`
  background: white;
  border-radius: 25px;
  padding: 3rem 2rem;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  width: 100%;
  max-width: 500px;
  text-align: center;
  color: #333;
`;

const TrophyIcon = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  margin: 0 auto 2rem;
  color: white;
`;

const ResultTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #333;
`;

const ScoreDisplay = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 20px;
  margin: 2rem 0;
`;

const ScoreNumber = styled.div`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const ScoreLabel = styled.div`
  font-size: 1.1rem;
  opacity: 0.9;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin: 2rem 0;
`;

const StatItem = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 15px;
  text-align: center;
`;

const StatIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #667eea;
  color: white;
  margin: 0 auto 1rem;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const PerformanceMessage = styled.div`
  background: ${props => {
    const accuracy = props.accuracy;
    if (accuracy >= 80) return '#e8f5e8';
    if (accuracy >= 60) return '#fff3e0';
    return '#ffebee';
  }};
  color: ${props => {
    const accuracy = props.accuracy;
    if (accuracy >= 80) return '#2e7d32';
    if (accuracy >= 60) return '#f57c00';
    return '#c62828';
  }};
  padding: 1rem;
  border-radius: 15px;
  margin: 1.5rem 0;
  font-weight: bold;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const ActionButton = styled(motion.button)`
  flex: 1;
  padding: 1rem;
  border-radius: 15px;
  font-weight: bold;
  cursor: pointer;
  border: none;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  &.secondary {
    background: #f0f0f0;
    color: #666;
  }
`;

const GameResult = ({ result, onPlayAgain, onBackToDashboard }) => {
  useNavigate();
  
  const accuracy = parseFloat(result.accuracy);
  const totalScore = result.totalScore;
  const correctAnswers = result.correctAnswers;
  const totalQuestions = result.totalQuestions;
  const timeSpent = result.timeSpent;

  const getPerformanceMessage = () => {
    if (accuracy >= 90) return "🏆 Outstanding! You're a Tamil word master!";
    if (accuracy >= 80) return "🌟 Excellent work! Keep it up!";
    if (accuracy >= 70) return "👍 Good job! You're improving!";
    if (accuracy >= 60) return "📚 Not bad! Practice makes perfect!";
    return "💪 Keep practicing! You'll get better!";
  };

  // Reserved for future use: dynamic trophy color by accuracy

  return (
    <ResultContainer>
      <ResultCard
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <TrophyIcon
          initial={{ rotate: -180, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <Trophy size={50} />
        </TrophyIcon>

        <ResultTitle>Game Complete!</ResultTitle>

        <ScoreDisplay>
          <ScoreNumber>{totalScore}</ScoreNumber>
          <ScoreLabel>Total Points</ScoreLabel>
        </ScoreDisplay>

        <StatsGrid>
          <StatItem>
            <StatIcon>
              <Target size={24} />
            </StatIcon>
            <StatValue>{correctAnswers}/{totalQuestions}</StatValue>
            <StatLabel>Correct Answers</StatLabel>
          </StatItem>

          <StatItem>
            <StatIcon>
              <Clock size={24} />
            </StatIcon>
            <StatValue>{Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}</StatValue>
            <StatLabel>Time Spent</StatLabel>
          </StatItem>
        </StatsGrid>

        <PerformanceMessage accuracy={accuracy}>
          {getPerformanceMessage()}
        </PerformanceMessage>

        <ButtonGroup>
          <ActionButton
            className="secondary"
            onClick={onBackToDashboard}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Home size={20} />
            Dashboard
          </ActionButton>

          <ActionButton
            className="primary"
            onClick={onPlayAgain}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw size={20} />
            Play Again
          </ActionButton>
        </ButtonGroup>
      </ResultCard>
    </ResultContainer>
  );
};

export default GameResult;


