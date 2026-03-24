const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  
  console.log('Connected to database!');

  // Add StudentID column to Student table if it doesn't exist
  const addStudentIdColumn = `ALTER TABLE Student ADD COLUMN IF NOT EXISTS StudentID INT AUTO_INCREMENT PRIMARY KEY FIRST`;

  db.query(addStudentIdColumn, (err, result) => {
    if (err && err.code !== 'ER_DUP_COLUMNNAME') {
      console.error('Error adding StudentID column:', err);
    } else {
      console.log('✓ StudentID column ready');
    }
  });

  // Create studentmentor table
  const createStudentMentorTable = `
    CREATE TABLE IF NOT EXISTS studentmentor (
      StudentMentorID INT PRIMARY KEY AUTO_INCREMENT,
      StudentID INT,
      StaffID INT,
      FromDate DATE,
      ToDate DATE,
      FOREIGN KEY (StudentID) REFERENCES Student(StudentID),
      FOREIGN KEY (StaffID) REFERENCES Staff(StaffID)
    )
  `;

  db.query(createStudentMentorTable, (err, result) => {
    if (err) {
      console.error('Error creating studentmentor table:', err);
    } else {
      console.log('✓ studentmentor table ready');
    }
  });

  // Create studentmentoring table
  const createStudentMentoringTable = `
    CREATE TABLE IF NOT EXISTS studentmentoring (
      StudentMentoringID INT PRIMARY KEY AUTO_INCREMENT,
      StudentMentorID INT,
      DateOfMentoring DATE,
      ScheduledMeetingDate DATE,
      MentoringMeetingAgenda TEXT,
      AttendanceStatus VARCHAR(20),
      StudentsOpinion TEXT,
      StaffOpinion TEXT,
      FOREIGN KEY (StudentMentorID) REFERENCES studentmentor(StudentMentorID)
    )
  `;

  db.query(createStudentMentoringTable, (err, result) => {
    if (err) {
      console.error('Error creating studentmentoring table:', err);
    } else {
      console.log('✓ studentmentoring table ready');
    }
  });

  // Insert sample data
  setTimeout(() => {
    // Assign mentor to student
    const assignMentor = `
      INSERT INTO studentmentor (StudentID, StaffID, FromDate, ToDate)
      VALUES ((SELECT StudentID FROM Student WHERE EnrollmentNo = 'STU001'), 2, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 6 MONTH))
    `;

    db.query(assignMentor, (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          console.log('Mentor assignment already exists');
        } else {
          console.error('Error assigning mentor:', err);
        }
      } else {
        console.log('✓ Mentor assigned to student');
      }

      // Add a sample session
      const insertSession = `
        INSERT INTO studentmentoring (StudentMentorID, DateOfMentoring, ScheduledMeetingDate, MentoringMeetingAgenda, AttendanceStatus, StudentsOpinion)
        VALUES (
          (SELECT StudentMentorID FROM studentmentor WHERE StudentID = (SELECT StudentID FROM Student WHERE EnrollmentNo = 'STU001')),
          DATE_SUB(CURDATE(), INTERVAL 7 DAY),
          DATE_ADD(CURDATE(), INTERVAL 7 DAY),
          'Introduction and Goal Setting',
          'Present',
          'Great session, very helpful guidance!'
        )
      `;

      db.query(insertSession, (err, result) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            console.log('Sample session already exists');
          } else {
            console.error('Error inserting session:', err);
          }
        } else {
          console.log('✓ Sample session created');
        }

        console.log('\n=== Database Setup Complete ===');
        console.log('Student STU001 now has a mentor and session data');
        console.log('Try logging in as student again!');
        db.end();
      });
    });
  }, 2000);
});
