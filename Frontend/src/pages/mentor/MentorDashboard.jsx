import React, { useState, useEffect } from 'react';
import Card from '../../components/Card/Card';
import Table from '../../components/Table/Table';
import { IconUsers, IconCalendar, IconMessage, IconBook, IconCheckCircle } from '../../components/Icons/Icons';
import { Link, useOutletContext } from 'react-router-dom';
import styles from './MentorDashboard.module.css';

const MentorDashboard = () => {

  const [mentees, setMentees] = useState({});
  const [pending, setPending] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const userData = useOutletContext();

  useEffect(() => {
    fetch(`http://localhost:3000/api/studentmentoring/count/mentor/${userData?.user?.StaffID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    }).then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch mentees");
      }
      return res.json();
    }).then((data) => {
      setMentees(data[0]);
    });
  }, [mentees]);

  
useEffect(() => {
  const staffId = userData?.user?.StaffID;
  
  if (!staffId) return;

  fetch(`http://localhost:3000/api/studentmentoring/admin/mentoring/pending/${staffId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
  })
  .then((res) => {
    if (!res.ok) {
      throw new Error(`Failed to fetch Pending Sessions. Status: ${res.status}`);
    }
    return res.json();
  })
  .then((data) => {
    console.log("Pending API Data:", data);
    setPending(data || []);
  })
  .catch(err => console.error("Pending fetch error:", err));

}, [userData?.user?.StaffID]);

  useEffect(() => {
    fetch(`http://localhost:3000/api/staff/${userData?.user?.StaffID}/upcoming-mentoring`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    }).then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch Upcoming Sessions");
      }
      return res.json();
    }).then((data) => {
      setUpcoming(data);
    });
  }, [upcoming]);


  const pendingSessionColumns = [
    { header: 'Student Mentoring Id', field: 'StudentMentoringID' },
    { header: 'Student Enrollment Number', field: 'EnrollmentNo' },
    { header: 'Student Name', field: 'StudentName' },
    { header: 'Scheduled Date', field: 'ScheduledMeetingDate' },
    {
      header: 'Status',
      render: () => (
        <span className={`${styles.stressBadge} ${styles.pending}`}>
          Pending
        </span>
      )
    },
  ];

  return (
    <>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className="animate-slide-up stagger-1">Staff Mentoring Dashboard</h1>
          <p className="animate-fade-in stagger-2 text-subtle">Manage your mentees and track their progress.</p>
        </div>
      </div>

      <div className={`${styles.dashboardGrid} animate-fade-in stagger-4`}>
        {/* Primary Columns: Mentee List */}
        <div className={styles.mainContent}>
          <div className={styles.metricsRow}>
            <Card className={`${styles.metricCard} stagger-3`} delay={0.1}>
              <div className={styles.metricIconWrap}><IconUsers size={24} style={{ color: 'var(--color-primary)' }} /></div>
              <div className={styles.metricData}>
                <p className={styles.metricLabel}>Total Mentees Count</p>
                <h3 className={styles.metricValue}>{mentees.totalStudents}</h3>
              </div>
            </Card>
            <Card className={`${styles.metricCard} stagger-3`} delay={0.2}>
              <div className={styles.metricIconWrap}><IconCheckCircle size={24} style={{ color: 'var(--color-success)' }} /></div>
              <div className={styles.metricData}>
                <p className={styles.metricLabel}>Attendance Session / Total Session</p>
                <h3 className={styles.metricValue}> {mentees.AttendedMeetings} / {mentees.totalMeetings}</h3>
              </div>
            </Card>
          </div>

          <Card title="Pending Session" delay={0.3}>
            <Table
              columns={pendingSessionColumns}
              data={pending || []}
              keyField="StudentMentoringID"
            />
          </Card>
        </div>

        {/* Side Column: Session Agenda */}
        <div className={styles.sideContent}>
          <Card title="Upcoming Mentoring Agenda" delay={0.2}>
            <div className={styles.timeline}>
              {upcoming.map((session) => (
                <div key={session.StudentMentoringID} className={styles.timelineItem}>
                  <div className={styles.timelineDot}></div>
                  <div className={styles.timelineContent}>
                    <span className={styles.timeTag}>{session.ScheduledMeetingDate}</span>
                    <h4>{session.MentoringMeetingAgenda}</h4>
                    <p>Mentee: <strong>{session.StudentName}</strong></p>
                    <div className={styles.timelineActions}>
                      <Link to="/mentor/attend" className={styles.outlineBtn}><IconCheckCircle size={14} /> Attend</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default MentorDashboard;
