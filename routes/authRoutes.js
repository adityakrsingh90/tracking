const express = require('express');
const router = express.Router();
const {
  adminLogin,
  studentLogin,
  mentorLogin,
  registerStudent,
  registerMentor,
} = require('../controller/authController');

router.post('/admin/login', adminLogin);
router.post('/student/login', studentLogin);
router.post('/mentor/login', mentorLogin);

router.post('/register/student', registerStudent);
router.post('/register/mentor', registerMentor);

module.exports = router;
