const express = require('express');
const router = express.Router();
const db = require('../config/db');
const {pendingSessionsForMentor,sessionsConductedHIstoryByMentorWithStudentDetail,scheduleNewMentoringSession,createNewMentoringSession , specificMentoringSessionDetails , updateMentoringSession , deleteMentoringSession , mentoringSessionHistoryWithMentorDetail ,sessionsConductedByMentorCount
    , sessionsConductedByMentorWithStudentDetail , pendingSessions , completingSession , mentorWiseMenteeList , mentorWiseMenteeByID , studentsMentoringDetailswithHistory , globalHistoryOfAllMentoringSessions
} = require('../controllers/studentmentoring.controller')
const verifyToken = require("../middleware/auth.middleware");
const allowRoles = require('../middleware/allowed.middleware');

router.use(verifyToken);

// Create a new mentoring session record for a student–mentor assignment
router.patch('/session/:staffId/:enrollmentNo',allowRoles("staff") , createNewMentoringSession);

//Schedule New Sessions
router.post('/newsession/:staffId/:enrollmentNo',allowRoles("staff") , scheduleNewMentoringSession);

//fetch specific mentoring session details with(student+mentor info)
router.get('/session/:studentMentoringId',allowRoles("admin","staff","student") , specificMentoringSessionDetails);

//update mentoring session details
router.patch('/session/:studentMentoringId',allowRoles("staff") , updateMentoringSession);

//delete mentoring session details
router.delete('/session/:studentMentoringId',allowRoles("staff") , deleteMentoringSession);

//fetch all mentoring session history of student with mentor details
router.get('/student/:studentId',allowRoles("admin","staff","student") , mentoringSessionHistoryWithMentorDetail);

//all session conducted by mentor with student details
router.get('/mentor/:staffId',allowRoles("admin") , sessionsConductedByMentorWithStudentDetail);

//History of Meeting conducted by mentor
router.get('/mentor/history/:staffId',allowRoles("staff") , sessionsConductedHIstoryByMentorWithStudentDetail);

//count
router.get('/count/mentor/:staffId',allowRoles("staff") , sessionsConductedByMentorCount);

//show pending sessions to admin with student+mentor details
router.get('/admin/mentoring/pending',allowRoles("admin") , pendingSessions);
//pending meeting for mentor
router.get('/admin/mentoring/pending/:staffid',allowRoles("staff") , pendingSessionsForMentor);

//completing session (with attendance, absent remark , parantal details ,opinion, stress level) by mentor
router.patch('/complete/:studentMentoringId',allowRoles("staff") , completingSession);

//giving list for all mentor's assigned student with student count
router.get('/reports/mentor-wise-mentees',allowRoles("admin") , mentorWiseMenteeList);

//giving list of all assigned student for particular mentor
router.get('/reports/mentor-wise-mentees/:staffId',allowRoles("admin") , mentorWiseMenteeByID);

//for student's all mentoring details + session history
router.get('/reports/student-progress/:studentId',allowRoles("admin") , studentsMentoringDetailswithHistory);

//global history for system's all mentoring session
router.get('/reports/mentoring-history',allowRoles("admin") , globalHistoryOfAllMentoringSessions);

module.exports = router;



// router.post('/session', (req, res) => {
//     const {
//         StudentMentoringID,
//         StudentMentorID,
//         DateOfMentoring,
//         ScheduledMeetingDate,
//         NextMentoringDate,
//         IssuesDiscussed,
//         MentoringMeetingAgenda,
//         AttendanceStatus,
//         AbsentRemarks,
//         IsParentPresent,
//         ParentName,
//         ParentMobileNo,
//         StudentsOpinion,
//         ParentsOpinion,
//         StaffOpinion,
//         StressLevel,
//         LearnerType,
//         MentoringDocument,
//         Description
//     } = req.body;

//     if (!StudentMentoringID || !StudentMentorID || !DateOfMentoring) {
//         return res.status(400).json({
//             message: "StudentMentoringID, StudentMentorID and DateOfMentoring are required"
//         });
//     }

//     const sql = `
//         INSERT INTO StudentMentoring (
//             StudentMentoringID,
//             StudentMentorID,
//             DateOfMentoring,
//             ScheduledMeetingDate,
//             NextMentoringDate,
//             IssuesDiscussed,
//             MentoringMeetingAgenda,
//             AttendanceStatus,
//             AbsentRemarks,
//             IsParentPresent,
//             ParentName,
//             ParentMobileNo,
//             StudentsOpinion,
//             ParentsOpinion,
//             StaffOpinion,
//             StressLevel,
//             LearnerType,
//             MentoringDocument,
//             Description
//         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     const values = [
//         StudentMentoringID,
//         StudentMentorID,
//         DateOfMentoring,
//         ScheduledMeetingDate || null,
//         NextMentoringDate || null,
//         IssuesDiscussed || null,
//         MentoringMeetingAgenda || null,
//         AttendanceStatus || null,
//         AbsentRemarks || null,
//         IsParentPresent ?? false,
//         ParentName || null,
//         ParentMobileNo || null,
//         StudentsOpinion || null,
//         ParentsOpinion || null,
//         StaffOpinion || null,
//         StressLevel || null,
//         LearnerType || null,
//         MentoringDocument || null,
//         Description || null
//     ];

//     db.query(sql, values, (err) => {
//         if (err) return res.status(500).json(err);

//         res.status(201).json({
//             message: "Mentoring session created successfully",
//             StudentMentoringID
//         });
//     });
// });
