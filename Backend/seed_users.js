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

  // Create tables if they don't exist
  const createStudentTable = `
    CREATE TABLE IF NOT EXISTS Student (
      EnrollmentNo VARCHAR(20) PRIMARY KEY,
      StudentName VARCHAR(100) NOT NULL,
      EmailAddress VARCHAR(100) UNIQUE NOT NULL,
      Password VARCHAR(100) NOT NULL
    )
  `;

  const createStaffTable = `
    CREATE TABLE IF NOT EXISTS Staff (
      StaffID INT PRIMARY KEY AUTO_INCREMENT,
      StaffName VARCHAR(100) NOT NULL,
      EmailAddress VARCHAR(100) UNIQUE NOT NULL,
      Password VARCHAR(100) NOT NULL,
      Description TEXT
    )
  `;

  db.query(createStudentTable, (err, result) => {
    if (err) {
      console.error('Error creating Student table:', err);
    } else {
      console.log('Student table ready');
    }
  });

  db.query(createStaffTable, (err, result) => {
    if (err) {
      console.error('Error creating Staff table:', err);
    } else {
      console.log('Staff table ready');
    }
  });

  // Insert test users
  const testUsers = [
    // Admin user
    {
      table: 'Staff',
      data: {
        StaffName: 'Admin User',
        EmailAddress: 'admin@darshan.ac.in',
        Password: 'admin123'
      }
    },
    // Staff user
    {
      table: 'Staff', 
      data: {
        StaffName: 'John Mentor',
        EmailAddress: 'john@darshan.ac.in',
        Password: 'staff123'
      }
    },
    // Student user
    {
      table: 'Student',
      data: {
        EnrollmentNo: 'STU001',
        StudentName: 'Alice Student',
        EmailAddress: 'alice@student.com',
        Password: 'student123'
      }
    }
  ];

  setTimeout(() => {
    testUsers.forEach((user, index) => {
      let sql, values;
      
      if (user.table === 'Staff') {
        sql = 'INSERT INTO Staff (StaffName, EmailAddress, Password) VALUES (?, ?, ?)';
        values = [user.data.StaffName, user.data.EmailAddress, user.data.Password];
      } else {
        sql = 'INSERT INTO Student (EnrollmentNo, StudentName, EmailAddress, Password) VALUES (?, ?, ?, ?)';
        values = [user.data.EnrollmentNo, user.data.StudentName, user.data.EmailAddress, user.data.Password];
      }

      db.query(sql, values, (err, result) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            console.log(`User ${user.data.EmailAddress} already exists`);
          } else {
            console.error('Error inserting user:', err);
          }
        } else {
          console.log(`✓ Created ${user.table}: ${user.data.EmailAddress}`);
        }
        
        if (index === testUsers.length - 1) {
          console.log('\n=== Test Users Created ===');
          console.log('Admin: admin@darshan.ac.in / admin123');
          console.log('Staff: john@darshan.ac.in / staff123'); 
          console.log('Student: alice@student.com / student123');
          console.log('Student Enrollment: STU001');
          console.log('\nYou can now login with these credentials!');
          db.end();
        }
      });
    });
  }, 1000);
});
