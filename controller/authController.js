const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { sendPasswordEmail } = require('../utils/email');
const emailValidator = require('email-validator');
const crypto = require('crypto');

// ✅ Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// ✅ Admin login
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  // Email validation
  if (!emailValidator.validate(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    // Check admin credentials
    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    // ✅ Generate token with fake ID for consistency
    const token = jwt.sign(
      { id: 'admin', role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      token,
      role: 'admin',
      user: {
        id: 'admin',
        email: process.env.ADMIN_EMAIL,
        name: 'Admin'
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Generic login function for students and mentors
const loginUser = async (req, res, role) => {
  const { email, password } = req.body;

  if (!emailValidator.validate(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    const user = await User.findOne({ email, role });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.json({
      token,
      role: user.role,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Student login
exports.studentLogin = (req, res) => {
  loginUser(req, res, 'student');
};

// ✅ Mentor login
exports.mentorLogin = (req, res) => {
  loginUser(req, res, 'mentor');
};

// ✅ Register a new student
exports.registerStudent = async (req, res) => {
  const { name, email, rollNo, course, section } = req.body;

  if (!emailValidator.validate(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Student already exists' });
    }

    const password = crypto.randomBytes(12).toString('hex');
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      rollNo,
      course,
      section,
      password: hashedPassword,
      role: 'student'
    });

    await user.save();
    await sendPasswordEmail(email, password);

    res.status(201).json({ message: 'Student registered & email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Register a new mentor
exports.registerMentor = async (req, res) => {
  const { name, email } = req.body;

  if (!emailValidator.validate(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Mentor already exists' });
    }

    const password = crypto.randomBytes(12).toString('hex');
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'mentor'
    });

    await user.save();
    await sendPasswordEmail(email, password);

    res.status(201).json({ message: 'Mentor registered & email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
