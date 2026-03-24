import React, { useEffect, useState } from 'react';
import Card from '../../components/Card/Card';
import { IconDashboard, IconUsers, IconCalendar, IconMessage, IconBook, IconCheckCircle } from '../../components/Icons/Icons';
import { Link, useOutletContext } from 'react-router-dom';
import styles from './StudentDashboard.module.css';

const StudentDashboard = () => {

  const [mentor, setMentor] = useState();
  const [mentoringHistory, setMentoringHistory] = useState([]);
  const userData = useOutletContext();

  useEffect(() => {
    if (userData?.user?.EnrollmentNo) {
      fetch(`http://localhost:3000/api/students/${userData.user.EnrollmentNo}/mentorDetail`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      }).then(res => res.json()).then(detail => {
        if (detail && detail.length > 0) {
          setMentor(detail[0]);
        }
      }).catch(err => console.log('Error fetching mentor:', err));
    }
  }, [userData]);

  useEffect(() => {
    if (userData?.user?.EnrollmentNo) {
      fetch(`http://localhost:3000/api/students/${userData.user.EnrollmentNo}/mentoring-history`,{
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
      }).then(res => res.json()).then(detail => {
        if (Array.isArray(detail)) {
          setMentoringHistory(detail);
        }
      }).catch(err => console.log('Error fetching history:', err));
    }
  }, [userData]);

  const pendingDocs = [
    { id: 101, name: 'Final SRS Document.pdf', type: 'Proposal', reqDate: '15 Oct 2026' }
  ];

  return (
    <>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className="animate-slide-up stagger-1">Student Portal</h1>
          <p className="animate-fade-in stagger-2 text-subtle">View your mentoring assignments and track session history.</p>
        </div>
        <Link to="/student/mentor" className={`${styles.primaryBtn} animate-fade-in stagger-3`}>
          <IconMessage size={16} /> Contact Mentor
        </Link>
      </div>

      <div className={`${styles.dashboardGrid} animate-fade-in stagger-4`}>
        {/* Left Column - Mentor Status & Docs */}
        <div className={styles.mainContent}>
          <Card title="Current Mentorship Assignment" delay={0.1}>
            {mentor ? (
              <div className={styles.mentorBox}>
                <div className={styles.mentorAvatar}>
                  <IconUsers size={32} />
                </div>
                <div className={styles.mentorDetails}>
                  <h3>{mentor.StaffName}</h3>
                  <p>{mentor.FacEmail} • {mentor.MobileNo}</p>
                  <div className={styles.mentorStats}>
                    <span className={styles.statPill}><IconCalendar size={14} /> Assigned: {mentor.AssignedDate}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.emptyState}>
                <IconUsers size={32} />
                <h3>No Mentor Assigned</h3>
                <p>You haven't been assigned a mentor yet. Please check back later or contact administration.</p>
              </div>
            )}
          </Card>

          <Card title="Document Requests" delay={0.2} className={styles.docCard}>
            {pendingDocs.length > 0 ? (
              <div className={styles.uploadArea}>
                <IconBook size={24} className={styles.uploadIcon} />
                <div className={styles.uploadText}>
                  <h4>{pendingDocs[0].name} ({pendingDocs[0].type})</h4>
                  <p>Requested on {pendingDocs[0].reqDate}</p>
                </div>
                <button className={styles.outlineBtn}>Upload File</button>
              </div>
            ) : (
              <p className={styles.emptyText}>No pending document requirements.</p>
            )}
          </Card>
        </div>

        {/* Right Column - Session History */}
        <div className={styles.sideContent}>
          <Card title="Mentoring Session History" delay={0.3}>
            <div className={styles.sessionList}>
              {mentoringHistory.length > 0 ? (
                mentoringHistory.slice(0,3).map(session => (
                  <div key={session.StudentMentoringID} className={styles.sessionItem}>
                    <div className={styles.sessionDate}>
                      <IconCalendar size={16} />
                      <span>{session.DateOfMentoring}</span>
                    </div>
                    <div className={styles.sessionInfo}>
                      <h4>{session.MentoringMeetingAgenda}</h4>
                      <span className={styles.statusBadge}>{session.AttendanceStatus==='Present' ? "Attended" : "Not Attended"}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <IconCalendar size={24} />
                  <h4>No Sessions Yet</h4>
                  <p>Your mentoring sessions will appear here once scheduled.</p>
                </div>
              )}
            </div>
            {mentoringHistory.length > 0 && (
              <Link to="/student/sessions" className={styles.secondaryBtn} style={{ display: 'block', textDecoration: 'none' }}>View Entire History</Link>
            )}
          </Card>
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;
