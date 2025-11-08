import jwt from 'jsonwebtoken';
import { User } from '../models/models.js';

/////////////////////////
// Protect Routes Middleware
/////////////////////////
export const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]; // Extract token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user (without password) to req object
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error('Auth Error:', error);
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

/////////////////////////
// Role-Based Access Middleware
/////////////////////////
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: 'Access denied: insufficient permissions' });
    }
    next();
  };
};
