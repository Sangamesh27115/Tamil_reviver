import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const MatchContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const OptionCard = styled(motion.div)`
  background: ${props => {
    if (props.selected) return '#667eea';
    if (props.matched) return '#4CAF50';
    if (props.wrong) return '#f44336';
    return '#f8f9fa';
  }};
  color: ${props => {
    if (props.selected || props.matched || props.wrong) return 'white';
    return '#333';
  }};
  padding: 1.5rem;
  border-radius: 15px;
  cursor: pointer;
  text-align: center;
  font-weight: bold;
  font-size: 1.1rem;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    border-color: #667eea;
    transform: translateY(-2px);
  }
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

const MatchGame = ({ question, onSubmit }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [wrongPairs, setWrongPairs] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Parse the question to extract Tamil and English options
  const parseQuestion = () => {
    const isTamilToEnglish = question.question.includes('Tamil word');
    const correctAnswer = question.correctAnswer;
    
    // For match games, we need to create pairs
    // This is a simplified version - in a real app, you'd have more sophisticated parsing
    const options = [];
    
    if (isTamilToEnglish) {
      // Tamil word to English meaning
      options.push({
        id: 'tamil',
        text: question.question.match(/"([^"]+)"/)?.[1] || 'Tamil Word',
        type: 'tamil'
      });
      options.push({
        id: 'english',
        text: correctAnswer,
        type: 'english'
      });
    } else {
      // English meaning to Tamil word
      options.push({
        id: 'english',
        text: question.question.match(/"([^"]+)"/)?.[1] || 'English Meaning',
        type: 'english'
      });
      options.push({
        id: 'tamil',
        text: correctAnswer,
        type: 'tamil'
      });
    }

    return options;
  };

  const options = parseQuestion();

  const handleOptionClick = (option) => {
    if (isSubmitted) return;

    setSelectedOptions(prev => {
      if (prev.includes(option.id)) {
        return prev.filter(id => id !== option.id);
      } else if (prev.length < 2) {
        return [...prev, option.id];
      } else {
        // Replace the first selection
        return [prev[1], option.id];
      }
    });
  };

  const handleSubmit = () => {
    if (selectedOptions.length !== 2) return;

    setIsSubmitted(true);
    
    // Check if the selected pair is correct
    const isCorrect = selectedOptions.includes('tamil') && selectedOptions.includes('english');
    
    if (isCorrect) {
      setMatchedPairs(selectedOptions);
      setTimeout(() => {
        onSubmit(question.correctAnswer);
      }, 1000);
    } else {
      setWrongPairs(selectedOptions);
      setTimeout(() => {
        onSubmit('wrong');
      }, 1000);
    }
  };

  const getOptionState = (option) => {
    if (matchedPairs.includes(option.id)) return 'matched';
    if (wrongPairs.includes(option.id)) return 'wrong';
    if (selectedOptions.includes(option.id)) return 'selected';
    return 'default';
  };

  return (
    <MatchContainer>
      <OptionsGrid>
        {options.map((option) => (
          <OptionCard
            key={option.id}
            selected={selectedOptions.includes(option.id)}
            matched={matchedPairs.includes(option.id)}
            wrong={wrongPairs.includes(option.id)}
            onClick={() => handleOptionClick(option)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {option.text}
          </OptionCard>
        ))}
      </OptionsGrid>

      <SubmitButton
        onClick={handleSubmit}
        disabled={selectedOptions.length !== 2 || isSubmitted}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isSubmitted ? 'Checking...' : 'Submit Match'}
      </SubmitButton>
    </MatchContainer>
  );
};

export default MatchGame;

