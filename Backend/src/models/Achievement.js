import mongoose from "mongoose";

const AchievementSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    icon: {
      type: String, // URL or icon identifier
      required: true
    },
    category: {
      type: String,
      enum: ['learning', 'gaming', 'social', 'special', 'milestone'],
      required: true
    },
    criteria: {
      type: {
        type: String,
        enum: ['points', 'games_played', 'correct_answers', 'streak', 'level', 'domain_mastery', 'perfect_score', 'speed', 'custom'],
        required: true
      },
      value: {
        type: Number,
        required: true
      },
      // Additional criteria for complex achievements
      gameType: {
        type: String,
        enum: ['match', 'mcq', 'hints', 'any']
      },
      domain: String,
      period: String,
      timeLimit: Number, // in seconds
      consecutive: Boolean // for streak achievements
    },
    rarity: {
      type: String,
      enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
      default: 'common'
    },
    pointsReward: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isSecret: {
      type: Boolean,
      default: false // Hidden until earned
    },
    // Statistics
    totalEarned: {
      type: Number,
      default: 0
    },
    // Metadata
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

// Indexes
AchievementSchema.index({ category: 1, rarity: 1 });
AchievementSchema.index({ 'criteria.type': 1 });
AchievementSchema.index({ isActive: 1, isSecret: 1 });

// Method to check if user has earned this achievement
AchievementSchema.methods.checkEligibility = function(user, gameSession = null) {
  if (!this.isActive) return false;
  
  const criteria = this.criteria;
  
  switch (criteria.type) {
    case 'points':
      return user.points >= criteria.value;
    
    case 'games_played':
      return user.totalGamesPlayed >= criteria.value;
    
    case 'correct_answers':
      return user.correctAnswers >= criteria.value;
    
    case 'level':
      return user.level >= criteria.value;
    
    case 'streak':
      // This would need to be calculated from game history
      // For now, we'll use a simplified check
      return user.correctAnswers >= criteria.value && criteria.consecutive;
    
    case 'domain_mastery':
      if (!criteria.domain) return false;
      // This would need to check user's performance in specific domain
      // For now, we'll use a simplified check
      return user.correctAnswers >= criteria.value;
    
    case 'perfect_score':
      if (!gameSession) return false;
      return gameSession.score === gameSession.totalQuestions * 10;
    
    case 'speed':
      if (!gameSession || !criteria.timeLimit) return false;
      return gameSession.timeSpent <= criteria.timeLimit;
    
    case 'custom':
      // Custom achievements would need special handling
      return false;
    
    default:
      return false;
  }
};

// Method to award achievement to user
AchievementSchema.methods.awardToUser = async function(user) {
  // Check if user already has this achievement
  const existingAchievement = user.achievements?.find(
    achievement => achievement.achievementId.toString() === this._id.toString()
  );
  
  if (existingAchievement) {
    return { alreadyEarned: true, achievement: existingAchievement };
  }
  
  // Add achievement to user
  if (!user.achievements) user.achievements = [];
  user.achievements.push({
    achievementId: this._id,
    earnedAt: new Date()
  });
  
  // Award points if specified
  if (this.pointsReward > 0) {
    await user.updatePoints(this.pointsReward);
  }
  
  // Update achievement statistics
  this.totalEarned += 1;
  await this.save();
  
  await user.save();
  
  return { 
    alreadyEarned: false, 
    achievement: {
      achievementId: this._id,
      earnedAt: new Date()
    },
    pointsAwarded: this.pointsReward
  };
};

// Static method to check and award achievements for a user
AchievementSchema.statics.checkUserAchievements = async function(user, gameSession = null) {
  const achievements = await this.find({ isActive: true });
  const newAchievements = [];
  
  for (const achievement of achievements) {
    if (achievement.checkEligibility(user, gameSession)) {
      const result = await achievement.awardToUser(user);
      if (!result.alreadyEarned) {
        newAchievements.push({
          achievement,
          pointsAwarded: result.pointsAwarded
        });
      }
    }
  }
  
  return newAchievements;
};

// Static method to get achievements by category
AchievementSchema.statics.getByCategory = async function(category, includeSecret = false) {
  const query = { category, isActive: true };
  if (!includeSecret) {
    query.isSecret = false;
  }
  
  return await this.find(query).sort({ pointsReward: 1 });
};

// Static method to get user's achievements
AchievementSchema.statics.getUserAchievements = async function(userId) {
  const user = await mongoose.model('User').findById(userId).populate('achievements.achievementId');
  return user?.achievements || [];
};

// Static method to get achievement leaderboard
AchievementSchema.statics.getAchievementLeaderboard = async function(limit = 20) {
  const pipeline = [
    {
      $lookup: {
        from: 'users',
        localField: 'achievements.achievementId',
        foreignField: '_id',
        as: 'achievementDetails'
      }
    },
    {
      $unwind: '$achievements'
    },
    {
      $lookup: {
        from: 'achievements',
        localField: 'achievements.achievementId',
        foreignField: '_id',
        as: 'achievementInfo'
      }
    },
    {
      $unwind: '$achievementInfo'
    },
    {
      $group: {
        _id: '$_id',
        username: { $first: '$username' },
        totalAchievements: { $sum: 1 },
        totalPoints: { $sum: '$achievementInfo.pointsReward' },
        rareAchievements: {
          $sum: {
            $cond: [
              { $in: ['$achievementInfo.rarity', ['rare', 'epic', 'legendary']] },
              1,
              0
            ]
          }
        }
      }
    },
    {
      $sort: { totalAchievements: -1, totalPoints: -1 }
    },
    {
      $limit: limit
    }
  ];
  
  return await mongoose.model('User').aggregate(pipeline);
};

const Achievement = mongoose.model("Achievement", AchievementSchema);
export default Achievement;
