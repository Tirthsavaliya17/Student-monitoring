const express = require('express');
const router = express.Router();
const db = require('../config/db');
const {addStudentFeedback,getAllStudents , postStudent , getById , editByEnroll , deleteByEnroll , individualMentorDetailsOfStudent , completeMentoringHistoryOfStudent , upcomingMentoringHistoryOfStudent} = require('../controllers/student.controller');
const verifyToken = require("../middleware/auth.middleware");
const allowRoles = require('../middleware/allowed.middleware');

router.use(verifyToken);

//crud

//view mentees in admin
router.get('/',allowRoles("admin") , getAllStudents);

router.post('/',allowRoles("admin") , postStudent);

router.get('/:id',allowRoles("admin","student") , getById);

router.patch('/:id',allowRoles("admin") , editByEnroll);

router.delete('/:enrollment',allowRoles("admin") , deleteByEnroll);


// Get mentor details assigned to a student using enrollment number
router.get('/:enrollment/mentorDetail',allowRoles("admin","student") , individualMentorDetailsOfStudent)

// Get complete mentoring session history of a student using enrollment number for student
router.get('/:enrollment/mentoring-history',allowRoles("student") , completeMentoringHistoryOfStudent)

//upcoming mentoring session details
router.get('/:enrollment/upcoming-mentoring',allowRoles("student") , upcomingMentoringHistoryOfStudent)

//feedback by student
router.patch("/:enrollment/feedback",allowRoles("student"), addStudentFeedback);

module.exports = router;