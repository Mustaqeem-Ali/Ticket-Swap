import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const protect = async (req, res, next) => {
  let token;

  // 1. Get token from the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]; // Extracts "token" from "Bearer token"
  }

  if (!token) {
    return res.status(401).json({ status: 'fail', message: 'Authentication Error: You are not logged in.' });
  }

  try {
    // 2. Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({ status: 'fail', message: 'Authentication Error: The user for this token no longer exists.' });
    }

    // 4. Grant access
    req.user = currentUser;
    next();
  } catch (err) {
    return res.status(401).json({ status: 'fail', message: `Authentication Error: Invalid token. (${err.message})` });
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles is an array like ['admin']. req.user is from the 'protect' middleware.
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ // 403 Forbidden
        status: 'fail',
        message: 'You do not have permission to perform this action.'
      });
    }
    next();
  };
};