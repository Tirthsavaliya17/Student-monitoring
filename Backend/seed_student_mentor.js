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

  // Create necessary tables
  const createStudentMentorTable = `
    CREATE TABLE IF NOT EXISTS StudentMentor (
      StudentMentorID INT PRIMARY KEY AUTO_INCREMENT,
      StudentID INT,
      StaffID INT,
      FromDate DATE,
      ToDate DATE,
      FOREIGN KEY (StudentID) REFERENCES Student(StudentID),
      FOREIGN KEY (StaffID) REFERENCES Staff(StaffID)
    )
  `;

  const createStudentMentoringTable = `
    CREATE TABLE IF NOT EXISTS StudentMentoring (
      StudentMentoringID INT PRIMARY KEY AUTO_INCREMENT,
      StudentMentorID INT,
      DateOfMentoring DATE,
      ScheduledMeetingDate DATE,
      MentoringMeetingAgenda TEXT,
      AttendanceStatus VARCHAR(20),
      StudentsOpinion TEXT,
      StaffOpinion TEXT,
      FOREIGN KEY (StudentMentorID) REFERENCES StudentMentor(StudentMentorID)
    )
  `;

  // Add StudentID column to Student table if it doesn't exist
  const addStudentIdColumn = `
    ALTER TABLE Student ADD COLUMN IF NOT EXISTS StudentID INT AUTO_INCREMENT PRIMARY KEY
  `;

  db.query(addStudentIdColumn, (err, result) => {
    if (err && err.code !== 'ER_DUP_COLUMNNAME') {
      console.error('Error adding StudentID column:', err);
    } else {
      console.log('StudentID column ready');
    }
  });

  db.query(createStudentMentorTable, (err, result) => {
    if (err) {
      console.error('Error creating StudentMentor table:', err);
    } else {
      console.log('StudentMentor table ready');
    }
  });

  db.query(createStudentMentoringTable, (err, result) => {
    if (err) {
      console.error('Error creating StudentMentoring table:', err);
    } else {
      console.log('StudentMentoring table ready');
    }
  });

  // Insert sample mentor assignment and sessions
  setTimeout(() => {
    // Assign mentor to student
    const assignMentor = `
      INSERT INTO StudentMentor (StudentID, StaffID, FromDate, ToDate)
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

      // Add some sample mentoring sessions
      const sessions = [
        {
          agenda: 'Introduction and Goal Setting',
          scheduled: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last week
          attendance: 'Present',
          studentOpinion: 'Great session, very helpful guidance!'
        },
        {
          agenda: 'Project Progress Review',
          scheduled: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Two weeks from now
          date: null, // Future session
          attendance: null,
          studentOpinion: null
        }
      ];

      sessions.forEach((session, index) => {
        const insertSession = `
          INSERT INTO StudentMentoring (StudentMentorID, DateOfMentoring, ScheduledMeetingDate, MentoringMeetingAgenda, AttendanceStatus, StudentsOpinion)
          VALUES (
            (SELECT StudentMentorID FROM StudentMentor WHERE StudentID = (SELECT StudentID FROM Student WHERE EnrollmentNo = 'STU001')),
            ${session.date ? `'${session.date.toISOString().split('T')[0]}'` : 'NULL'},
            '${session.scheduled.toISOString().split('T')[0]}',
            '${session.agenda}',
            ${session.attendance ? `'${session.attendance}'` : 'NULL'},
            ${session.studentOpinion ? `'${session.studentOpinion}'` : 'NULL'}
          )
        `;

        db.query(insertSession, (err, result) => {
          if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
              console.log(`Session already exists: ${session.agenda}`);
            } else {
              console.error('Error inserting session:', err);
            }
          } else {
            console.log(`✓ Created session: ${session.agenda}`);
          }

          if (index === sessions.length - 1) {
            console.log('\n=== Student Mentor Data Created ===');
            console.log('Student STU001 now has assigned mentor and sessions');
            console.log('Try logging in as student again!');
            db.end();
          }
        });
      });
    });
  }, 2000);
});
