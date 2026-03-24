import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/Card/Card';
import Table from '../../components/Table/Table';
import Button from '../../components/Button/Button';
import { IconUsers } from '../../components/Icons/Icons';
import styles from './AdminDashboard.module.css';

const MentorMenteesList = () => {
  const { id } = useParams(); // staffId
  const navigate = useNavigate();

  const [mentor, setMentor] = useState(null);
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  useEffect(() => {
    setLoading(true);

    // Fetch mentor details + their mentees in parallel
    Promise.all([
      fetch(`http://localhost:3000/api/staff/${id}`, { headers }).then(res => res.json()),
      fetch(`http://localhost:3000/api/staff/${id}/mentees`, { headers }).then(res => res.json())
    ])
      .then(([staffData, menteesData]) => {
        setMentor(staffData);
        setMentees(Array.isArray(menteesData) ? menteesData : []);
      })
      .catch(err => console.error('Failed to fetch mentor data:', err))
      .finally(() => setLoading(false));
  }, [id]);

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
  ];

  return (
    <>
      <div className={styles.header}>
        <div>
          <button
            onClick={() => navigate('/admin/mentors')}
            style={{
              background: 'none', border: 'none', color: 'var(--color-text-muted)',
              fontWeight: 600, cursor: 'pointer', marginBottom: '8px',
              display: 'flex', alignItems: 'center', gap: '4px'
            }}
          >
            &larr; Back to Mentors
          </button>
          <h1 className="animate-slide-up stagger-1">Assigned Mentees Log</h1>
          <p className="animate-fade-in stagger-2 text-subtle">
            {mentor
              ? <>Currently viewing mentees assigned to <strong>{mentor.StaffName}</strong> ({mentor.EmailAddress}).</>
              : 'Loading mentor info...'}
          </p>
        </div>
        <div className="animate-fade-in stagger-3">
          <Button variant="primary" onClick={() => navigate('/admin/assign-mentor')}>
            <IconUsers size={16} /> Assign New Mentee
          </Button>
        </div>
      </div>

      <div className="animate-fade-in stagger-4">
        <Card title={loading ? 'Loading...' : `Mentees of ${mentor?.StaffName || ''} (${mentees.length})`}>
          {loading ? (
            <p style={{ padding: '1rem', color: 'var(--color-text-subtle)' }}>Loading mentees...</p>
          ) : mentees.length === 0 ? (
            <p style={{ padding: '1rem', color: 'var(--color-text-subtle)' }}>No mentees assigned to this mentor yet.</p>
          ) : (
            <Table columns={columns} data={mentees} keyField="StudentID" />
          )}
        </Card>
      </div>
    </>
  );
};

export default MentorMenteesList;
