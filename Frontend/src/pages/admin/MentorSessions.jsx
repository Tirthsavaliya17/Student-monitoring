import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import { IconDashboard, IconCalendar } from '../../components/Icons/Icons';
import adminStyles from './AdminDashboard.module.css';
import styles from './MentorSessions.module.css';

const MentorSessions = () => {
  const { staffId } = useParams();
  const navigate = useNavigate();
  const [mentorData, setMentorData] = useState(null);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    // In a real app, you would fetch mentor details and their sessions from the backend using staffId
    console.log(`Fetching sessions for staff: ${staffId}`);
    
    // Mock Data
    setMentorData({
      id: staffId,
      name: staffId === 'STF100' ? 'Dr. Alan Turing' : 'Prof. Sample Staff',
      department: 'Computer Science'
    });

    setSessions([
      { id: 'SM-2026-001', student: 'Alice Smith', enrollment: 'DU23CE101', date: 'Oct 20, 2026', notes: 'Discussed project scope and timeline.' },
      { id: 'SM-2026-015', student: 'Bob Johnson', enrollment: 'DU23CS205', date: 'Oct 25, 2026', notes: 'Reviewed mid-term performance and suggested resources.' },
      { id: 'SM-2026-042', student: 'Charlie Brown', enrollment: 'DU23IT304', date: 'Nov 02, 2026', notes: 'Career guidance and resume feedback.' },
      { id: 'SM-2026-056', student: 'Diana Prince', enrollment: 'DU23EE405', date: 'Nov 10, 2026', notes: 'Addressed concerns about final year project selection.' },
      { id: 'SM-2026-078', student: 'Evan Wright', enrollment: 'DU23ME502', date: 'Nov 15, 2026', notes: 'Feedback on recent assignments and study habits.' },
      { id: 'SM-2026-091', student: 'Fiona Gallagher', enrollment: 'DU23CH608', date: 'Nov 22, 2026', notes: 'General wellness check and academic planning.' },
    ]);
  }, [staffId]);

  return (
    <>
      <div className={adminStyles.header}>
        <div>
          <h1 className="animate-slide-up stagger-1">Mentor Session Log</h1>
          <p className="animate-fade-in stagger-2 text-subtle">Reviewing all mentoring sessions conducted by the selected staff member.</p>
        </div>
        <div className="animate-fade-in stagger-3">
          <Button variant="secondary" onClick={() => navigate('/admin/sessions')}><IconDashboard size={16} /> Back to Sessions</Button>
        </div>
      </div>

      <div className="animate-fade-in stagger-4">
        {mentorData && (
          <div className={styles.mentorInfo}>
            <div className={styles.mentorAvatar}>
              {mentorData.name.charAt(0)}
            </div>
            <div className={styles.mentorDetails}>
              <h2>{mentorData.name}</h2>
              <p>{mentorData.id} • {mentorData.department}</p>
            </div>
          </div>
        )}

        <div className={styles.sessionsGrid}>
          {sessions.map((session, index) => (
            <div 
              key={session.id} 
              className={styles.sessionCard}
              style={{ animationDelay: `${index * 0.1 + 0.5}s` }}
            >
              <div className={styles.sessionHeader}>
                <span className={styles.sessionId}>{session.id}</span>
                <span className={styles.sessionDate}>
                  <IconCalendar size={14} /> {session.date}
                </span>
              </div>
              
              <div className={styles.sessionBody}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Mentee Name</span>
                  <span className={styles.detailValue}>{session.student}</span>
                </div>
                
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Enrollment No.</span>
                  <span className={styles.detailValue}>{session.enrollment}</span>
                </div>

                <div className={styles.notesBox}>
                  "{session.notes}"
                </div>
              </div>
            </div>
          ))}
        </div>

        {sessions.length === 0 && (
          <Card>
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-muted)' }}>
              No sessions found for this staff member.
            </div>
          </Card>
        )}
      </div>
    </>
  );
};

export default MentorSessions;
