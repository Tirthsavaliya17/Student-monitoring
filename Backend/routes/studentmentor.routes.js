const express = require('express');
const router = express.Router();
const db = require('../config/db');
const {assignMentor , changeMentor , currentMentorDetailsForStudent , allCurrentStudentsForMentor} = require('../controllers/studentmentor.controller')
const verifyToken = require("../middleware/auth.middleware");
const allowRoles = require('../middleware/allowed.middleware');

router.use(verifyToken);

//assign mentor to student
router.post('/mentor/assign',allowRoles("admin") , assignMentor);

//change mentor for student
router.patch('/mentor/change',allowRoles("admin") , changeMentor);

// Get currently assigned mentor details for a student
router.get('/current/:enrollment',allowRoles("admin","student") , currentMentorDetailsForStudent);

// Get list of current students assigned to a specific mentor
router.get('/by-mentor/:staffId',allowRoles("staff") , allCurrentStudentsForMentor);

module.exports = router;
