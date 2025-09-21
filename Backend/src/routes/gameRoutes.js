import express from "express";
import GameSession from "../models/GameSession.js";
import Word from "../models/Word.js";
import { User, Student } from "../models/User.js";
import { authenticateToken, requireStudent } from "../middleware/auth.js";
import Achievement from "../models/Achievement.js";
import Reward from "../models/Reward.js";

const router = express.Router();

// Start a new game session
router.post("/start", authenticateToken, requireStudent, async (req, res) => {
  try {
    const { gameType, difficulty, wordCount = 10, domain, period } = req.body;

    if (!gameType || !['match', 'mcq', 'hints', 'jumbled'].includes(gameType)) {
      return res.status(400).json({ message: 'Invalid game type. Must be match, mcq, hints, or jumbled' });
    }

    // Build filters for word selection
    const filters = { isActive: true };
    if (difficulty) filters.difficulty = difficulty;
    if (domain && domain !== 'All') filters.domain = domain;
    if (period && period !== 'All') filters.period = period;

    // Determine how many words were requested (ensure integer)
    const requestedCount = Number.isFinite(Number.parseInt(wordCount)) ? parseInt(wordCount) : 10;

    // Diagnostic logging to help debug mismatches between DB and aggregation
    console.log('[game/start] requesting words', { requestedCount, filters });

    // Get random words
    const words = await Word.getRandomWords(requestedCount, filters);

    console.log('[game/start] Word.getRandomWords returned', { count: words.length, ids: words.map(w => w._id ? w._id.toString() : w._id) });

    if (words.length < requestedCount) {
      return res.status(400).json({ 
        message: `Not enough words available. Found ${words.length} words.` 
      });
    }

    // Create questions based on game type
    let questions = [];

    if (gameType === 'match') {
      const wordItems = words.map(word => ({
        wordId: word._id,
        word: word.word
      }));

      const meaningItems = words.map(word => ({
        wordId: word._id,
        meaning: word.meaning_ta
      }));

      const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);

      questions = [{
        wordItems: shuffleArray([...wordItems]),
        meaningItems: shuffleArray([...meaningItems]),
        correctPairs: words.reduce((acc, word) => {
          acc[word._id.toString()] = word.meaning_ta;
          return acc;
        }, {})
      }];
    } else if (gameType === 'mcq') {
      questions = await Promise.all(words.map(async (word) => {
        // Ensure wrong options do not include correct meaning
        let wrongAnswers = [];
        while (wrongAnswers.length < 3) {
          const candidates = await Word.getRandomWords(1, {
            isActive: true,
            _id: { $ne: word._id }
          });
          if (candidates.length && candidates[0].meaning_ta !== word.meaning_ta) {
            wrongAnswers.push(candidates[0]);
          }
        }

        const options = [
          word.meaning_ta,
          ...wrongAnswers.map(w => w.meaning_ta)
        ].sort(() => Math.random() - 0.5);

        return {
          wordId: word._id,
          question: `What is the meaning of "${word.word}"?`,
          options,
          correctAnswer: word.meaning_ta,
          word: word.word,
          meaning_ta: word.meaning_ta,
          meaning_en: word.meaning_en
        };
      }));
    } else if (gameType === 'hints') {
      questions = words.map(word => ({
        wordId: word._id,
        question: `Guess the word using hints: ${word.notes || 'No hints available'}`,
        correctAnswer: word.word,
        word: word.word,
        meaning_ta: word.meaning_ta,
        meaning_en: word.meaning_en,
        notes: word.notes
      }));
    } else if (gameType === 'jumbled') {
      questions = words.map(word => {
        // Jumble the letters of the word
        const jumbledWord = word.word
          .split('')
          .sort(() => Math.random() - 0.5)
          .join('');
        return {
          wordId: word._id,
          question: `Unscramble this word: ${jumbledWord}`,
          correctAnswer: word.word,
          jumbledWord,
          word: word.word,
          meaning_ta: word.meaning_ta,
          meaning_en: word.meaning_en
        };
      });
    }

    const gameSession = new GameSession({
      userId: req.user._id,
      gameType,
      difficulty,
      totalQuestions: questions.length,
      questions
    });

    await gameSession.save();

    res.status(201).json({
      gameSessionId: gameSession._id,
      gameType,
      difficulty: gameSession.difficulty,
      totalQuestions: gameSession.totalQuestions,
      questions: gameSession.questions,
      timeLimit: gameType === 'hints' ? 300 : 600
    });

  } catch (error) {
    console.log("Error starting game:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Submit answer
router.post("/:sessionId/answer", authenticateToken, requireStudent, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { questionIndex, answer, timeSpent = 0 } = req.body;

    const gameSession = await GameSession.findById(sessionId);
    if (!gameSession) {
      return res.status(404).json({ message: 'Game session not found' });
    }

    if (gameSession.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (gameSession.status !== 'active') {
      return res.status(400).json({ message: 'Game session is not active' });
    }

    if (questionIndex >= gameSession.questions.length) {
      return res.status(400).json({ message: 'Invalid question index' });
    }

    await gameSession.submitAnswer(questionIndex, answer, timeSpent);

    const question = gameSession.questions[questionIndex];
    
    res.json({
      isCorrect: question.isCorrect,
      correctAnswer: question.correctAnswer,
      score: gameSession.score,
      correctAnswers: gameSession.correctAnswers,
      wrongAnswers: gameSession.wrongAnswers
    });

  } catch (error) {
    console.log("Error submitting answer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Use hint (for hints game)
router.post("/:sessionId/hint", authenticateToken, requireStudent, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { questionIndex } = req.body;

    const gameSession = await GameSession.findById(sessionId);
    if (!gameSession) {
      return res.status(404).json({ message: 'Game session not found' });
    }

    if (gameSession.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (gameSession.gameType !== 'hints') {
      return res.status(400).json({ message: 'Hints are only available for hints game' });
    }

    if (questionIndex >= gameSession.questions.length) {
      return res.status(400).json({ message: 'Invalid question index' });
    }

    const question = gameSession.questions[questionIndex];
    const word = await Word.findById(question.wordId);
    
    if (!word) {
      return res.status(404).json({ message: 'Word not found' });
    }

    const hints = [
      `Domain: ${word.domain}`,
      `Period: ${word.period}`,
      `Modern equivalent: ${word.modern_equivalent}`,
      `Status: ${word.status}`
    ];

    const unusedHints = hints.filter(h => !(question.hintsUsed || []).includes(h));
    const hintText = unusedHints.length > 0
      ? unusedHints[Math.floor(Math.random() * unusedHints.length)]
      : 'No more hints available';

    await gameSession.useHint(question.wordId, hintText);

    res.json({
      hint: hintText,
      hintsUsed: [...(question.hintsUsed || []), hintText]
    });

  } catch (error) {
    console.log("Error using hint:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Complete game session
router.post("/:sessionId/complete", authenticateToken, requireStudent, async (req, res) => {
  try {
    const { sessionId } = req.params;

    const gameSession = await GameSession.findById(sessionId);
    if (!gameSession) {
      return res.status(404).json({ message: 'Game session not found' });
    }

    if (gameSession.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (gameSession.status !== 'active') {
      return res.status(400).json({ message: 'Game session is already completed' });
    }

    await gameSession.completeGame();

    const user = await User.findById(req.user._id);
    await user.updatePoints(gameSession.pointsEarned);
    await user.updateGameStats(true);

    for (const question of gameSession.questions) {
      if (question.wordId) {
        const word = await Word.findById(question.wordId);
        if (word) {
          await word.updateUsageStats(question.isCorrect);
        }
      }
    }

    const newAchievements = await Achievement.checkUserAchievements(user, gameSession);

    const availableRewards = await Reward.getAvailableRewards(user, gameSession);
    const earnedRewards = [];
    
    for (const reward of availableRewards) {
      const result = await reward.awardToUser(user);
      if (!result.alreadyEarned) {
        earnedRewards.push(reward);
      }
    }

    res.json({
      message: 'Game completed successfully',
      finalScore: gameSession.score,
      pointsEarned: gameSession.pointsEarned,
      correctAnswers: gameSession.correctAnswers,
      wrongAnswers: gameSession.wrongAnswers,
      totalQuestions: gameSession.totalQuestions,
      accuracy: (gameSession.correctAnswers / gameSession.totalQuestions) * 100,
      newAchievements,
      earnedRewards: earnedRewards.map(r => ({ name: r.name, description: r.description })),
      userStats: {
        totalPoints: user.points,
        level: user.level,
        totalGamesPlayed: user.totalGamesPlayed
      }
    });

  } catch (error) {
    console.log("Error completing game:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Abandon game session
router.post("/:sessionId/abandon", authenticateToken, requireStudent, async (req, res) => {
  try {
    const { sessionId } = req.params;

    const gameSession = await GameSession.findById(sessionId);
    if (!gameSession) {
      return res.status(404).json({ message: 'Game session not found' });
    }

    if (gameSession.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (gameSession.status !== 'active') {
      return res.status(400).json({ message: 'Cannot abandon a non-active game session.' });
    }

    await gameSession.abandonGame();

    res.json({ message: 'Game abandoned successfully' });

  } catch (error) {
    console.log("Error abandoning game:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get game history
router.get("/history", authenticateToken, requireStudent, async (req, res) => {
  try {
    const { page = 1, limit = 10, gameType } = req.query;

    const query = { userId: req.user._id };
    if (gameType) query.gameType = gameType;

    const gameSessions = await GameSession.find(query)
      .populate('questions.wordId', 'word meaning_ta meaning_en')
      .sort({ startedAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await GameSession.countDocuments(query);

    res.json({
      gameSessions,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });

  } catch (error) {
    console.log("Error fetching game history:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get leaderboard
router.get("/leaderboard", async (req, res) => {
  try {
    const { gameType, limit = 50 } = req.query;

    const leaderboard = await GameSession.getLeaderboard(gameType, parseInt(limit));

    res.json({ leaderboard });

  } catch (error) {
    console.log("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get game statistics
router.get("/stats", authenticateToken, requireStudent, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    const totalGames = await GameSession.countDocuments({ userId: req.user._id, status: 'completed' });
    const gamesByType = await GameSession.aggregate([
      { $match: { userId: req.user._id, status: 'completed' } },
      { $group: { _id: '$gameType', count: { $sum: 1 }, avgScore: { $avg: '$score' } } }
    ]);
    
    const recentGames = await GameSession.find({ userId: req.user._id })
      .sort({ startedAt: -1 })
      .limit(5)
      .select('gameType score correctAnswers totalQuestions startedAt');

    res.json({
      userStats: {
        totalPoints: user.points,
        level: user.level,
        totalGamesPlayed: user.totalGamesPlayed,
        correctAnswers: user.correctAnswers,
        wrongAnswers: user.wrongAnswers,
        accuracy: user.totalGamesPlayed > 0 ? (user.correctAnswers / (user.correctAnswers + user.wrongAnswers)) * 100 : 0
      },
      gameStats: {
        totalGames,
        gamesByType,
        recentGames
      }
    });

  } catch (error) {
    console.log("Error fetching game statistics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get active game session
router.get("/active", authenticateToken, requireStudent, async (req, res) => {
  try {
    const gameSession = await GameSession.findOne({ 
      userId: req.user._id, 
      status: 'active' 
    });

    if (!gameSession) {
      return res.status(404).json({ message: 'No active game session found' });
    }

    res.json({ gameSession });

  } catch (error) {
    console.log("Error fetching active game:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
