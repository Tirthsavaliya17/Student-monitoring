import React, { useState, useEffect } from 'react';
import Card from '../../components/Card/Card';
import Table from '../../components/Table/Table';
import { IconUsers, IconCalendar, IconCheckCircle } from '../../components/Icons/Icons';
import styles from './AdminDashboard.module.css';

// Strip time — returns DD/MM/YYYY or "—"
const fmtDate = (raw) => {
  if (!raw) return '—';
  const d = new Date(raw);
  return isNaN(d.getTime()) ? String(raw).split('T')[0] : d.toLocaleDateString('en-GB');
};

const AdminDashboard = () => {
  const [totalMentors, setTotalMentors]       = useState(null);
  const [totalStudents, setTotalStudents]     = useState(null);
  const [pendingSessions, setPendingSessions] = useState([]);
  const [loading, setLoading]                 = useState(true);

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  };

  useEffect(() => {
    setLoading(true);

    Promise.all([ 
      // 1. Total mentors count
      fetch('http://localhost:3000/api/staff', { headers })
        .then(r => r.json()).then(d => setTotalMentors(Array.isArray(d) ? d.length : 0)),

      // 2. Total students count
      fetch('http://localhost:3000/api/students', { headers })
        .then(r => r.json()).then(d => setTotalStudents(Array.isArray(d) ? d.length : 0)),

      // 3. Pending sessions list (for the table)
      fetch('http://localhost:3000/api/studentmentoring/admin/mentoring/pending', { headers })
        .then(r => r.json()).then(d => setPendingSessions(Array.isArray(d) ? d : [])),
    ])
      .catch(err => console.error('Dashboard fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  const sessionColumns = [
    {
      header: 'Student',
      render: (row) => (
        <div className={styles.userCell}>
          <div className={styles.userAvatar}>{row.StudentName ? row.StudentName.charAt(0) : '?'}</div>
          <span className={styles.userName}>{row.StudentName}</span>
        </div>
      )
    },
    { header: 'Enrollment No', field: 'EnrollmentNo' },
    { header: 'Assigned Mentor', field: 'StaffName' },
    { header: 'Scheduled Date', render: (row) => fmtDate(row.ScheduledMeetingDate) },
    {
      header: 'Status',
      render: (row) => {
        const status = row.MentoringStatus || 'Pending';
        const color  = status === 'Pending' ? 'var(--color-warning)' : 'var(--color-success)';
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: 8, height: 8, backgroundColor: color, borderRadius: '50%', boxShadow: `0 0 4px ${color}` }} />
            <span style={{ color: 'var(--color-text-main)', fontWeight: 500, fontSize: '0.875rem' }}>{status}</span>
          </div>
        );
      }
    },
  ];

  // Loading placeholder for metric cards
  const MetricVal = ({ val }) => (
    <h3 className={styles.metricValue}>
      {val === null ? <span style={{ opacity: 0.4, fontSize: '1.2rem' }}>—</span> : val}
    </h3>
  );

  return (
    <>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className="animate-slide-up stagger-1">Administrator Control Panel</h1>
          <p className="animate-fade-in stagger-2 text-subtle">High-level system overview and management assignments.</p>
        </div>
      </div>

      {/* ── 3 Metric Cards ──────────────────────────────────────────────────── */}
      <div className={`${styles.metricsRow}`} style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>

        {/* Total Mentors */}
        <Card className={`${styles.metricCard} stagger-3`} delay={0.1}>
          <div className={styles.metricIconWrap}>
            <IconUsers size={24} style={{ color: 'var(--color-accent)' }} />
          </div>
          <div className={styles.metricData}>
            <p className={styles.metricLabel}>Total Mentors</p>
            <MetricVal val={totalMentors} />
          </div>
        </Card>

        {/* Total Students */}
        <Card className={`${styles.metricCard} stagger-4`} delay={0.15}>
          <div className={styles.metricIconWrap}>
            <IconUsers size={24} style={{ color: '#a78bfa' }} />
          </div>
          <div className={styles.metricData}>
            <p className={styles.metricLabel}>Total Students</p>
            <MetricVal val={totalStudents} />
          </div>
        </Card>

        {/* Pending Sessions */}
        <Card className={`${styles.metricCard} stagger-5`} delay={0.2}>
          <div className={styles.metricIconWrap}>
            <IconCalendar size={24} style={{ color: 'var(--color-warning)' }} />
          </div>
          <div className={styles.metricData}>
            <p className={styles.metricLabel}>Pending Sessions</p>
            <MetricVal val={pendingSessions.length > 0 || !loading ? pendingSessions.length : null} />
          </div>
        </Card>
      </div>

      {/* ── Pending Sessions Table ───────────────────────────────────────────── */}
      <div className="animate-fade-in stagger-5">
        <Card
          title={`Pending Sessions ${!loading ? `(${pendingSessions.length})` : ''}`}
          delay={0.3}
        >
          {loading ? (
            <p style={{ padding: '1rem', color: 'var(--color-text-subtle)' }}>Loading sessions...</p>
          ) : pendingSessions.length === 0 ? (
            <p style={{ padding: '1rem', color: 'var(--color-text-subtle)' }}>
              <IconCheckCircle size={16} style={{ marginRight: 6, verticalAlign: 'middle', color: 'var(--color-success)' }} />
              No pending sessions — all caught up!
            </p>
          ) : (
            <Table columns={sessionColumns} data={pendingSessions} keyField="StudentMentoringID" />
          )}
        </Card>
      </div>
    </>
  );
};

export default AdminDashboard;