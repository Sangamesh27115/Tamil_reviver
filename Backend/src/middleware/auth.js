import jwt from "jsonwebtoken";
import { User, Student, Teacher, Admin } from "../models/User.js";

// Middleware to verify JWT token
// Backend/src/middleware/auth.js
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        status: 'error',
        message: "Access token required" 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id)
      .select('-password')
      .lean(); // For better performance

    if (!user) {
      return res.status(401).json({ 
        status: 'error',
        message: "Invalid token" 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(403).json({ 
      status: 'error',
      message: "Invalid or expired token",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Middleware to check user role
export const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. Required roles: ${roles.join(', ')}` 
      });
    }

    next();
  };
};

// Middleware to check if user is student
export const requireStudent = authorizeRole('Student');

// Middleware to check if user is teacher
export const requireTeacher = authorizeRole('Teacher');

// Middleware to check if user is admin
export const requireAdmin = authorizeRole('Admin');

// Middleware to check if user is teacher or admin
export const requireTeacherOrAdmin = authorizeRole('Teacher', 'Admin');

// Middleware to check specific admin permissions
export const requireAdminPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== 'Admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    if (!req.user.permissions || !req.user.permissions.includes(permission)) {
      return res.status(403).json({ 
        message: `Permission required: ${permission}` 
      });
    }

    next();
  };
};

// Middleware to check if teacher can access student data
export const canAccessStudent = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const user = req.user;

    // Admin can access all students
    if (user.role === 'Admin') {
      return next();
    }

    // Teacher can access their assigned students
    if (user.role === 'Teacher') {
      const teacher = await Teacher.findById(user._id);
      if (teacher && teacher.students.includes(studentId)) {
        return next();
      }
    }

    // Students can only access their own data
    if (user.role === 'Student' && user._id.toString() === studentId) {
      return next();
    }

    return res.status(403).json({ message: "Access denied to student data" });
  } catch (error) {
    console.error("Student access check error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Middleware to validate teacher ID format
export const validateTeacherId = (req, res, next) => {
  const { teacherId } = req.body;
  
  if (!teacherId) {
    return res.status(400).json({ message: "Teacher ID is required" });
  }

  // Teacher ID format: TEA-YYYY-NNNN (e.g., TEA-2024-0001)
  const teacherIdPattern = /^TEA-\d{4}-\d{4}$/;
  if (!teacherIdPattern.test(teacherId)) {
    return res.status(400).json({ 
      message: "Invalid teacher ID format. Expected: TEA-YYYY-NNNN" 
    });
  }

  next();
};

// Middleware to check account status
export const checkAccountStatus = (req, res, next) => {
  if (!req.user.isActive) {
    return res.status(403).json({ 
      message: "Account is deactivated. Please contact administrator." 
    });
  }
  next();
};

// Middleware to update last login
export const updateLastLogin = async (req, res, next) => {
  try {
    if (req.user) {
      req.user.lastLogin = new Date();
      await req.user.save();
    }
    next();
  } catch (error) {
    console.error("Last login update error:", error);
    // Don't fail the request for this
    next();
  }
};
