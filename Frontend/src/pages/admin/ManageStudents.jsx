import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card/Card';
import Table from '../../components/Table/Table';
import Button from '../../components/Button/Button';
import { IconUsers } from '../../components/Icons/Icons';
import styles from './AdminDashboard.module.css';

const ManageStudents = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  const fetchStudents = () => {
    setLoading(true);
    fetch('http://localhost:3000/api/students', { headers })
      .then(res => res.json())
      .then(data => setStudents(Array.isArray(data) ? data : []))
      .catch(err => console.error('Failed to fetch students:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = (enrollmentNo, studentName) => {
    if (!window.confirm(`Are you sure you want to remove "${studentName}"? This action cannot be undone.`)) return;

    fetch(`http://localhost:3000/api/students/${enrollmentNo}`, {
      method: 'DELETE',
      headers
    })
      .then(res => {
        if (!res.ok) throw new Error('Delete failed');
        return res.json();
      })
      .then(() => fetchStudents())
      .catch(err => {
        console.error('Delete error:', err);
        alert('Failed to remove student. They may have active mentoring records.');
      });
  };

  const columns = [
    {
      header: 'Student Name',
      render: (row) => (
        <div className={styles.userCell}>
          <div className={styles.userAvatar}>{row.StudentName?.charAt(0)}</div>
          <span className={styles.userName}>{row.StudentName}</span>
        </div>
      )
    },
    { header: 'Enrollment No', field: 'EnrollmentNo' },
    { header: 'Email Address', field: 'EmailAddress' },
    { header: 'Mobile No', field: 'MobileNo' },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button
            variant="secondary"
            className={styles.outlineBtn}
            onClick={() => navigate(`/admin/students/edit/${row.EnrollmentNo}`)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            className={styles.outlineBtn}
            onClick={() => handleDelete(row.EnrollmentNo, row.StudentName)}
          >
            Remove
          </Button>
        </div>
      )
    }
  ];

  return (
    <>
      <div className={styles.header}>
        <div>
          <h1 className="animate-slide-up stagger-1">Manage Students</h1>
          <p className="animate-fade-in stagger-2 text-subtle">Review student records and assign mentors.</p>
        </div>
        <div className="animate-fade-in stagger-3">
          <Button variant="primary" onClick={() => navigate('/admin/students/enroll')}>
            <IconUsers size={16} /> Enroll New Student
          </Button>
        </div>
      </div>

      <div className="animate-fade-in stagger-4">
        <Card title={`Registered Students Roster ${loading ? '' : `(${students.length})`}`}>
          {loading ? (
            <p style={{ padding: '1rem', color: 'var(--color-text-subtle)' }}>Loading students...</p>
          ) : students.length === 0 ? (
            <p style={{ padding: '1rem', color: 'var(--color-text-subtle)' }}>No students found.</p>
          ) : (
            <Table columns={columns} data={students} keyField="StudentID" />
          )}
        </Card>
      </div>
    </>
  );
};

export default ManageStudents;
