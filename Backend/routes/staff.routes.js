const express = require('express');
const router = express.Router();
const db = require('../config/db');
const {upcomingMentoringHistoryOfStudent,getAllStaff , poststaff , getStaffById , editStaffById , deleteStaffById , MentorsAllMentees , studentwiseMentoringSession} = require('../controllers/staff.controller')
const verifyToken = require("../middleware/auth.middleware");
const allowRoles = require('../middleware/allowed.middleware');

router.use(verifyToken);

//crud

//view mentors in admin
router.get('/',allowRoles("admin") , getAllStaff);

router.post('/',allowRoles("admin") , poststaff);

router.get('/:id',allowRoles("admin","staff") , getStaffById);

router.patch('/:id',allowRoles("admin") , editStaffById);

router.delete('/:id',allowRoles("admin") , deleteStaffById);

// Fetch mentees of a mentor
router.get('/:staffId/mentees',allowRoles("admin","staff") , MentorsAllMentees)

// Fetch student-wise mentoring sessions for a mentor
router.get('/:staffId/mentoring-sessions',allowRoles("staff") , studentwiseMentoringSession);

//upcoming mentoring session details
router.get('/:staffId/upcoming-mentoring',allowRoles("staff") , upcomingMentoringHistoryOfStudent)


module.exports = router;