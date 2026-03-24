const db = require("../config/db");

function getAllStaff(req,res){
    db.query("SELECT * FROM Staff", (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
}

function poststaff(req,res){
     const {
        StaffID,
        StaffName,
        MobileNo,
        EmailAddress,
        Password,
        Description
    } = req.body;

    if (!StaffID) {
        return res.status(400).json({ message: "StaffID is required" });
    }

    const sql = `
        INSERT INTO Staff
        (StaffID, StaffName, MobileNo, EmailAddress, Password, Description)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [StaffID, StaffName, MobileNo, EmailAddress, Password, Description],
        (err) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(400).json({
                        message: "StaffID or Email already exists"
                    });
                }
                return res.status(500).json(err);
            }

            res.status(201).json({
                message: "Staff created successfully",
                staffId: StaffID
            });
        }
    );
}

function getStaffById(req,res){
     const { id } = req.params;

    db.query(
        "SELECT * FROM Staff WHERE StaffID = ?",
        [id],
        (err, rows) => {
            if (err) return res.status(500).json(err);
            if (rows.length === 0)
                return res.status(404).json({ message: "Staff not found" });

            res.json(rows[0]);
        }
    );
}

function editStaffById(req,res){
    const { id } = req.params;

    db.query(
        "SELECT * FROM Staff WHERE StaffID = ?",
        [id],
        (err, rows) => {
            if (err) return res.status(500).json(err);
            if (rows.length === 0)
                return res.status(404).json({ message: "Staff not found" });

            const staff = rows[0];

            const updatedStaff = {
                StaffName: req.body.StaffName ?? staff.StaffName,
                MobileNo: req.body.MobileNo ?? staff.MobileNo,
                EmailAddress: req.body.EmailAddress ?? staff.EmailAddress,
                Password: req.body.Password ?? staff.Password,
                Description: req.body.Description ?? staff.Description
            };

            const sql = `
                UPDATE Staff SET
                    StaffName = ?,
                    MobileNo = ?,
                    EmailAddress = ?,
                    Password = ?,
                    Description = ?
                WHERE StaffID = ?
            `;

            db.query(
                sql,
                [
                    updatedStaff.StaffName,
                    updatedStaff.MobileNo,
                    updatedStaff.EmailAddress,
                    updatedStaff.Password,
                    updatedStaff.Description,
                    id
                ],
                (err2) => {
                    if (err2) {
                        if (err2.code === "ER_DUP_ENTRY") {
                            return res.status(400).json({
                                message: "Email already exists"
                            });
                        }
                        return res.status(500).json(err2);
                    }

                    res.json({ message: "Staff updated successfully" });
                }
            );
        }
    );
}

function deleteStaffById(req,res){
     const { id } = req.params;

    db.query(
        "DELETE FROM Staff WHERE StaffID = ?",
        [id],
        (err, result) => {
            if (err) return res.status(500).json(err);
            if (result.affectedRows === 0)
                return res.status(404).json({ message: "Staff not found" });

            res.json({ message: "Staff deleted successfully" });
        }
    );
}

function MentorsAllMentees(req,res){
     const sql = `select * from student stu
                join studentmentor sm
                on stu.studentID = sm.studentID
                where staffId = ?`;

    db.query(sql , [req.params.staffId] , (err,rows)=>{
        if(err){
            return res.status(500).json(err);
        }

        res.json(rows);
    })
}

function studentwiseMentoringSession(req,res){
    const { staffId } = req.params;
    const { enrollmentNo } = req.query;

    if (!enrollmentNo) {
        return res.status(400).json({
            message: "Enrollment number is required"
        });
    }

    const sql = `
        SELECT 
            smt.StudentMentoringID,
            smt.DateOfMentoring,
            smt.ScheduledMeetingDate,
            smt.NextMentoringDate,
            smt.IssuesDiscussed,
            smt.AttendanceStatus,
            smt.StudentsOpinion,
            smt.StaffOpinion,
            smt.StressLevel,
            smt.LearnerType,

            s.StudentID,
            s.StudentName,
            s.EnrollmentNo,

            st.StaffID,
            st.StaffName

        FROM StudentMentoring smt
        INNER JOIN StudentMentor sm
            ON smt.StudentMentorID = sm.StudentMentorID
        INNER JOIN Student s
            ON sm.StudentID = s.StudentID
        INNER JOIN Staff st
            ON sm.StaffID = st.StaffID

        WHERE st.StaffID = ?
          AND s.EnrollmentNo = ?

        ORDER BY smt.DateOfMentoring DESC
    `;

    db.query(
        sql,
        [staffId, enrollmentNo],
        (err, rows) => {
            if (err) {
                console.log(err);
                return res.status(500).json(err);
            }

            res.json({
                staffId,
                enrollmentNo,
                totalSessions: rows.length,
                sessions: rows
            });
        }
    );
}

function upcomingMentoringHistoryOfStudent(req, res) {
    const sql = `select * ,DATE_FORMAT(smg.ScheduledMeetingDate,'%d-%m-%Y') as ScheduledMeetingDate  from studentmentoring smg
                join studentmentor sm
                on smg.StudentMentorID = sm.StudentMentorID
                join staff stf
                on stf.StaffID = sm.StaffID
                join student stu
                on stu.StudentID = sm.StudentID
                where stf.StaffID = ? AND smg.ScheduledMeetingDate > CURDATE() AND smg.DateOfMentoring IS NULL
                ORDER BY smg.ScheduledMeetingDate`;

    db.query(sql, [req.params.staffId], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.json(result);
    })
}

module.exports = {upcomingMentoringHistoryOfStudent,getAllStaff , poststaff , getStaffById , editStaffById , deleteStaffById , MentorsAllMentees , studentwiseMentoringSession}