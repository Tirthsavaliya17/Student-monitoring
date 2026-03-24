import React, { useState } from 'react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import { IconTrendingUp, IconUsers, IconCalendar, IconCheckCircle, IconBook } from '../../components/Icons/Icons';
import adminStyles from './AdminDashboard.module.css';
import styles from './Reports.module.css';

// ─── Date formatter: strips time, returns DD-MM-YYYY or "—" ──────────────────
const fmtDate = (raw) => {
  if (!raw) return '—';
  const d = new Date(raw);
  if (isNaN(d.getTime())) return String(raw).split('T')[0]; // fallback to raw string without T part
  return d.toLocaleDateString('en-GB'); // DD/MM/YYYY
};

const Reports = () => {
  const [searchEnrollment, setSearchEnrollment] = useState('');
  const [reportData, setReportData] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

  const handleSearch = async (e) => {
    e.preventDefault();
    const enrollment = searchEnrollment.trim();
    if (!enrollment) return;

    setIsSearching(true);
    setReportData(null);
    setSessions([]);
    setError('');

    try {
      const studentRes = await fetch(`http://localhost:3000/api/students/${enrollment}`, { headers });
      const studentRaw = await studentRes.json();
      const student = Array.isArray(studentRaw) ? studentRaw[0] : studentRaw;

      if (!student || !student.StudentID) {
        setError(`No student found with enrollment number "${enrollment}".`);
        return;
      }

      const [mentorRes, sessionsRes] = await Promise.all([
        fetch(`http://localhost:3000/api/studentmentor/current/${enrollment}`, { headers }),
        fetch(`http://localhost:3000/api/studentmentoring/student/${student.StudentID}`, { headers })
      ]);

      const mentorData = mentorRes.ok ? await mentorRes.json() : null;
      const sessionData = sessionsRes.ok ? await sessionsRes.json() : [];

      setReportData({ student, mentor: mentorData });
      setSessions(Array.isArray(sessionData) ? sessionData : []);
    } catch (err) {
      console.error(err);
      setError('Something went wrong while generating the report.');
    } finally {
      setIsSearching(false);
    }
  };

  // ── Computed metrics ────────────────────────────────────────────────────────
  const totalSessions   = sessions.length;
  const attended        = sessions.filter(s => s.AttendanceStatus === 'Present').length;
  const missed          = sessions.filter(s => s.AttendanceStatus === 'Absent').length;
  const pending         = totalSessions - attended - missed;
  const attendRate      = totalSessions > 0 ? Math.round((attended / totalSessions) * 100) : null;
  const lastSession     = fmtDate(sessions.find(s => s.DateOfMentoring)?.DateOfMentoring);
  const latestStress    = sessions.find(s => s.StressLevel)?.StressLevel || null;

  const stressColor = { Low: 'var(--color-success)', Medium: 'var(--color-warning)', High: 'var(--color-danger)' };
  const stressBg    = { Low: 'rgba(34,197,94,0.12)', Medium: 'rgba(234,179,8,0.12)', High: 'rgba(239,68,68,0.12)' };
  const attendColor = (status) =>
    status === 'Present' ? 'var(--color-success)' : status === 'Absent' ? 'var(--color-danger)' : 'var(--color-warning)';
  const attendBg = (status) =>
    status === 'Present' ? 'rgba(34,197,94,0.12)' : status === 'Absent' ? 'rgba(239,68,68,0.12)' : 'rgba(234,179,8,0.12)';

  return (
    <>
      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className={adminStyles.header}>
        <div>
          <h1 className="animate-slide-up stagger-1">Student Reports</h1>
          <p className="animate-fade-in stagger-2 text-subtle">
            Generate comprehensive performance reports by enrollment number.
          </p>
        </div>
      </div>

      {/* ── Search Bar ──────────────────────────────────────────────────────── */}
      <div className="animate-fade-in stagger-3">
        <form onSubmit={handleSearch} className={styles.searchSection}>
          <div className={styles.searchInputWrapper}>
            <span className={styles.searchIcon}><IconUsers size={18} /></span>
            <input
              type="text"
              placeholder="Enter Enrollment No (e.g. EN123456)"
              className={styles.searchInput}
              value={searchEnrollment}
              onChange={(e) => setSearchEnrollment(e.target.value)}
              required
            />
          </div>
          <Button type="submit" variant="primary" disabled={isSearching}>
            {isSearching ? 'Generating...' : '⚡ Generate Report'}
          </Button>
        </form>
      </div>

      {/* ── Error ───────────────────────────────────────────────────────────── */}
      {error && (
        <div style={{
          padding: '0.875rem 1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem',
          background: 'rgba(239,68,68,0.1)', border: '1px solid var(--color-danger)',
          color: 'var(--color-danger)', fontWeight: 500
        }}>❌ {error}</div>
      )}

      {/* ── REPORT CARD ─────────────────────────────────────────────────────── */}
      {reportData && (
        <div className={`animate-fade-in stagger-4 ${styles.reportCard}`}>

          {/* ── Hero Header ─────────────────────────────────────────────────── */}
          <div style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0c4a6e 100%)',
            padding: '2.5rem 2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.75rem',
            borderBottom: '1px solid var(--color-border)'
          }}>
            {/* Avatar */}
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', fontWeight: 800, color: '#fff',
              boxShadow: '0 0 0 4px rgba(56,189,248,0.2)',
              flexShrink: 0
            }}>
              {reportData.student.StudentName?.charAt(0)}
            </div>

            {/* Student Info */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
                  {reportData.student.StudentName}
                </h2>
                {latestStress && (
                  <span style={{
                    padding: '0.2rem 0.75rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                    background: stressBg[latestStress], color: stressColor[latestStress],
                    border: `1px solid ${stressColor[latestStress]}`
                  }}>
                    {latestStress} Stress
                  </span>
                )}
              </div>
              <p style={{ color: '#94a3b8', margin: '0.35rem 0 0', fontSize: '0.9rem' }}>
                📋 {reportData.student.EnrollmentNo} &nbsp;•&nbsp; 📧 {reportData.student.EmailAddress} &nbsp;•&nbsp; 📞 {reportData.student.MobileNo || '—'}
              </p>
            </div>

            {/* Print button in header */}
            <button onClick={() => window.print()} style={{
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
              color: '#cbd5e1', padding: '0.5rem 1.1rem', borderRadius: 'var(--radius-md)',
              cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}>
              🖨 Export PDF
            </button>
          </div>

          {/* ── Metric Stat Bar ──────────────────────────────────────────────── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            borderBottom: '1px solid var(--color-border)'
          }}>
            {[
              { label: 'Total Sessions', value: totalSessions, color: 'var(--color-accent)' },
              { label: 'Attended', value: attended, color: 'var(--color-success)' },
              { label: 'Missed', value: missed, color: missed > 0 ? 'var(--color-danger)' : 'var(--color-success)' },
              { label: 'Pending', value: pending, color: 'var(--color-warning)' },
              { label: 'Attendance Rate', value: attendRate !== null ? `${attendRate}%` : '—', color: attendRate >= 75 ? 'var(--color-success)' : 'var(--color-danger)' },
              { label: 'Last Session', value: lastSession, color: 'var(--color-primary)', small: true },
            ].map((stat, i) => (
              <div key={i} style={{
                padding: '1.25rem 1.5rem',
                borderRight: '1px solid var(--color-border)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: stat.small ? '1rem' : '1.75rem', fontWeight: 700, color: stat.color, lineHeight: 1.1 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '0.3rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* ── Two-column info section ─────────────────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderBottom: '1px solid var(--color-border)' }}>

            {/* Mentor Card */}
            <div style={{ padding: '2rem', borderRight: '1px solid var(--color-border)' }}>
              <h3 style={{ margin: '0 0 1.25rem', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <IconUsers size={15} /> Assigned Mentor
              </h3>
              {reportData.mentor ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Mentor avatar row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: 46, height: 46, borderRadius: '50%', flexShrink: 0,
                      background: 'linear-gradient(135deg, #818cf8, #38bdf8)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.2rem', fontWeight: 700, color: '#fff'
                    }}>
                      {reportData.mentor.StaffName?.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '1rem' }}>
                        {reportData.mentor.StaffName}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        {reportData.mentor.EmailAddress}
                      </div>
                    </div>
                  </div>
                  <InfoRow label="Mobile" value={reportData.mentor.MobileNo || '—'} />
                  <InfoRow label="Assigned Since" value={fmtDate(reportData.mentor.FromDate)} />
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-subtle)', fontStyle: 'italic' }}>
                  No mentor currently assigned.
                </div>
              )}
            </div>

            {/* Student Details */}
            <div style={{ padding: '2rem' }}>
              <h3 style={{ margin: '0 0 1.25rem', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <IconBook size={15} /> Student Notes
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <InfoRow label="Description / Notes" value={reportData.student.Description || 'No notes recorded.'} />
              </div>
            </div>
          </div>

          {/* ── Sessions History Table ───────────────────────────────────────── */}
          <div style={{ padding: '2rem' }}>
            <h3 style={{ margin: '0 0 1.25rem', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <IconCheckCircle size={15} /> Session History
              <span style={{ marginLeft: 'auto', padding: '0.15rem 0.6rem', borderRadius: '999px', background: 'var(--color-background-alt)', color: 'var(--color-accent)', fontSize: '0.78rem', fontWeight: 700 }}>
                {totalSessions} sessions
              </span>
            </h3>

            {sessions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-subtle)', fontSize: '0.9rem' }}>
                📭 No mentoring sessions recorded for this student yet.
              </div>
            ) : (
              <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--color-background-alt)' }}>
                      {['#', 'Date', 'Scheduled', 'Agenda', 'Attendance', 'Stress', 'Mentor\'s Opinion'].map(h => (
                        <th key={h} style={{
                          padding: '0.85rem 1rem', textAlign: 'left',
                          color: 'var(--color-text-muted)', fontWeight: 700,
                          fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em',
                          borderBottom: '2px solid var(--color-border)', whiteSpace: 'nowrap'
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((s, i) => (
                      <tr key={s.StudentMentoringID}
                        style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--color-background-alt)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '0.85rem 1rem', color: 'var(--color-text-subtle)', fontWeight: 600 }}>{i + 1}</td>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                          <IconCalendar size={13} style={{ marginRight: 4, verticalAlign: 'middle', opacity: 0.6 }} />
                          {fmtDate(s.DateOfMentoring)}
                        </td>
                        <td style={{ padding: '0.85rem 1rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                          {fmtDate(s.ScheduledMeetingDate)}
                        </td>
                        <td style={{ padding: '0.85rem 1rem', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {s.MentoringMeetingAgenda || '—'}
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span style={{
                            padding: '0.25rem 0.7rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700,
                            background: attendBg(s.AttendanceStatus), color: attendColor(s.AttendanceStatus),
                            border: `1px solid ${attendColor(s.AttendanceStatus)}`, whiteSpace: 'nowrap'
                          }}>
                            {s.AttendanceStatus || 'Pending'}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          {s.StressLevel ? (
                            <span style={{
                              padding: '0.25rem 0.7rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700,
                              background: stressBg[s.StressLevel] || 'transparent',
                              color: stressColor[s.StressLevel] || 'var(--color-text-muted)',
                              border: `1px solid ${stressColor[s.StressLevel] || 'var(--color-border)'}`,
                              whiteSpace: 'nowrap'
                            }}>
                              {s.StressLevel}
                            </span>
                          ) : <span style={{ color: 'var(--color-text-subtle)' }}>—</span>}
                        </td>
                        <td style={{ padding: '0.85rem 1rem', color: 'var(--color-text-muted)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {s.StaffOpinion || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

// ── Small reusable info row ───────────────────────────────────────────────────
const InfoRow = ({ label, value }) => (
  <div>
    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>{label}</div>
    <div style={{ fontSize: '0.9rem', color: 'var(--color-primary)', fontWeight: 500 }}>{value}</div>
  </div>
);

export default Reports;
