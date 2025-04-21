const express = require('express');
const router = express.Router();
const {
  getAllProjects,
  approveProject,
  rejectProject,
  getAllMentors,
  assignMentorToProject,
} = require('../controller/adminController');

const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('admin'));

router.get('/projects', getAllProjects);
router.get('/mentors', getAllMentors);
router.put('/project/approve/:id', approveProject);
router.put('/project/reject/:id', rejectProject);
router.put('/project/assign-mentor/:id', assignMentorToProject);

module.exports = router;
