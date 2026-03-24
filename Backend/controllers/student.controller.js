const db = require("../config/db");

function getAllStudents(req, res) {
    const sql = "SELECT * FROM student";

    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Database error" });
        }
        res.json(results);
    });
}

function postStudent(req, res) {
    const sql = `INSERT INTO student
                (StudentName, EnrollmentNo, Password, MobileNo, EmailAddress, Description)
                VALUES (?, ?, ?, ?, ?, ?)`;

    const { StudentName, EnrollmentNo, Password, MobileNo, EmailAddress, Description } = req.body;

    db.query(sql, [StudentName, EnrollmentNo, Password, MobileNo, EmailAddress, Description], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.json({ message: "Student created", id: result.insertId });
    })
}

function getById(req, res) {
    const sql = `select * from student
                where EnrollmentNo = ?`;

    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json("something went wrong")
        }

        res.json(result);
    })
}

function editByEnroll(req, res) {
    const { id } = req.params;

    db.query(
        "SELECT * FROM Student WHERE EnrollmentNo = ?",
        [id],
        (err, rows) => {
            if (err) return res.status(500).json(err);
            if (rows.length === 0)
                return res.status(404).json({ message: "Student not found" });

            const student = rows[0];

            const updatedStudent = {
                StudentName: req.body.StudentName ?? student.StudentName,
                EnrollmentNo: req.body.EnrollmentNo ?? student.EnrollmentNo,
                MobileNo: req.body.MobileNo ?? student.MobileNo,
                EmailAddress: req.body.EmailAddress ?? student.EmailAddress,
                Description: req.body.Description ?? student.Description
            };

            const sql = `
                UPDATE Student SET
                    StudentName = ?,
                    EnrollmentNo = ?,
                    MobileNo = ?,
                    EmailAddress = ?,
                    Description = ?,
                    Modified = CURRENT_TIMESTAMP
                WHERE EnrollmentNo = ?
            `;

            db.query(
                sql,
                [
                    updatedStudent.StudentName,
                    updatedStudent.EnrollmentNo,
                    updatedStudent.MobileNo,
                    updatedStudent.EmailAddress,
                    updatedStudent.Description,
                    id
                ],
                (err2) => {
                    if (err2) return res.status(500).json(err2);

                    res.json({ message: "Student updated successfully" });
                }
            );
        }
    );
}

function deleteByEnroll(req, res) {
    const sql = `delete from student
                 where EnrollmentNo = ?`;

    db.query(sql, [req.params.enrollment], (err, result) => {
        if (err) {
            res.status(500).json(err);
        }
        res.json(`${req.params.enrollment} is deleted`);
    })
}

function individualMentorDetailsOfStudent(req, res) {
    const sql = `select *,s.EmailAddress as FacEmail,DATE_FORMAT(sm.FromDate,'%d-%m-%Y') as AssignedDate , s.Description as Description , s.MobileNo as MobileNo from staff s
                 join studentmentor sm
                 on s.StaffID = sm.StaffID
                 join student stu
                 on sm.StudentID = stu.StudentID
                 where stu.EnrollmentNo = ?`;

    db.query(sql, [req.params.enrollment], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);
    })
}

function completeMentoringHistoryOfStudent(req, res) {
    const sql = `select * , DATE_FORMAT(smg.DateOfMentoring,'%d-%m-%Y') as DateOfMentoring from studentmentoring smg
                join studentmentor sm
                on smg.StudentMentorID = sm.StudentMentorID
                join student stu
                on stu.StudentID = sm.StudentID
                where stu.EnrollmentNo = ? AND (smg.DateOfMentoring <= CURDATE() OR smg.DateOfMentoring IS NOT NULL)
                order by smg.DateOfMentoring desc`;

    db.query(sql, [req.params.enrollment], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.json(result);
    })
}

function upcomingMentoringHistoryOfStudent(req, res) {
    const sql = `select * ,DATE_FORMAT(smg.ScheduledMeetingDate,'%d-%m-%Y') as ScheduledMeetingDate  from studentmentoring smg
                join studentmentor sm
                on smg.StudentMentorID = sm.StudentMentorID
                join student stu
                on stu.StudentID = sm.StudentID
                where stu.EnrollmentNo = ? AND smg.ScheduledMeetingDate > CURDATE() AND smg.DateOfMentoring IS NULL
                ORDER BY smg.ScheduledMeetingDate`;

    db.query(sql, [req.params.enrollment], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.json(result);
    })
}

function addStudentFeedback(req, res) {

    const { opinion } = req.body;
    const enrollment = req.params.enrollment;

    const sql = `
        UPDATE StudentMentoring
        SET StudentsOpinion = ?
        WHERE StudentMentoringID = (
        SELECT id FROM (
        SELECT smg.StudentMentoringID AS id
        FROM StudentMentoring smg
        JOIN StudentMentor sm ON smg.StudentMentorID = sm.StudentMentorID
        JOIN Student stu ON sm.StudentID = stu.StudentID
        WHERE stu.EnrollmentNo = ?
        ORDER BY smg.DateOfMentoring DESC
        LIMIT 1
    ) AS temp
);
    `;

    db.query(sql, [opinion, enrollment], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json({
            message: "Student feedback updated successfully"
        });

    });
}

module.exports = { getAllStudents, postStudent, getById, editByEnroll, deleteByEnroll, individualMentorDetailsOfStudent, completeMentoringHistoryOfStudent, upcomingMentoringHistoryOfStudent, addStudentFeedback }