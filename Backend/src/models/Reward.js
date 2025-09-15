import mongoose from "mongoose";

const RewardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['badge', 'title', 'unlock', 'bonus_points', 'special_access'],
      required: true
    },
    icon: {
      type: String, // URL or icon identifier
      required: true
    },
    pointsRequired: {
      type: Number,
      required: true,
      min: 0
    },
    levelRequired: {
      type: Number,
      default: 1,
      min: 1
    },
    rarity: {
      type: String,
      enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
      default: 'common'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    // For special rewards
    specialConditions: {
      gameType: {
        type: String,
        enum: ['match', 'mcq', 'hints', 'any']
      },
      minScore: Number,
      perfectScore: Boolean,
      consecutiveWins: Number,
      domain: String,
      period: String
    },
    // Reward value/effect
    value: {
      type: Number, // Points or multiplier
      default: 0
    },
    effect: {
      type: String,
      enum: ['points_boost', 'unlock_content', 'special_badge', 'title_change', 'bonus_hints'],
      default: 'points_boost'
    },
    // Usage limits
    maxUses: {
      type: Number,
      default: null // null = unlimited
    },
    expiresAt: {
      type: Date,
      default: null // null = never expires
    },
    // Metadata
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    totalEarned: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// Indexes
RewardSchema.index({ pointsRequired: 1, levelRequired: 1 });
RewardSchema.index({ type: 1, rarity: 1 });
RewardSchema.index({ isActive: 1 });
RewardSchema.index({ 'specialConditions.gameType': 1 });

// Method to check if user can earn this reward
RewardSchema.methods.canUserEarn = function(user, gameSession = null) {
  // Check if reward is active
  if (!this.isActive) return false;
  
  // Check if user meets basic requirements
  if (user.points < this.pointsRequired || user.level < this.levelRequired) {
    return false;
  }
  
  // Check special conditions if provided
  if (this.specialConditions && gameSession) {
    const conditions = this.specialConditions;
    
    if (conditions.gameType && conditions.gameType !== 'any' && gameSession.gameType !== conditions.gameType) {
      return false;
    }
    
    if (conditions.minScore && gameSession.score < conditions.minScore) {
      return false;
    }
    
    if (conditions.perfectScore && gameSession.score !== gameSession.totalQuestions * 10) {
      return false;
    }
    
    if (conditions.consecutiveWins) {
      // This would need to be checked against user's game history
      // For now, we'll skip this check
    }
    
    if (conditions.domain) {
      // Check if any words in the game session match the domain
      const hasMatchingDomain = gameSession.questions.some(q => 
        q.wordId && q.wordId.domain === conditions.domain
      );
      if (!hasMatchingDomain) return false;
    }
    
    if (conditions.period) {
      // Check if any words in the game session match the period
      const hasMatchingPeriod = gameSession.questions.some(q => 
        q.wordId && q.wordId.period === conditions.period
      );
      if (!hasMatchingPeriod) return false;
    }
  }
  
  return true;
};

// Method to apply reward effect
RewardSchema.methods.applyEffect = function(user) {
  switch (this.effect) {
    case 'points_boost':
      const pointsToAdd = this.value || 50;
      return user.updatePoints(pointsToAdd);
    
    case 'unlock_content':
      // This would unlock special content/features
      // Implementation depends on what content needs to be unlocked
      return Promise.resolve(user);
    
    case 'special_badge':
      // Add badge to user's profile
      if (!user.badges) user.badges = [];
      if (!user.badges.includes(this._id)) {
        user.badges.push(this._id);
      }
      return user.save();
    
    case 'title_change':
      // Change user's title/display name
      user.title = this.name;
      return user.save();
    
    case 'bonus_hints':
      // Add bonus hints for future games
      if (!user.bonusHints) user.bonusHints = 0;
      user.bonusHints += this.value || 1;
      return user.save();
    
    default:
      return Promise.resolve(user);
  }
};

// Static method to get available rewards for user
RewardSchema.statics.getAvailableRewards = async function(user, gameSession = null) {
  const rewards = await this.find({ isActive: true });
  return rewards.filter(reward => reward.canUserEarn(user, gameSession));
};

// Static method to get rewards by type
RewardSchema.statics.getRewardsByType = async function(type, limit = 20) {
  return await this.find({ type, isActive: true })
    .sort({ pointsRequired: 1 })
    .limit(limit);
};

// Static method to get rare rewards
RewardSchema.statics.getRareRewards = async function() {
  return await this.find({ 
    isActive: true,
    rarity: { $in: ['rare', 'epic', 'legendary'] }
  }).sort({ rarity: 1, pointsRequired: 1 });
};

const Reward = mongoose.model("Reward", RewardSchema);
export default Reward;
