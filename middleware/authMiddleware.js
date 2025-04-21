const jwt = require('jsonwebtoken');
const User = require('../models/user');

// 🔐 Token verification middleware
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 🧠 If admin, skip DB call
      if (decoded.role === 'admin') {
        req.user = { id: decoded.id || null, role: 'admin' };
        return next();
      }

      // 🧠 Fetch user from DB (student/mentor)
      const user = await User.findById(decoded.id).select('-password');
      if (!user) return res.status(401).json({ message: 'User not found' });

      req.user = {
        id: user._id,
        role: user.role, // ✅ Make sure role is present
        email: user.email,
        name: user.name,
      };

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// 🛡️ Role-based middleware
exports.adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next();
};

exports.studentOnly = (req, res, next) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ message: 'Access denied: Students only' });
  }
  next();
};

exports.mentorOnly = (req, res, next) => {
  if (req.user.role !== 'mentor') {
    return res.status(403).json({ message: 'Access denied: Mentors only' });
  }
  next();
};

// ✅ Generic role-based middleware with logs
exports.authorize = (...roles) => {
  return (req, res, next) => {
    console.log('🔐 Expected Roles:', roles);
    console.log('👤 User Info:', req.user);

    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: unauthorized role' });
    }
    next();
  };
};
