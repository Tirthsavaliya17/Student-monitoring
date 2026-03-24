const db = require("../config/db");

function createNewMentoringSession(req, res) {
    const { staffId, enrollmentNo } = req.params;

    const {
        StudentMentoringID,
        DateOfMentoring,
        ScheduledMeetingDate,
        NextMentoringDate,
        IssuesDiscussed,
        MentoringMeetingAgenda,
        AttendanceStatus,
        AbsentRemarks,
        IsParentPresent,
        ParentName,
        ParentMobileNo,
        StudentsOpinion,
        ParentsOpinion,
        StaffOpinion,
        StressLevel,
        LearnerType,
        MentoringDocument,
        Description
    } = req.body;

    if (!StudentMentoringID || !DateOfMentoring) {
        return res.status(400).json({
            message: "StudentMentoringID and DateOfMentoring are required"
        });
    }

    const findMentorSql = `
        SELECT sm.StudentMentorID
        FROM StudentMentor sm
        JOIN Student s ON sm.StudentID = s.StudentID
        WHERE sm.StaffID = ?
          AND s.EnrollmentNo = ?
          AND sm.ToDate IS NULL
    `;

    db.query(findMentorSql, [staffId, enrollmentNo], (err, rows) => {
        if (err) return res.status(500).json(err);

        if (rows.length === 0) {
            return res.status(403).json({
                message: "This student is not assigned to this mentor"
            });
        }

        const StudentMentorID = rows[0].StudentMentorID;

        const insertSql = `
            INSERT INTO StudentMentoring (
                StudentMentoringID,
                StudentMentorID,
                DateOfMentoring,
                ScheduledMeetingDate,
                NextMentoringDate,
                IssuesDiscussed,
                MentoringMeetingAgenda,
                AttendanceStatus,
                AbsentRemarks,
                IsParentPresent,
                ParentName,
                ParentMobileNo,
                StudentsOpinion,
                ParentsOpinion,
                StaffOpinion,
                StressLevel,
                LearnerType,
                MentoringDocument,
                Description
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            StudentMentoringID,
            StudentMentorID,
            DateOfMentoring,
            ScheduledMeetingDate || null,
            NextMentoringDate || null,
            IssuesDiscussed || null,
            MentoringMeetingAgenda || null,
            AttendanceStatus || null,
            AbsentRemarks || null,
            IsParentPresent ?? false,
            ParentName || null,
            ParentMobileNo || null,
            StudentsOpinion || null,
            ParentsOpinion || null,
            StaffOpinion || null,
            StressLevel || null,
            LearnerType || null,
            MentoringDocument || null,
            Description || null
        ];

        db.query(insertSql, values, (err) => {
            if (err) return res.status(500).json(err);

            res.status(201).json({
                message: "Mentoring session created successfully",
                StudentMentoringID
            });
        });
    });
}

function specificMentoringSessionDetails(req, res) {
    const { studentMentoringId } = req.params;

    const sql = `
        SELECT
            smg.StudentMentoringID,
            smg.StudentMentorID,

            smg.DateOfMentoring,
            smg.ScheduledMeetingDate,
            smg.NextMentoringDate,

            smg.IssuesDiscussed,
            smg.MentoringMeetingAgenda,
            smg.AttendanceStatus,
            smg.AbsentRemarks,

            smg.IsParentPresent,
            smg.ParentName,
            smg.ParentMobileNo,

            smg.StudentsOpinion,
            smg.ParentsOpinion,
            smg.StaffOpinion,

            smg.StressLevel,
            smg.LearnerType,
            smg.MentoringDocument,
            smg.Description,

            st.StudentID,
            st.StudentName,
            st.EnrollmentNo,

            sf.StaffID,
            sf.StaffName,
            sf.EmailAddress,
            sf.MobileNo
        FROM StudentMentoring smg
        JOIN StudentMentor sm ON smg.StudentMentorID = sm.StudentMentorID
        JOIN Student st ON sm.StudentID = st.StudentID
        JOIN Staff sf ON sm.StaffID = sf.StaffID
        WHERE smg.StudentMentoringID = ?
    `;

    db.query(sql, [studentMentoringId], (err, rows) => {
        if (err) return res.status(500).json(err);

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Mentoring session not found"
            });
        }

        res.json(rows[0]);
    });
}

// function updateMentoringSession(req,res){
//     const { studentMentoringId } = req.params;

//     const {
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

//     const sql = `
//         UPDATE StudentMentoring SET
//             DateOfMentoring = ?,
//             ScheduledMeetingDate = ?,
//             NextMentoringDate = ?,
//             IssuesDiscussed = ?,
//             MentoringMeetingAgenda = ?,
//             AttendanceStatus = ?,
//             AbsentRemarks = ?,
//             IsParentPresent = ?,
//             ParentName = ?,
//             ParentMobileNo = ?,
//             StudentsOpinion = ?,
//             ParentsOpinion = ?,
//             StaffOpinion = ?,
//             StressLevel = ?,
//             LearnerType = ?,
//             MentoringDocument = ?,
//             Description = ?,
//             Modified = CURRENT_TIMESTAMP
//         WHERE StudentMentoringID = ?
//     `;

//     const values = [
//         DateOfMentoring ?? null,
//         ScheduledMeetingDate ?? null,
//         NextMentoringDate ?? null,
//         IssuesDiscussed ?? null,
//         MentoringMeetingAgenda ?? null,
//         AttendanceStatus ?? null,
//         AbsentRemarks ?? null,
//         IsParentPresent ? 1 : 0,
//         ParentName ?? null,
//         ParentMobileNo ?? null,
//         StudentsOpinion ?? null,
//         ParentsOpinion ?? null,
//         StaffOpinion ?? null,
//         StressLevel ?? null,
//         LearnerType ?? null,
//         MentoringDocument ?? null,
//         Description ?? null,
//         studentMentoringId
//     ];

//     db.query(sql, values, (err, result) => {
//         if (err) return res.status(500).json(err);

//         if (result.affectedRows === 0) {
//             return res.status(404).json({
//                 message: "Mentoring session not found"
//             });
//         }

//         res.json({
//             message: "Mentoring session updated successfully"
//         });
//     });
// }

function updateMentoringSession(req, res) {

    const { studentMentoringId } = req.params;

    const {
        DateOfMentoring,
        NextMentoringDate,
        IssuesDiscussed,
        MentoringMeetingAgenda,
        AttendanceStatus,
        AbsentRemarks,
        IsParentPresent,
        ParentName,
        ParentMobileNo,
        StudentsOpinion,
        ParentsOpinion,
        StaffOpinion,
        StressLevel,
        LearnerType,
        MentoringDocument,
        Description
    } = req.body;

    const sql = `
UPDATE StudentMentoring SET
DateOfMentoring = ?,
NextMentoringDate = ?,
IssuesDiscussed = ?,
MentoringMeetingAgenda = ?,
AttendanceStatus = ?,
AbsentRemarks = ?,
IsParentPresent = ?,
ParentName = ?,
ParentMobileNo = ?,
StudentsOpinion = ?,
ParentsOpinion = ?,
StaffOpinion = ?,
StressLevel = ?,
LearnerType = ?,
MentoringDocument = ?,
Description = ?,
Modified = CURRENT_TIMESTAMP
WHERE StudentMentoringID = ?
`;

    const values = [
        DateOfMentoring || null,
        NextMentoringDate || null,
        IssuesDiscussed || null,
        MentoringMeetingAgenda || null,
        AttendanceStatus || null,
        AbsentRemarks || null,
        IsParentPresent ? 1 : 0,
        ParentName || null,
        ParentMobileNo || null,
        StudentsOpinion || null,
        ParentsOpinion || null,
        StaffOpinion || null,
        StressLevel || null,
        LearnerType || null,
        MentoringDocument || null,
        Description || null,
        studentMentoringId
    ];

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Mentoring session not found" });
        }

        res.json({ message: "Mentoring session updated successfully" });
    });
}

function deleteMentoringSession(req, res) {
    const { studentMentoringId } = req.params;

    const sql = `
        DELETE FROM StudentMentoring
        WHERE StudentMentoringID = ?
    `;

    db.query(sql, [studentMentoringId], (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Mentoring session not found"
            });
        }

        res.json({
            message: "Mentoring session deleted successfully"
        });
    });
}

function mentoringSessionHistoryWithMentorDetail(req, res) {
    const { studentId } = req.params;

    const sql = `
        SELECT
            smg.StudentMentoringID,
            smg.StudentMentorID,

            smg.DateOfMentoring,
            smg.ScheduledMeetingDate,
            smg.NextMentoringDate,

            smg.IssuesDiscussed,
            smg.MentoringMeetingAgenda,
            smg.AttendanceStatus,
            smg.AbsentRemarks,

            smg.IsParentPresent,
            smg.ParentName,
            smg.ParentMobileNo,

            smg.StudentsOpinion,
            smg.ParentsOpinion,
            smg.StaffOpinion,

            smg.StressLevel,
            smg.LearnerType,
            smg.MentoringDocument,
            smg.Description,

            sf.StaffID,
            sf.StaffName,
            sf.EmailAddress,
            sf.MobileNo
        FROM StudentMentoring smg
        JOIN StudentMentor sm ON smg.StudentMentorID = sm.StudentMentorID
        JOIN Staff sf ON sm.StaffID = sf.StaffID
        WHERE sm.StudentID = ?
        ORDER BY smg.DateOfMentoring DESC
    `;

    db.query(sql, [studentId], (err, rows) => {
        if (err) return res.status(500).json(err);

        if (rows.length === 0) {
            return res.json({
                message: "No mentoring sessions found",
                data: []
            });
        }

        res.json(rows);
    });
}

function sessionsConductedByMentorWithStudentDetail(req, res) {
    const { staffId } = req.params;

    const sql = `
        SELECT
            smg.StudentMentoringID,
            smg.StudentMentorID,

            smg.DateOfMentoring,
            smg.ScheduledMeetingDate,
            smg.NextMentoringDate,

            smg.IssuesDiscussed,
            smg.MentoringMeetingAgenda,
            smg.AttendanceStatus,
            smg.AbsentRemarks,

            smg.IsParentPresent,
            smg.ParentName,
            smg.ParentMobileNo,

            smg.StudentsOpinion,
            smg.ParentsOpinion,
            smg.StaffOpinion,

            smg.StressLevel,
            smg.LearnerType,
            smg.MentoringDocument,
            smg.Description,

            st.StudentID,
            st.StudentName,
            st.EnrollmentNo,
            st.EmailAddress,
            st.MobileNo
        FROM StudentMentoring smg
        JOIN StudentMentor sm ON smg.StudentMentorID = sm.StudentMentorID
        JOIN Student st ON sm.StudentID = st.StudentID
        WHERE sm.StaffID = ?
        ORDER BY smg.DateOfMentoring DESC
    `;

    db.query(sql, [staffId], (err, rows) => {
        if (err) return res.status(500).json(err);

        if (rows.length === 0) {
            return res.json({
                message: "No mentoring sessions found for this mentor",
                data: []
            });
        }

        res.json(rows);
    });
}

function sessionsConductedByMentorCount(req, res) {
    const { staffId } = req.params;

    const sql = `
        SELECT 
            COUNT(smg.StudentMentoringID) AS totalMeetings,
            COUNT(smg.DateOfMentoring) AS AttendedMeetings,
            COUNT(DISTINCT sm.StudentID) AS totalStudents
        FROM StudentMentor sm
        LEFT JOIN StudentMentoring smg 
            ON sm.StudentMentorID = smg.StudentMentorID
        WHERE sm.StaffID = ?
    `;

    db.query(sql, [staffId], (err, rows) => {
        if (err) return res.status(500).json(err);

        res.json(rows);
    });
}

function sessionsConductedHIstoryByMentorWithStudentDetail(req, res) {
    const { staffId } = req.params;

    const sql = `
        SELECT
            smg.StudentMentoringID,
            smg.StudentMentorID,

            DATE_FORMAT(smg.DateOfMentoring,'%d-%m-%Y') as DateOfMentoring,
            DATE_FORMAT(smg.ScheduledMeetingDate,'%d-%m-%Y') as ScheduledMeetingDate,
            DATE_FORMAT(smg.NextMentoringDate,'%d-%m-%Y') as NextMentoringDate,

            smg.IssuesDiscussed,
            smg.MentoringMeetingAgenda,
            smg.AttendanceStatus,
            smg.AbsentRemarks,

            smg.IsParentPresent,
            smg.ParentName,
            smg.ParentMobileNo,

            smg.StudentsOpinion,
            smg.ParentsOpinion,
            smg.StaffOpinion,

            smg.StressLevel,
            smg.LearnerType,
            smg.MentoringDocument,
            smg.Description,

            st.StudentID,
            st.StudentName,
            st.EnrollmentNo,
            st.EmailAddress,
            st.MobileNo

        FROM StudentMentoring smg
        JOIN StudentMentor sm ON smg.StudentMentorID = sm.StudentMentorID
        JOIN Student st ON sm.StudentID = st.StudentID

        WHERE sm.StaffID = ?
        AND (smg.DateOfMentoring IS NOT NULL
        OR smg.DateOfMentoring <= CURDATE())

        ORDER BY smg.DateOfMentoring DESC
    `;

    db.query(sql, [staffId], (err, rows) => {
        if (err) return res.status(500).json(err);

        if (rows.length === 0) {
            return res.json({
                message: "No mentoring session history found",
                data: []
            });
        }

        res.json(rows);
    });
}

function pendingSessions(req, res) {
    const sql = `
        SELECT
            smg.StudentMentoringID,
            DATE_FORMAT(smg.ScheduledMeetingDate,'%d-%m-%Y') as ScheduledMeetingDate,

            st.StudentID,
            st.StudentName,
            st.EnrollmentNo,

            sf.StaffID,
            sf.StaffName,

            CASE
                WHEN smg.AttendanceStatus IS NOT NULL AND smg.AttendanceStatus != 'Scheduled' THEN 'Done'
                WHEN smg.ScheduledMeetingDate < CURDATE() THEN 'Pending'
                ELSE 'Upcoming'
            END AS MentoringStatus
        FROM StudentMentoring smg
        JOIN StudentMentor sm ON smg.StudentMentorID = sm.StudentMentorID
        JOIN Student st ON sm.StudentID = st.StudentID
        JOIN Staff sf ON sm.StaffID = sf.StaffID
        WHERE (smg.AttendanceStatus IS NULL OR smg.AttendanceStatus = 'Scheduled')
          AND smg.ScheduledMeetingDate <= CURDATE()
        ORDER BY smg.ScheduledMeetingDate ASC
    `;

    db.query(sql, (err, rows) => {
        if (err) return res.status(500).json(err);

        res.json(rows);
    });
}

function pendingSessionsForMentor(req, res) {
    const sql = `
       SELECT 
    smng.StudentMentoringID,
    s.EnrollmentNo,
    s.StudentName,
    DATE_FORMAT(smng.ScheduledMeetingDate,'%d-%m-%Y') as ScheduledMeetingDate,
    smng.AttendanceStatus,
    smng.MentoringMeetingAgenda
FROM 
    StudentMentoring smng
JOIN 
    StudentMentor sm ON smng.StudentMentorID = sm.StudentMentorID
JOIN 
    Student s ON sm.StudentID = s.StudentID
WHERE 
    sm.StaffID = ?
    AND (smng.AttendanceStatus IS NULL OR smng.AttendanceStatus = 'Scheduled')
ORDER BY 
    smng.ScheduledMeetingDate DESC;
    `;

    db.query(sql, [req.params.staffid], (err, rows) => {
        if (err) return res.status(500).json(err);

        res.json(rows);
    });
}

function completingSession(req, res) {
    const { studentMentoringId } = req.params;

    const {
        AttendanceStatus,
        AbsentRemarks,
        IsParentPresent,
        ParentName,
        ParentMobileNo,
        StaffOpinion,
        StressLevel
    } = req.body;

    if (!AttendanceStatus) {
        return res.status(400).json({
            message: "AttendanceStatus is required to complete mentoring"
        });
    }

    const sql = `
        UPDATE StudentMentoring SET
            AttendanceStatus = ?,
            AbsentRemarks = ?,
            IsParentPresent = ?,
            ParentName = ?,
            ParentMobileNo = ?,
            StaffOpinion = ?,
            StressLevel = ?,
            DateOfMentoring = CURDATE(),
            Modified = CURRENT_TIMESTAMP
        WHERE StudentMentoringID = ?
    `;

    const values = [
        AttendanceStatus,
        AbsentRemarks ?? null,
        IsParentPresent ?? false,
        ParentName ?? null,
        ParentMobileNo ?? null,
        StaffOpinion ?? null,
        StressLevel ?? null,
        studentMentoringId
    ];

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Mentoring session not found"
            });
        }

        res.json({
            message: "Mentoring marked as completed by mentor"
        });
    });
}

function mentorWiseMenteeList(req, res) {
    const sql = `
        SELECT 
            st.StaffID,
            st.StaffName,
            st.EmailAddress,
            s.StudentID,
            s.StudentName,
            s.EnrollmentNo
        FROM Staff st
        LEFT JOIN StudentMentor sm 
            ON st.StaffID = sm.StaffID
        LEFT JOIN Student s 
            ON sm.StudentID = s.StudentID
        ORDER BY st.StaffID
    `;

    db.query(sql, (err, rows) => {
        if (err) return res.status(500).json(err);

        const result = {};

        rows.forEach(row => {
            if (!result[row.StaffID]) {
                result[row.StaffID] = {
                    StaffID: row.StaffID,
                    StaffName: row.StaffName,
                    EmailAddress: row.EmailAddress,
                    TotalMentees: 0,
                    Students: []
                };
            }

            if (row.StudentID) {
                result[row.StaffID].Students.push({
                    StudentID: row.StudentID,
                    StudentName: row.StudentName,
                    EnrollmentNo: row.EnrollmentNo
                });
                result[row.StaffID].TotalMentees++;
            }
        });

        res.json(Object.values(result));
    });
}

function mentorWiseMenteeByID(req, res) {
    const { staffId } = req.params;

    const sql = `
        SELECT 
            st.StaffID,
            st.StaffName,
            st.EmailAddress,
            s.StudentID,
            s.StudentName,
            s.EnrollmentNo
        FROM Staff st
        LEFT JOIN StudentMentor sm 
            ON st.StaffID = sm.StaffID
        LEFT JOIN Student s 
            ON sm.StudentID = s.StudentID
        WHERE st.StaffID = ?
    `;

    db.query(sql, [staffId], (err, rows) => {
        if (err) return res.status(500).json(err);

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Mentor not found"
            });
        }

        const mentor = {
            StaffID: rows[0].StaffID,
            StaffName: rows[0].StaffName,
            EmailAddress: rows[0].EmailAddress,
            TotalMentees: 0,
            Students: []
        };

        rows.forEach(row => {
            if (row.StudentID) {
                mentor.Students.push({
                    StudentID: row.StudentID,
                    StudentName: row.StudentName,
                    EnrollmentNo: row.EnrollmentNo
                });
                mentor.TotalMentees++;
            }
        });

        res.json(mentor);
    });
}

function studentsMentoringDetailswithHistory(req, res) {
    const { studentId } = req.params;

    db.query(sql, [studentId], (err, rows) => {
        if (err) return res.status(500).json(err);

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        const response = {
            StudentID: rows[0].StudentID,
            StudentName: rows[0].StudentName,
            EnrollmentNo: rows[0].EnrollmentNo,

            Mentor: rows[0].StaffID ? {
                StaffID: rows[0].StaffID,
                StaffName: rows[0].StaffName
            } : null,

            Sessions: []  
        };

        rows.forEach(row => {
            if (row.StudentMentoringID) {
                response.Sessions.push({
                    StudentMentoringID: row.StudentMentoringID,
                    DateOfMentoring: row.DateOfMentoring,
                    ScheduledMeetingDate: row.ScheduledMeetingDate,
                    NextMentoringDate: row.NextMentoringDate,
                    IssuesDiscussed: row.IssuesDiscussed,
                    MentoringMeetingAgenda: row.MentoringMeetingAgenda,
                    AttendanceStatus: row.AttendanceStatus,
                    AbsentRemarks: row.AbsentRemarks,
                    IsParentPresent: row.IsParentPresent,
                    ParentName: row.ParentName,
                    ParentMobileNo: row.ParentMobileNo,
                    StudentsOpinion: row.StudentsOpinion,
                    ParentsOpinion: row.ParentsOpinion,
                    StaffOpinion: row.StaffOpinion,
                    StressLevel: row.StressLevel,
                    LearnerType: row.LearnerType,
                    MentoringDocument: row.MentoringDocument,
                    Description: row.Description,
                    Created: row.Created,
                    Modified: row.Modified
                });
            }
        });

        res.json(response);
    });
}

function globalHistoryOfAllMentoringSessions(req, res) {
    const sql = `
        SELECT
            m.StudentMentoringID,
            m.StudentMentorID,
            m.DateOfMentoring,
            m.ScheduledMeetingDate,
            m.NextMentoringDate,
            m.IssuesDiscussed,
            m.MentoringMeetingAgenda,
            m.AttendanceStatus,
            m.AbsentRemarks,
            m.IsParentPresent,
            m.ParentName,
            m.ParentMobileNo,
            m.StudentsOpinion,
            m.ParentsOpinion,
            m.StaffOpinion,
            m.StressLevel,
            m.LearnerType,
            m.MentoringDocument,
            m.Description AS MentoringDescription,
            m.Created AS MentoringCreated,
            m.Modified AS MentoringModified,

            s.StudentID,
            s.StudentName,
            s.EnrollmentNo,
            s.EmailAddress AS StudentEmail,
            s.MobileNo AS StudentMobile,

            st.StaffID,
            st.StaffName,
            st.EmailAddress AS StaffEmail,
            st.MobileNo AS StaffMobile

        FROM StudentMentoring m
        INNER JOIN StudentMentor sm
            ON m.StudentMentorID = sm.StudentMentorID
        INNER JOIN Student s
            ON sm.StudentID = s.StudentID
        INNER JOIN Staff st
            ON sm.StaffID = st.StaffID
        ORDER BY m.DateOfMentoring DESC
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }
        res.json(result);
    });
}

function scheduleNewMentoringSession(req, res) {

    const { staffId, enrollmentNo } = req.params;
    const { date, time, MentoringMeetingAgenda } = req.body;

    if (!date || !time || !MentoringMeetingAgenda) {
        return res.status(400).json({
            message: "date, time and MentoringMeetingAgenda are required"
        });
    }

    const ScheduledMeetingDate = `${date} ${time}:00`;

    const findMentorSql = `
        SELECT sm.StudentMentorID
        FROM StudentMentor sm
        JOIN Student s ON sm.StudentID = s.StudentID
        WHERE sm.StaffID = ?
        AND s.EnrollmentNo = ?
        AND sm.ToDate IS NULL
    `;

    db.query(findMentorSql, [staffId, enrollmentNo], (err, rows) => {

        if (err) return res.status(500).json(err);

        if (rows.length === 0) {
            return res.status(403).json({
                message: "This student is not assigned to this mentor"
            });
        }

        const StudentMentorID = rows[0].StudentMentorID;

        const insertSql = `
            INSERT INTO StudentMentoring (
                StudentMentorID,
                ScheduledMeetingDate,
                MentoringMeetingAgenda,
                AttendanceStatus
            ) VALUES (?, ?, ?,"Scheduled")
        `;

        db.query(
            insertSql,
            [StudentMentorID, ScheduledMeetingDate, MentoringMeetingAgenda],
            (err, result) => {

                if (err) return res.status(500).json(err);

                res.status(201).json({
                    message: "Mentoring session scheduled successfully",
                    StudentMentoringID: result.insertId
                });
            }
        );

    });
}
module.exports = { pendingSessionsForMentor, sessionsConductedHIstoryByMentorWithStudentDetail, scheduleNewMentoringSession, sessionsConductedByMentorCount, createNewMentoringSession, specificMentoringSessionDetails, updateMentoringSession, deleteMentoringSession, mentoringSessionHistoryWithMentorDetail, sessionsConductedByMentorWithStudentDetail, pendingSessions, completingSession, mentorWiseMenteeList, mentorWiseMenteeByID, studentsMentoringDetailswithHistory, globalHistoryOfAllMentoringSessions }
