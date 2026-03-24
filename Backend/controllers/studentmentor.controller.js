const db = require("../config/db");

function assignMentor(req,res){
     const {
        StudentID,
        StaffID,
        FromDate,
        ToDate,
        Description
    } = req.body;

    if (!StudentID || !StaffID || !FromDate) {
        return res.status(400).json({
            message: "StudentID, StaffID and FromDate are required"
        });
    }

    const checkSql = `
        SELECT * FROM StudentMentor
        WHERE StudentID = ?
          AND StaffID = ?
          AND ToDate IS NULL
    `;

    db.query(
        checkSql,
        [StudentID, StaffID],
        (err, rows) => {
            if (err) return res.status(500).json(err);

            if (rows.length > 0) {
                return res.status(400).json({
                    message: "This student is already assigned to this mentor"
                });
            }

            const insertSql = `
                INSERT INTO StudentMentor
                (StudentID, StaffID, FromDate, ToDate, Description)
                VALUES (?, ?, ?, ?, ?)
            `;

            db.query(
                insertSql,
                [
                    StudentID,
                    StaffID,
                    FromDate,
                    ToDate || null,
                    Description || null
                ],
                (err2, result) => {
                    if (err2) return res.status(500).json(err2);

                    res.status(201).json({
                        message: "Mentor assigned to student successfully",
                        StudentMentorID: result.insertId
                    });
                }
            );
        }
    );
}

function changeMentor(req,res){
    const {
        StudentID,
        NewStaffID,
        FromDate,
        Description
    } = req.body;

    if (!StudentID || !NewStaffID || !FromDate) {
        return res.status(400).json({
            message: "StudentID, NewStaffID and FromDate are required"
        });
    }

    db.query(
        `SELECT * FROM StudentMentor 
         WHERE StudentID = ? AND ToDate IS NULL`,
        [StudentID],
        (err, rows) => {
            if (err) return res.status(500).json(err);
            if (rows.length === 0) {
                return res.status(404).json({
                    message: "No active mentor found"
                });
            }

            const current = rows[0];

            db.query(
                `UPDATE StudentMentor 
                 SET ToDate = ?, Modified = CURRENT_TIMESTAMP
                 WHERE StudentMentorID = ?`,
                [FromDate, current.StudentMentorID],
                (err2) => {
                    if (err2) return res.status(500).json(err2);

                    db.query(
                        `INSERT INTO StudentMentor
                         (StudentID, StaffID, FromDate, Description)
                         VALUES (?, ?, ?, ?)`,
                        [StudentID, NewStaffID, FromDate, Description || null],
                        (err3, result) => {
                            if (err3) return res.status(500).json(err3);

                            res.json({
                                message: "Mentor changed successfully",
                                oldMentorEndedOn: FromDate,
                                newMentorStartedOn: FromDate,
                                newStudentMentorID: result.insertId
                            });
                        }
                    );
                }
            );
        }
    );
}

function currentMentorDetailsForStudent(req,res){
    const sql = `
        SELECT 
            sm.StudentMentorID,
            sm.FromDate,
            s.StaffID,
            s.StaffName,
            s.MobileNo,
            s.EmailAddress,
            s.Description AS StaffDescription
        FROM StudentMentor sm
        JOIN Staff s ON sm.StaffID = s.StaffID
        JOIN Student stu 
        on stu.studentId = sm.studentId
        WHERE stu.EnrollmentNo = ?
          AND sm.ToDate IS NULL
    `;

    db.query(sql, [req.params.enrollment], (err, rows) => {
        if (err) return res.status(500).json(err);

        if (rows.length === 0) {
            return res.status(404).json({
                message: "No active mentor found for this student"
            });
        }

        res.json(rows[0]); 
    });
}

function allCurrentStudentsForMentor(req,res){
    const { staffId } = req.params;

    const sql = `
        SELECT 
            sm.StudentMentorID,
            sm.FromDate,
            s.StudentID,
            s.StudentName,
            s.EnrollmentNo,
            s.MobileNo,
            s.EmailAddress
        FROM StudentMentor sm
        JOIN Student s ON sm.StudentID = s.StudentID
        WHERE sm.StaffID = ?
          AND sm.ToDate IS NULL
        ORDER BY sm.FromDate ASC
    `;

    db.query(sql, [staffId], (err, rows) => {
        if (err) return res.status(500).json(err);

        if (rows.length === 0) {
            return res.json({
                message: "No active students found for this mentor",
                data: []
            });
        }

        res.json(rows);
    });
}

module.exports = {assignMentor , changeMentor ,currentMentorDetailsForStudent , allCurrentStudentsForMentor}