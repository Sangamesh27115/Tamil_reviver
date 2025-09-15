import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const MCQContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const OptionButton = styled(motion.button)`
  background: ${props => {
    if (props.selected && props.correct) return '#4CAF50';
    if (props.selected && props.wrong) return '#f44336';
    if (props.correct && props.showResult) return '#4CAF50';
    if (props.wrong && props.showResult) return '#f44336';
    if (props.selected) return '#667eea';
    return 'white';
  }};
  color: ${props => {
    if (props.selected || props.correct || props.wrong) return 'white';
    return '#333';
  }};
  border: 2px solid ${props => {
    if (props.selected && props.correct) return '#4CAF50';
    if (props.selected && props.wrong) return '#f44336';
    if (props.correct && props.showResult) return '#4CAF50';
    if (props.wrong && props.showResult) return '#f44336';
    if (props.selected) return '#667eea';
    return '#e0e0e0';
  }};
  padding: 1.5rem;
  border-radius: 15px;
  cursor: pointer;
  text-align: left;
  font-size: 1.1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const OptionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const OptionLetter = styled.div`
  background: ${props => {
    if (props.selected && props.correct) return 'rgba(255,255,255,0.3)';
    if (props.selected && props.wrong) return 'rgba(255,255,255,0.3)';
    if (props.correct && props.showResult) return 'rgba(255,255,255,0.3)';
    if (props.wrong && props.showResult) return 'rgba(255,255,255,0.3)';
    if (props.selected) return 'rgba(255,255,255,0.3)';
    return '#f0f0f0';
  }};
  color: ${props => {
    if (props.selected || props.correct || props.wrong) return 'white';
    return '#666';
  }};
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1rem;
`;

const OptionText = styled.div`
  flex: 1;
  line-height: 1.4;
`;

const ResultIcon = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
`;

const SubmitButton = styled(motion.button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  font-size: 1.1rem;
  margin-top: 1rem;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const MCQGame = ({ question, onSubmit }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleOptionSelect = (option) => {
    if (isSubmitted) return;
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!selectedOption || isSubmitted) return;

    setIsSubmitted(true);
    setShowResult(true);
    
    const isCorrect = selectedOption === question.correctAnswer;
    
    setTimeout(() => {
      onSubmit(isCorrect ? question.correctAnswer : selectedOption);
    }, 2000);
  };

  const getOptionState = (option) => {
    if (!showResult) {
      return {
        selected: selectedOption === option,
        correct: false,
        wrong: false,
      };
    }

    return {
      selected: selectedOption === option,
      correct: option === question.correctAnswer,
      wrong: selectedOption === option && option !== question.correctAnswer,
      showResult: true,
    };
  };

  const getResultIcon = (option) => {
    if (!showResult) return null;
    
    if (option === question.correctAnswer) {
      return <ResultIcon>✅</ResultIcon>;
    }
    
    if (selectedOption === option && option !== question.correctAnswer) {
      return <ResultIcon>❌</ResultIcon>;
    }
    
    return null;
  };

  return (
    <MCQContainer>
      {question.options?.map((option, index) => {
        const state = getOptionState(option);
        const letter = String.fromCharCode(65 + index); // A, B, C, D
        
        return (
          <OptionButton
            key={index}
            onClick={() => handleOptionSelect(option)}
            disabled={isSubmitted}
            selected={state.selected}
            correct={state.correct}
            wrong={state.wrong}
            showResult={state.showResult}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <OptionLabel>
              <OptionLetter
                selected={state.selected}
                correct={state.correct}
                wrong={state.wrong}
                showResult={state.showResult}
              >
                {letter}
              </OptionLetter>
              <OptionText>{option}</OptionText>
            </OptionLabel>
            {getResultIcon(option)}
          </OptionButton>
        );
      })}

      <SubmitButton
        onClick={handleSubmit}
        disabled={!selectedOption || isSubmitted}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isSubmitted ? 'Checking...' : 'Submit Answer'}
      </SubmitButton>
    </MCQContainer>
  );
};

export default MCQGame;






