// routes/mentorRoutes.js
const express = require('express');
const router = express.Router();
const {
  registerMentor,
  loginMentor,
  getMentorProjects,
  giveFeedback
} = require('../controller/mentorController');

const { protect, authorize } = require('../middleware/authMiddleware');

// ✅ Public Routes
router.post('/register', registerMentor);
router.post('/login', loginMentor);

// ✅ Protected Routes (only accessible after login)
router.use(protect, authorize('mentor'));

router.get('/projects', getMentorProjects);
router.post('/feedback/:projectId', giveFeedback);

module.exports = router;
