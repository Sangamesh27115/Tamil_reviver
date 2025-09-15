import express from "express";
import { User, Student, Teacher, Admin } from "../models/User.js";
import { authenticateToken, updateLastLogin } from "../middleware/auth.js";

const router = express.Router();

// Register route - supports all user types
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, role = 'Student', teacherId, adminLevel, permissions } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, and password are required" });
    }

    // Validate role
    if (!['Student', 'Teacher', 'Admin'].includes(role)) {
      return res.status(400).json({ message: "Invalid role. Must be Student, Teacher, or Admin" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    let newUser;

    // Create user based on role
    switch (role) {
      case 'Student':
        newUser = new Student({ username, email, password, role });
        break;
      
      case 'Teacher':
        if (!teacherId) {
          return res.status(400).json({ message: "Teacher ID is required for teacher registration" });
        }
        // Check if teacher ID already exists
        const existingTeacher = await Teacher.findOne({ teacherId });
        if (existingTeacher) {
          return res.status(400).json({ message: "Teacher ID already exists" });
        }
        newUser = new Teacher({ 
          username, 
          email, 
          password, 
          role, 
          teacherId,
          subjects: req.body.subjects || []
        });
        break;
      
      case 'Admin':
        if (!adminLevel || !permissions) {
          return res.status(400).json({ message: "Admin level and permissions are required for admin registration" });
        }
        newUser = new Admin({ 
          username, 
          email, 
          password, 
          role, 
          adminLevel,
          permissions
        });
        break;
    }

    await newUser.save();
    const token = newUser.generateAuthToken();

    res.status(201).json({ 
      token, 
      user: newUser.getPublicProfile(),
      message: `${role} account created successfully`
    });
  } catch (error) {
    console.log("Error in register route", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login route - supports all user types
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = user.generateAuthToken();
    res.status(200).json({
      token,
      user: user.getPublicProfile(),
      message: "Login successful"
    });
  } catch (error) {
    console.log("Error in login route", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get current user profile
router.get("/profile", authenticateToken, updateLastLogin, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json({ user: user.getPublicProfile() });
  } catch (error) {
    console.log("Error getting profile", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update user profile
router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const { username, profileImage } = req.body;
    const user = await User.findById(req.user._id);

    if (username) user.username = username;
    if (profileImage) user.profileImage = profileImage;

    await user.save();
    res.status(200).json({ 
      user: user.getPublicProfile(),
      message: "Profile updated successfully"
    });
  } catch (error) {
    console.log("Error updating profile", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Change password
router.put("/change-password", authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current password and new password are required" });
    }

    const user = await User.findById(req.user._id);
    const isCurrentPasswordCorrect = await user.comparePassword(currentPassword);
    
    if (!isCurrentPasswordCorrect) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.log("Error changing password", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all users (Admin only)
router.get("/users", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { role, page = 1, limit = 20 } = req.query;
    const query = role ? { role } : {};
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.status(200).json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.log("Error getting users", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Deactivate/Activate user (Admin only)
router.put("/users/:userId/status", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { userId } = req.params;
    const { isActive } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = isActive;
    await user.save();

    res.status(200).json({ 
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.log("Error updating user status", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get teacher's students (Teacher only)
router.get("/students", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'Teacher') {
      return res.status(403).json({ message: "Teacher access required" });
    }

    const teacher = await Teacher.findById(req.user._id).populate('students', 'username email points level totalGamesPlayed');
    res.status(200).json({ students: teacher.students });
  } catch (error) {
    console.log("Error getting students", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Assign students to teacher (Admin only)
router.post("/teachers/:teacherId/students", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { teacherId } = req.params;
    const { studentIds } = req.body;

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Validate student IDs
    const students = await Student.find({ _id: { $in: studentIds } });
    if (students.length !== studentIds.length) {
      return res.status(400).json({ message: "Some student IDs are invalid" });
    }

    // Add students to teacher
    const newStudents = studentIds.filter(id => !teacher.students.includes(id));
    teacher.students.push(...newStudents);
    await teacher.save();

    res.status(200).json({ 
      message: "Students assigned successfully",
      assignedCount: newStudents.length
    });
  } catch (error) {
    console.log("Error assigning students", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
