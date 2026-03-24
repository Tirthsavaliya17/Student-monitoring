import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card/Card';
import Table from '../../components/Table/Table';
import Button from '../../components/Button/Button';
import { IconUsers } from '../../components/Icons/Icons';
import styles from './AdminDashboard.module.css';

const ManageMentors = () => {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // Fetch all staff + mentee counts and merge them
  const fetchMentors = () => {
    setLoading(true);

    Promise.all([
      fetch('http://localhost:3000/api/staff', { headers }).then(res => res.json()),
      fetch('http://localhost:3000/api/studentmentoring/reports/mentor-wise-mentees', { headers }).then(res => res.json())
    ])
      .then(([staffList, menteeCounts]) => {
        // Build a quick lookup: StaffID → TotalMentees
        const countMap = {};
        (menteeCounts || []).forEach(m => {
          countMap[m.StaffID] = m.TotalMentees || 0;
        });

        const merged = (staffList || []).map(staff => ({
          ...staff,
          TotalMentees: countMap[staff.StaffID] ?? 0
        }));

        setMentors(merged);
      })
      .catch(err => console.error('Failed to fetch mentors:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  // Delete a mentor with confirmation
  const handleDelete = (staffId, staffName) => {
    if (!window.confirm(`Are you sure you want to remove "${staffName}"? This action cannot be undone.`)) return;

    fetch(`http://localhost:3000/api/staff/${staffId}`, {
      method: 'DELETE',
      headers
    })
      .then(res => {
        if (!res.ok) throw new Error('Delete failed');
        return res.json();
      })
      .then(() => {
        fetchMentors(); // Refresh list after delete
      })
      .catch(err => {
        console.error('Delete error:', err);
        alert('Failed to remove mentor. They may have active mentee assignments.');
      });
  };

  const columns = [
    {
      header: 'Mentor Name',
      render: (row) => (
        <div className={styles.userCell}>
          <div className={styles.userAvatar}>{row.StaffName?.charAt(0)}</div>
          <span className={styles.userName}>{row.StaffName}</span>
        </div>
      )
    },
    { header: 'Email Address', field: 'EmailAddress' },
    { header: 'Mobile No', field: 'MobileNo' },
    {
      header: 'Assigned Mentees',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--color-primary)' }}>
            {row.TotalMentees}
          </span>
          <Button
            variant="secondary"
            onClick={() => navigate(`/admin/mentors/${row.StaffID}/mentees`)}
            style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
          >
            View List
          </Button>
        </div>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button
            variant="secondary"
            className={styles.outlineBtn}
            onClick={() => navigate(`/admin/mentors/edit/${row.StaffID}`)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            className={styles.outlineBtn}
            onClick={() => handleDelete(row.StaffID, row.StaffName)}
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
          <h1 className="animate-slide-up stagger-1">Manage Mentors / Staff</h1>
          <p className="animate-fade-in stagger-2 text-subtle">Add, remove, or modify staff mentor accounts.</p>
        </div>
        <div className="animate-fade-in stagger-3">
          <Button variant="primary" onClick={() => navigate('/admin/mentors/add')}>
            <IconUsers size={16} /> Add New Mentor
          </Button>
        </div>
      </div>

      <div className="animate-fade-in stagger-4">
        <Card title={`Active Mentors List ${loading ? '' : `(${mentors.length})`}`}>
          {loading ? (
            <p style={{ padding: '1rem', color: 'var(--color-text-subtle)' }}>Loading mentors...</p>
          ) : mentors.length === 0 ? (
            <p style={{ padding: '1rem', color: 'var(--color-text-subtle)' }}>No mentors found.</p>
          ) : (
            <Table columns={columns} data={mentors} keyField="StaffID" />
          )}
        </Card>
      </div>
    </>
  );
};

export default ManageMentors;
