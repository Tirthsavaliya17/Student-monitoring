import React, { useState, useEffect } from 'react';
import Card from '../../components/Card/Card';
import Table from '../../components/Table/Table';
import Button from '../../components/Button/Button';
import { IconUsers } from '../../components/Icons/Icons';
import adminStyles from './AdminDashboard.module.css';
import searchStyles from './MentorSessions.module.css';

// Strip time — returns DD/MM/YYYY or "—"
const fmtDate = (raw) => {
  if (!raw) return '—';
  const d = new Date(raw);
  return isNaN(d.getTime()) ? String(raw).split('T')[0] : d.toLocaleDateString('en-GB');
};

const Sessions = () => {
  const [allSessions, setAllSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchStaffId, setSearchStaffId] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // Fetch global mentoring history on mount
  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:3000/api/studentmentoring/reports/mentoring-history', { headers })
      .then(res => res.json())
      .then(data => setAllSessions(Array.isArray(data) ? data : []))
      .catch(err => console.error('Failed to fetch sessions:', err))
      .finally(() => setLoading(false));
  }, []);

  // Apply search filter by StaffID
  const handleSearch = (e) => {
    e.preventDefault();
    setAppliedSearch(searchStaffId.trim());
  };

  const handleClear = () => {
    setSearchStaffId('');
    setAppliedSearch('');
  };

  // Filter sessions: if a staffId is searched, show only that mentor's sessions
  const displayedSessions = appliedSearch
    ? allSessions.filter(s => String(s.StaffID).toLowerCase() === appliedSearch.toLowerCase())
    : allSessions;

  const columns = [
    { header: 'Session ID', field: 'StudentMentoringID' },
    {
      header: 'Student',
      render: (row) => (
        <div className={adminStyles.userCell}>
          <div className={adminStyles.userAvatar}>{row.StudentName?.charAt(0)}</div>
          <span className={adminStyles.userName}>{row.StudentName}</span>
        </div>
      )
    },
    { header: 'Enrollment No', field: 'EnrollmentNo' },
    { header: 'Mentor (Staff)', field: 'StaffName' },
    { header: 'Staff ID', field: 'StaffID' },
    { header: 'Date of Mentoring', render: (row) => fmtDate(row.DateOfMentoring) },
    { header: 'Scheduled Date', render: (row) => fmtDate(row.ScheduledMeetingDate) },
    { header: 'Agenda', field: 'MentoringMeetingAgenda' },
    {
      header: 'Attendance',
      render: (row) => (
        <span style={{
          padding: '0.2rem 0.65rem',
          borderRadius: '999px',
          fontSize: '0.78rem',
          fontWeight: 600,
          background: row.AttendanceStatus === 'Present'
            ? 'rgba(34,197,94,0.15)'
            : row.AttendanceStatus === 'Absent'
              ? 'rgba(239,68,68,0.15)'
              : 'rgba(234,179,8,0.15)',
          color: row.AttendanceStatus === 'Present'
            ? 'var(--color-success)'
            : row.AttendanceStatus === 'Absent'
              ? 'var(--color-danger)'
              : 'var(--color-warning)'
        }}>
          {row.AttendanceStatus || 'Pending'}
        </span>
      )
    },
    { header: 'Stress Level', field: 'StressLevel' },
  ];

  return (
    <>
      <div className={adminStyles.header}>
        <div>
          <h1 className="animate-slide-up stagger-1">All Global Sessions</h1>
          <p className="animate-fade-in stagger-2 text-subtle">
            Monitor every mentoring session across the institution.
            {!loading && (
              <span style={{ marginLeft: '0.5rem', color: 'var(--color-accent)', fontWeight: 600 }}>
                ({displayedSessions.length}{appliedSearch ? ` of ${allSessions.length}` : ''} sessions)
              </span>
            )}
          </p>
        </div>

        {/* Search by Staff ID */}
        <div className="animate-fade-in stagger-3">
          <form onSubmit={handleSearch} className={searchStyles.searchContainer}>
            <IconUsers size={16} />
            <input
              type="text"
              placeholder="Search by Staff ID (e.g. STF100)"
              className={searchStyles.searchInput}
              value={searchStaffId}
              onChange={(e) => setSearchStaffId(e.target.value)}
            />
            <Button type="submit" variant="primary" className={searchStyles.searchBtn}>Search</Button>
            {appliedSearch && (
              <Button type="button" variant="secondary" onClick={handleClear} style={{ marginLeft: '0.5rem' }}>
                Clear
              </Button>
            )}
          </form>
        </div>
      </div>

      {/* Active filter badge */}
      {appliedSearch && (
        <div style={{
          marginBottom: '1rem',
          padding: '0.5rem 1rem',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(56,189,248,0.1)',
          border: '1px solid var(--color-accent)',
          color: 'var(--color-accent)',
          fontWeight: 500,
          fontSize: '0.875rem',
          display: 'inline-block'
        }}>
          📋 Showing sessions for Staff ID: <strong>{appliedSearch}</strong>
          {displayedSessions.length === 0 && ' — No sessions found for this Staff ID'}
        </div>
      )}

      <div className="animate-fade-in stagger-4">
        <Card title="Global Session Audit Log">
          {loading ? (
            <p style={{ padding: '1rem', color: 'var(--color-text-subtle)' }}>Loading sessions...</p>
          ) : displayedSessions.length === 0 ? (
            <p style={{ padding: '1rem', color: 'var(--color-text-subtle)' }}>
              {appliedSearch ? `No sessions found for Staff ID "${appliedSearch}".` : 'No sessions recorded yet.'}
            </p>
          ) : (
            <Table columns={columns} data={displayedSessions} keyField="StudentMentoringID" />
          )}
        </Card>
      </div>
    </>
  );
};

export default Sessions;
