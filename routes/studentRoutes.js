const express = require('express');
const router = express.Router();
const {
  applyProject,
  getMyProjects,
  submitProjectFile,
  getSubmissionStatus,
} = require('../controller/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Protect routes and authorize only 'student' role
router.use(protect, authorize('student'));

// Route to apply for a project
router.post('/apply-project', applyProject);

// Route to get student's own projects
router.get('/my-projects', getMyProjects);

// Route to submit a project file
router.post('/submit/:projectId', submitProjectFile);

// Route to check submission status
router.get('/submission-status/:projectId', getSubmissionStatus);

module.exports = router;
