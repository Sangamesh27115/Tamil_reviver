import mongoose from "mongoose";

// Enhanced Word Schema based on your requirements
const WordSchema = new mongoose.Schema(
  {
    word: { 
      type: String, 
      required: true,
      unique: true,
      trim: true
    },
    meaning_ta: { 
      type: String, 
      required: true,
      trim: true
    },
    meaning_en: { 
      type: String, 
      required: true,
      trim: true
    },
    domain: { 
      type: String, 
      required: true,
      enum: ['Volume', 'Time', 'Measurement', 'Nature', 'Culture', 'Food', 'Clothing', 'Architecture', 'Agriculture', 'Trade', 'Other']
    },
    period: { 
      type: String, 
      required: true,
      enum: ['Classical/Medieval', 'Modern', 'Contemporary', 'Ancient', 'Pre-Classical']
    },
    modern_equivalent: { 
      type: String, 
      required: true,
      trim: true
    },
    status: { 
      type: String, 
      required: true,
      enum: ['traditional; still seen rurally', 'archaic', 'obsolete', 'rare', 'historical']
    },
    notes: { 
      type: String,
      trim: true
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    // Game statistics
    timesUsed: {
      type: Number,
      default: 0
    },
    correctAnswers: {
      type: Number,
      default: 0
    },
    wrongAnswers: {
      type: Number,
      default: 0
    },
    // Metadata
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    // Tags for better categorization
    tags: [{
      type: String,
      trim: true
    }],
    // Pronunciation guide
    pronunciation: {
      type: String,
      trim: true
    },
    // Example usage
    exampleUsage: {
      type: String,
      trim: true
    },
    // Related words
    relatedWords: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Word'
    }]
  },
  { timestamps: true }
);

// Indexes for better query performance
WordSchema.index({ domain: 1, period: 1, difficulty: 1 });
WordSchema.index({ isActive: 1 });
WordSchema.index({ tags: 1 });
WordSchema.index({ addedBy: 1 });

// Method to update usage statistics
WordSchema.methods.updateUsageStats = function(isCorrect) {
  this.timesUsed += 1;
  if (isCorrect) {
    this.correctAnswers += 1;
  } else {
    this.wrongAnswers += 1;
  }
  return this.save();
};

// Method to get difficulty score (0-100)
WordSchema.methods.getDifficultyScore = function() {
  if (this.timesUsed === 0) return 50; // Default medium difficulty
  
  const accuracy = this.correctAnswers / this.timesUsed;
  const baseScore = this.difficulty === 'Easy' ? 20 : this.difficulty === 'Hard' ? 80 : 50;
  
  // Adjust based on actual performance
  const adjustment = (accuracy - 0.5) * 20; // -20 to +20 adjustment
  return Math.max(0, Math.min(100, baseScore + adjustment));
};

// Static method to get random words for games using aggregation
WordSchema.statics.getRandomWords = async function(count = 10, filters = {}) {
  const match = { isActive: true, ...filters };
  // Use aggregation with $sample for randomness; falls back to available count
  const pipeline = [
    { $match: match },
    { $sample: { size: Math.max(1, parseInt(count)) } }
  ];
  const results = await this.aggregate(pipeline);
  return results;
};

// Static method to get words by difficulty
WordSchema.statics.getWordsByDifficulty = async function(difficulty, count = 10) {
  return await this.getRandomWords(count, { difficulty });
};

// Static method to search words
WordSchema.statics.searchWords = async function(searchTerm, filters = {}) {
  const query = {
    isActive: true,
    ...filters,
    $or: [
      { word: { $regex: searchTerm, $options: 'i' } },
      { meaning_ta: { $regex: searchTerm, $options: 'i' } },
      { meaning_en: { $regex: searchTerm, $options: 'i' } },
      { modern_equivalent: { $regex: searchTerm, $options: 'i' } },
      { tags: { $in: [new RegExp(searchTerm, 'i')] } }
    ]
  };
  
  return await this.find(query).limit(20);
};

const Word = mongoose.model("Word", WordSchema);
export default Word;
