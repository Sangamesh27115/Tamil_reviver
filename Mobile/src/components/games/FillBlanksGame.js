import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const FillBlanksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SentenceContainer = styled.div`
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 15px;
  border: 2px solid #e9ecef;
  font-size: 1.2rem;
  line-height: 1.6;
  text-align: center;
`;

const BlankInput = styled.input`
  background: white;
  border: 2px solid #667eea;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  text-align: center;
  min-width: 150px;
  margin: 0 0.5rem;

  &:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
  }

  &.correct {
    border-color: #4CAF50;
    background: #e8f5e8;
  }

  &.wrong {
    border-color: #f44336;
    background: #ffebee;
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

const HintText = styled.div`
  background: #e3f2fd;
  color: #1976d2;
  padding: 1rem;
  border-radius: 10px;
  font-size: 0.9rem;
  text-align: center;
  border-left: 4px solid #2196f3;
`;

const FillBlanksGame = ({ question, onSubmit }) => {
  const [answer, setAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  const handleSubmit = () => {
    if (!answer.trim() || isSubmitted) return;

    setIsSubmitted(true);
    
    // Check if the answer is correct (case-insensitive)
    const correct = answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
    setIsCorrect(correct);
    
    setTimeout(() => {
      onSubmit(correct ? question.correctAnswer : answer);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // Parse the sentence to show the blank
  const renderSentence = () => {
    const sentence = question.question;
    const blankIndex = sentence.indexOf('_____');
    
    if (blankIndex === -1) {
      return sentence;
    }

    const beforeBlank = sentence.substring(0, blankIndex);
    const afterBlank = sentence.substring(blankIndex + 5);

    return (
      <>
        {beforeBlank}
        <BlankInput
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="?"
          disabled={isSubmitted}
          className={isSubmitted ? (isCorrect ? 'correct' : 'wrong') : ''}
        />
        {afterBlank}
      </>
    );
  };

  return (
    <FillBlanksContainer>
      <SentenceContainer>
        {renderSentence()}
      </SentenceContainer>

      {!isSubmitted && (
        <HintText>
          💡 Type your answer in the blank above and press Enter or click Submit
        </HintText>
      )}

      {isSubmitted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center' }}
        >
          {isCorrect ? (
            <div style={{ color: '#4CAF50', fontWeight: 'bold' }}>
              ✅ Correct! The answer is: {question.correctAnswer}
            </div>
          ) : (
            <div style={{ color: '#f44336', fontWeight: 'bold' }}>
              ❌ Incorrect. The correct answer is: {question.correctAnswer}
            </div>
          )}
        </motion.div>
      )}

      <SubmitButton
        onClick={handleSubmit}
        disabled={!answer.trim() || isSubmitted}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isSubmitted ? 'Checking...' : 'Submit Answer'}
      </SubmitButton>
    </FillBlanksContainer>
  );
};

export default FillBlanksGame;






