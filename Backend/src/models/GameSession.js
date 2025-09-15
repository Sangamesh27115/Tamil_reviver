import mongoose from "mongoose";

const GameSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    gameType: {
      type: String,
      enum: ['match', 'mcq', 'hints'],
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'abandoned'],
      default: 'active'
    },
    score: {
      type: Number,
      default: 0
    },
    totalQuestions: {
      type: Number,
      required: true
    },
    correctAnswers: {
      type: Number,
      default: 0
    },
    wrongAnswers: {
      type: Number,
      default: 0
    },
    timeSpent: {
      type: Number, // in seconds
      default: 0
    },
    questions: [{
      wordId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Word',
        required: true
      },
      question: {
        type: String,
        required: true
      },
      options: [{
        type: String
      }],
      correctAnswer: {
        type: String,
        required: true
      },
      userAnswer: {
        type: String,
        default: null
      },
      isCorrect: {
        type: Boolean,
        default: false
      },
      timeSpent: {
        type: Number, // in seconds
        default: 0
      },
      hintsUsed: {
        type: Number,
        default: 0
      }
    }],
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium'
    },
    pointsEarned: {
      type: Number,
      default: 0
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    completedAt: {
      type: Date,
      default: null
    },
    // For match game specific data
    matchPairs: [{
      wordId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Word'
      },
      meaning: String,
      isMatched: {
        type: Boolean,
        default: false
      }
    }],
    // For hints game specific data
    hintsUsed: [{
      wordId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Word'
      },
      hintText: String,
      usedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  { timestamps: true }
);

// Indexes
GameSessionSchema.index({ userId: 1, status: 1 });
GameSessionSchema.index({ gameType: 1, status: 1 });
GameSessionSchema.index({ startedAt: -1 });
GameSessionSchema.index({ score: -1 });

// Method to calculate final score
GameSessionSchema.methods.calculateScore = function() {
  const baseScore = this.correctAnswers * 10;
  const timeBonus = Math.max(0, 300 - this.timeSpent) * 0.1; // Bonus for quick completion
  const accuracyBonus = (this.correctAnswers / this.totalQuestions) * 50;
  
  this.score = Math.round(baseScore + timeBonus + accuracyBonus);
  this.pointsEarned = this.score;
  return this.score;
};

// Method to complete the game
GameSessionSchema.methods.completeGame = function() {
  this.status = 'completed';
  this.completedAt = new Date();
  this.calculateScore();
  return this.save();
};

// Method to abandon the game
GameSessionSchema.methods.abandonGame = function() {
  this.status = 'abandoned';
  this.completedAt = new Date();
  return this.save();
};

// Method to submit an answer
GameSessionSchema.methods.submitAnswer = function(questionIndex, answer, timeSpent = 0) {
  if (questionIndex >= this.questions.length) {
    throw new Error('Invalid question index');
  }
  
  const question = this.questions[questionIndex];
  question.userAnswer = answer;
  question.timeSpent = timeSpent;
  question.isCorrect = question.correctAnswer === answer;
  
  if (question.isCorrect) {
    this.correctAnswers += 1;
  } else {
    this.wrongAnswers += 1;
  }
  
  return this.save();
};

// Method to use a hint
GameSessionSchema.methods.useHint = function(wordId, hintText) {
  this.hintsUsed.push({
    wordId,
    hintText,
    usedAt: new Date()
  });
  
  // Find the question and increment hints used
  const question = this.questions.find(q => q.wordId.toString() === wordId.toString());
  if (question) {
    question.hintsUsed += 1;
  }
  
  return this.save();
};

// Static method to get user's game history
GameSessionSchema.statics.getUserHistory = async function(userId, limit = 20) {
  return await this.find({ userId })
    .populate('questions.wordId', 'word meaning_ta meaning_en')
    .sort({ startedAt: -1 })
    .limit(limit);
};

// Static method to get leaderboard
GameSessionSchema.statics.getLeaderboard = async function(gameType = null, limit = 50) {
  const matchStage = gameType ? { gameType } : {};
  
  const pipeline = [
    { $match: { status: 'completed', ...matchStage } },
    {
      $group: {
        _id: '$userId',
        totalScore: { $sum: '$score' },
        totalGames: { $sum: 1 },
        avgScore: { $avg: '$score' },
        bestScore: { $max: '$score' }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: '$user' },
    {
      $project: {
        userId: '$_id',
        username: '$user.username',
        totalScore: 1,
        totalGames: 1,
        avgScore: { $round: ['$avgScore', 2] },
        bestScore: 1,
        level: '$user.level'
      }
    },
    { $sort: { totalScore: -1 } },
    { $limit: limit }
  ];
  
  return await this.aggregate(pipeline);
};

const GameSession = mongoose.model("GameSession", GameSessionSchema);
export default GameSession;
