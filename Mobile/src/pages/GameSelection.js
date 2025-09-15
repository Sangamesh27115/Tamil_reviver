import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';

const games = [
  { key: 'match', title: 'Match Game', description: 'Match words with meanings', color: 'from-green-400 to-emerald-500' },
  { key: 'fill_blanks', title: 'Fill in the Blanks', description: 'Complete the missing words', color: 'from-orange-400 to-amber-500' },
  { key: 'mcq', title: 'MCQ Game', description: 'Choose the correct answer', color: 'from-blue-400 to-cyan-500' },
];

const GameSelection = () => {
  const navigate = useNavigate();
  const { startGame, loading } = useGame();

  const handleStart = async (gameType) => {
    try {
      await startGame({ gameType });
      navigate('/game');
    } catch (e) {
      // error toast handled in context
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Choose a Game</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {games.map((g, idx) => (
          <motion.button
            key={g.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleStart(g.key)}
            disabled={loading}
            className={`text-left p-6 rounded-xl text-white bg-gradient-to-r ${g.color} shadow-md disabled:opacity-70`}
          >
            <h3 className="text-xl font-semibold">{g.title}</h3>
            <p className="text-white/90 mt-2">{g.description}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default GameSelection;


