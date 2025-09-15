import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    assignedStudents: [{
      studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      assignedAt: {
        type: Date,
        default: Date.now
      },
      completedAt: {
        type: Date,
        default: null
      },
      status: {
        type: String,
        enum: ['assigned', 'in_progress', 'completed', 'overdue'],
        default: 'assigned'
      },
      score: {
        type: Number,
        default: 0
      },
      feedback: {
        type: String,
        default: null
      }
    }],
    gameType: {
      type: String,
      enum: ['match', 'mcq', 'hints', 'mixed'],
      required: true
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium'
    },
    wordCount: {
      type: Number,
      required: true,
      min: 5,
      max: 50
    },
    domain: {
      type: String,
      enum: ['Volume', 'Time', 'Measurement', 'Nature', 'Culture', 'Food', 'Clothing', 'Architecture', 'Agriculture', 'Trade', 'Other', 'All'],
      default: 'All'
    },
    period: {
      type: String,
      enum: ['Classical/Medieval', 'Modern', 'Contemporary', 'Ancient', 'Pre-Classical', 'All'],
      default: 'All'
    },
    timeLimit: {
      type: Number, // in minutes
      default: 30
    },
    pointsReward: {
      type: Number,
      default: 100
    },
    dueDate: {
      type: Date,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    instructions: {
      type: String,
      trim: true
    },
    // Task statistics
    totalAssigned: {
      type: Number,
      default: 0
    },
    totalCompleted: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// Indexes
TaskSchema.index({ teacherId: 1, isActive: 1 });
TaskSchema.index({ 'assignedStudents.studentId': 1 });
TaskSchema.index({ dueDate: 1 });
TaskSchema.index({ gameType: 1, difficulty: 1 });

// Method to assign task to students
TaskSchema.methods.assignToStudents = function(studentIds) {
  const newAssignments = studentIds.map(studentId => ({
    studentId,
    assignedAt: new Date(),
    status: 'assigned'
  }));
  
  this.assignedStudents.push(...newAssignments);
  this.totalAssigned += studentIds.length;
  return this.save();
};

// Method to update student progress
TaskSchema.methods.updateStudentProgress = function(studentId, status, score = null, feedback = null) {
  const assignment = this.assignedStudents.find(
    assignment => assignment.studentId.toString() === studentId.toString()
  );
  
  if (!assignment) {
    throw new Error('Student not assigned to this task');
  }
  
  assignment.status = status;
  if (score !== null) assignment.score = score;
  if (feedback !== null) assignment.feedback = feedback;
  
  if (status === 'completed') {
    assignment.completedAt = new Date();
    this.totalCompleted += 1;
  }
  
  // Update average score
  const completedAssignments = this.assignedStudents.filter(a => a.status === 'completed');
  if (completedAssignments.length > 0) {
    this.averageScore = completedAssignments.reduce((sum, a) => sum + a.score, 0) / completedAssignments.length;
  }
  
  return this.save();
};

// Method to check if task is overdue
TaskSchema.methods.checkOverdue = function() {
  const now = new Date();
  const overdueAssignments = this.assignedStudents.filter(
    assignment => assignment.status !== 'completed' && assignment.status !== 'overdue' && this.dueDate < now
  );
  
  overdueAssignments.forEach(assignment => {
    assignment.status = 'overdue';
  });
  
  if (overdueAssignments.length > 0) {
    return this.save();
  }
  
  return Promise.resolve(this);
};

// Method to get task statistics
TaskSchema.methods.getStatistics = function() {
  const total = this.assignedStudents.length;
  const completed = this.assignedStudents.filter(a => a.status === 'completed').length;
  const inProgress = this.assignedStudents.filter(a => a.status === 'in_progress').length;
  const overdue = this.assignedStudents.filter(a => a.status === 'overdue').length;
  const notStarted = this.assignedStudents.filter(a => a.status === 'assigned').length;
  
  return {
    total,
    completed,
    inProgress,
    overdue,
    notStarted,
    completionRate: total > 0 ? (completed / total) * 100 : 0,
    averageScore: this.averageScore
  };
};

// Static method to get tasks for a student
TaskSchema.statics.getStudentTasks = async function(studentId, status = null) {
  const query = {
    'assignedStudents.studentId': studentId,
    isActive: true
  };
  
  if (status) {
    query['assignedStudents.status'] = status;
  }
  
  return await this.find(query)
    .populate('teacherId', 'username email')
    .sort({ dueDate: 1 });
};

// Static method to get teacher's tasks
TaskSchema.statics.getTeacherTasks = async function(teacherId, includeCompleted = false) {
  const query = { teacherId, isActive: true };
  
  if (!includeCompleted) {
    query.dueDate = { $gte: new Date() };
  }
  
  return await this.find(query)
    .populate('assignedStudents.studentId', 'username email points level')
    .sort({ createdAt: -1 });
};

// Pre-save middleware to check overdue tasks
TaskSchema.pre('save', function(next) {
  if (this.isModified('dueDate') || this.isNew) {
    this.checkOverdue();
  }
  next();
});

const Task = mongoose.model("Task", TaskSchema);
export default Task;
