import express from "express";
import Task from "../models/Task.js";
import { User, Teacher, Student } from "../models/User.js";
import { authenticateToken, requireTeacher, requireAdmin, requireTeacherOrAdmin } from "../middleware/auth.js";

const router = express.Router();

// Create a new task (Teacher only)
router.post("/", authenticateToken, requireTeacher, async (req, res) => {
  try {
    const {
      title,
      description,
      gameType,
      difficulty = 'Medium',
      wordCount = 10,
      domain = 'All',
      period = 'All',
      timeLimit = 30,
      pointsReward = 100,
      dueDate,
      instructions
    } = req.body;

    if (!title || !description || !gameType || !dueDate) {
      return res.status(400).json({ 
        message: "Title, description, gameType, and dueDate are required" 
      });
    }

    if (!['match', 'mcq', 'hints', 'mixed'].includes(gameType)) {
      return res.status(400).json({ 
        message: "Invalid game type. Must be match, mcq, hints, or mixed" 
      });
    }

    const task = new Task({
      title,
      description,
      teacherId: req.user._id,
      gameType,
      difficulty,
      wordCount,
      domain,
      period,
      timeLimit,
      pointsReward,
      dueDate: new Date(dueDate),
      instructions
    });

    await task.save();

    res.status(201).json({
      task,
      message: "Task created successfully"
    });

  } catch (error) {
    console.log("Error creating task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Assign task to students (Teacher only)
router.post("/:taskId/assign", authenticateToken, requireTeacher, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { studentIds } = req.body;

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ message: "Student IDs array is required" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only assign your own tasks" });
    }

    // Validate student IDs
    const students = await Student.find({ _id: { $in: studentIds } });
    if (students.length !== studentIds.length) {
      return res.status(400).json({ message: "Some student IDs are invalid" });
    }

    // Assign students to task
    await task.assignToStudents(studentIds);

    res.json({
      message: "Students assigned successfully",
      assignedCount: studentIds.length
    });

  } catch (error) {
    console.log("Error assigning task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get teacher's tasks
router.get("/teacher", authenticateToken, requireTeacher, async (req, res) => {
  try {
    const { includeCompleted = false, page = 1, limit = 20 } = req.query;

    const tasks = await Task.getTeacherTasks(req.user._id, includeCompleted === 'true')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Task.countDocuments({ 
      teacherId: req.user._id,
      ...(includeCompleted === 'false' ? { dueDate: { $gte: new Date() } } : {})
    });

    res.json({
      tasks,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });

  } catch (error) {
    console.log("Error fetching teacher tasks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get student's tasks
router.get("/student", authenticateToken, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const tasks = await Task.getStudentTasks(req.user._id, status)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Task.countDocuments({ 
      'assignedStudents.studentId': req.user._id,
      ...(status ? { 'assignedStudents.status': status } : {})
    });

    res.json({
      tasks,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });

  } catch (error) {
    console.log("Error fetching student tasks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get task details
router.get("/:taskId", authenticateToken, async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId)
      .populate('teacherId', 'username email')
      .populate('assignedStudents.studentId', 'username email points level');

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if user has access to this task
    const isTeacher = req.user.role === 'Teacher' && task.teacherId._id.toString() === req.user._id.toString();
    const isStudent = req.user.role === 'Student' && task.assignedStudents.some(
      assignment => assignment.studentId._id.toString() === req.user._id.toString()
    );
    const isAdmin = req.user.role === 'Admin';

    if (!isTeacher && !isStudent && !isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({ task });

  } catch (error) {
    console.log("Error fetching task details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update task (Teacher only)
router.put("/:taskId", authenticateToken, requireTeacher, async (req, res) => {
  try {
    const { taskId } = req.params;
    const updateData = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only update your own tasks" });
    }

    // Update task
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        task[key] = updateData[key];
      }
    });

    await task.save();

    res.json({
      task,
      message: "Task updated successfully"
    });

  } catch (error) {
    console.log("Error updating task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update student progress (Teacher only)
router.put("/:taskId/student/:studentId", authenticateToken, requireTeacher, async (req, res) => {
  try {
    const { taskId, studentId } = req.params;
    const { status, score, feedback } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only update your own tasks" });
    }

    await task.updateStudentProgress(studentId, status, score, feedback);

    res.json({
      message: "Student progress updated successfully"
    });

  } catch (error) {
    console.log("Error updating student progress:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Submit task completion (Student only)
router.post("/:taskId/submit", authenticateToken, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { gameSessionId, score } = req.body;

    if (req.user.role !== 'Student') {
      return res.status(403).json({ message: "Only students can submit tasks" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if student is assigned to this task
    const assignment = task.assignedStudents.find(
      assignment => assignment.studentId.toString() === req.user._id.toString()
    );

    if (!assignment) {
      return res.status(403).json({ message: "You are not assigned to this task" });
    }

    if (assignment.status === 'completed') {
      return res.status(400).json({ message: "Task already completed" });
    }

    // Update assignment status
    assignment.status = 'completed';
    assignment.completedAt = new Date();
    assignment.score = score || 0;

    // Update task statistics
    task.totalCompleted += 1;
    const completedAssignments = task.assignedStudents.filter(a => a.status === 'completed');
    task.averageScore = completedAssignments.reduce((sum, a) => sum + a.score, 0) / completedAssignments.length;

    await task.save();

    // Award points to student
    const student = await Student.findById(req.user._id);
    await student.updatePoints(task.pointsReward);

    res.json({
      message: "Task submitted successfully",
      pointsEarned: task.pointsReward,
      score: assignment.score
    });

  } catch (error) {
    console.log("Error submitting task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get task statistics (Teacher only)
router.get("/:taskId/stats", authenticateToken, requireTeacher, async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only view your own task statistics" });
    }

    const statistics = task.getStatistics();

    res.json({ statistics });

  } catch (error) {
    console.log("Error fetching task statistics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete task (Teacher only)
router.delete("/:taskId", authenticateToken, requireTeacher, async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own tasks" });
    }

    // Soft delete
    task.isActive = false;
    await task.save();

    res.json({ message: "Task deleted successfully" });

  } catch (error) {
    console.log("Error deleting task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all tasks (Admin only)
router.get("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, teacherId, status } = req.query;

    const query = { isActive: true };
    if (teacherId) query.teacherId = teacherId;
    if (status) query['assignedStudents.status'] = status;

    const tasks = await Task.find(query)
      .populate('teacherId', 'username email')
      .populate('assignedStudents.studentId', 'username email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Task.countDocuments(query);

    res.json({
      tasks,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });

  } catch (error) {
    console.log("Error fetching all tasks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Check overdue tasks (Admin only)
router.post("/check-overdue", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const tasks = await Task.find({ isActive: true });
    let updatedCount = 0;

    for (const task of tasks) {
      const beforeCount = task.assignedStudents.filter(a => a.status === 'overdue').length;
      await task.checkOverdue();
      const afterCount = task.assignedStudents.filter(a => a.status === 'overdue').length;
      
      if (afterCount > beforeCount) {
        updatedCount++;
      }
    }

    res.json({
      message: "Overdue tasks checked successfully",
      tasksUpdated: updatedCount
    });

  } catch (error) {
    console.log("Error checking overdue tasks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
