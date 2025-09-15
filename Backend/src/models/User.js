import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Base User Schema
const UserSchema = new mongoose.Schema(
  {
    username: { 
      type: String, 
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 30
    },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true
    },
    password: { 
      type: String, 
      required: true,
      minlength: 6
    },
    role: { 
      type: String, 
      enum: ['Student', 'Teacher', 'Admin'],
      required: true,
      default: 'Student'
    },
    profileImage: {
      type: String,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastLogin: {
      type: Date,
      default: null
    },
    // Student specific fields
    points: { 
      type: Number, 
      default: 0 
    },
    level: {
      type: Number,
      default: 1
    },
    totalGamesPlayed: {
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
    // Teacher specific fields
    teacherId: {
      type: String,
      unique: true,
      sparse: true
    },
    subjects: [{
      type: String
    }],
    students: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    // Admin specific fields
    adminLevel: {
      type: String,
      enum: ['Super Admin', 'Content Admin', 'Moderator'],
      default: 'Content Admin'
    },
    permissions: [{
      type: String,
      enum: ['manage_users', 'manage_words', 'manage_content', 'view_analytics', 'manage_teachers']
    }]
  },
  { 
    timestamps: true,
    discriminatorKey: 'role'
  }
);

// Indexes for better performance
UserSchema.index({ role: 1 });
UserSchema.index({ points: -1 }); // For leaderboard
UserSchema.index({ username: 1 });

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password
UserSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

// Method to generate JWT token
UserSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { 
      id: this._id,
      role: this.role,
      email: this.email
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Method to get public profile (without sensitive data)
UserSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

// Method to update points and level
UserSchema.methods.updatePoints = function(pointsToAdd) {
  this.points += pointsToAdd;
  
  // Level up logic (every 100 points = 1 level)
  const newLevel = Math.floor(this.points / 100) + 1;
  if (newLevel > this.level) {
    this.level = newLevel;
  }
  
  return this.save();
};

// Method to update game statistics
UserSchema.methods.updateGameStats = function(isCorrect) {
  this.totalGamesPlayed += 1;
  if (isCorrect) {
    this.correctAnswers += 1;
  } else {
    this.wrongAnswers += 1;
  }
  return this.save();
};

const User = mongoose.model("User", UserSchema);

// Student Discriminator
const Student = User.discriminator('Student', new mongoose.Schema({
  rewards: [{
    rewardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reward'
    },
    earnedAt: {
      type: Date,
      default: Date.now
    },
    isUsed: {
      type: Boolean,
      default: false
    }
  }],
  achievements: [{
    achievementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Achievement'
    },
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],
  gameHistory: [{
    gameType: {
      type: String,
      enum: ['match', 'mcq', 'hints']
    },
    score: Number,
    wordsUsed: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Word'
    }],
    playedAt: {
      type: Date,
      default: Date.now
    }
  }]
}));

// Teacher Discriminator
const Teacher = User.discriminator('Teacher', new mongoose.Schema({
  teacherId: {
    type: String,
    required: true,
    unique: true
  },
  subjects: [{
    type: String,
    required: true
  }],
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  assignedTasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  wordRequests: [{
    word: String,
    meaning_ta: String,
    meaning_en: String,
    domain: String,
    period: String,
    modern_equivalent: String,
    status: String,
    notes: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    requestedAt: {
      type: Date,
      default: Date.now
    },
    reviewedAt: Date,
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }]
}));

// Admin Discriminator
const Admin = User.discriminator('Admin', new mongoose.Schema({
  adminLevel: {
    type: String,
    enum: ['Super Admin', 'Content Admin', 'Moderator'],
    required: true
  },
  permissions: [{
    type: String,
    enum: ['manage_users', 'manage_words', 'manage_content', 'view_analytics', 'manage_teachers']
  }],
  lastActivity: {
    type: Date,
    default: Date.now
  }
}));

export { User, Student, Teacher, Admin };
export default User;
