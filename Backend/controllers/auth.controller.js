const db = require('../config/db');
const jwt = require("jsonwebtoken");
const SECRET = "supersecretkey";

const ADMIN_EMAIL = "admin@darshan.ac.in";

function login(req, res) {
    const { email, password, role } = req.body;
    let sql;

    if (role === "admin" || role === "staff") {
        sql = "SELECT * FROM Staff WHERE EmailAddress=?";
    }
    else if (role === "student") {
        sql = "SELECT * FROM Student WHERE EmailAddress=?";
    }
    else {
        return res.status(400).json({ message: "Invalid role" });
    }


    db.query(sql, [email], (err, rows) => {
        if (err){
            return res.status(500).json(err);
        }
        if (rows.length === 0) {
            return res.status(401).json({ message: "User not found" });
        }

        const user = rows[0];

        if (password !== user.Password) {
            return res.status(401).json({ message: "Invalid password" });
        }

        if (role === "admin" && email !== ADMIN_EMAIL) {
            return res.status(403).json({
                message: "You are not authorized as admin"
            });
        }

        if (role === "staff" && email == ADMIN_EMAIL) {
            return res.status(403).json({
                message: "You are not authorized as staff"
            });
        }

        let payload;

        if (role === "admin" || role === "staff") {
            payload = {
                id: user.StaffID,
                role: role
            };
        }
        else if (role === "student") {
            payload = {
                id: user.EnrollmentNo,
                role: role
            };
        }

        const token = jwt.sign(
            payload,
            SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful",
            token
        });

    });

}


function getCurrentUser(req, res) {

    const id = req.user.id;
    const role = req.user.role;

    let sql;

    if (role === "student") {
        sql = "SELECT EnrollmentNo, StudentName as userName, EmailAddress FROM student WHERE EnrollmentNo = ?";
    }
    else if (role === "staff" || role === "admin") {
        sql = "SELECT StaffID, StaffName as userName, EmailAddress, Description FROM staff WHERE StaffID = ?";
    }

    db.query(sql, [id], (err, result) => {

        if (err) {
            console.log(err)
            return res.status(500).json({
                message: "Something went wrong"
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            role: role,
            user: result[0]
        });

    });
}

module.exports = { login , getCurrentUser };