import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Card from '../../components/Card/Card';
import Table from '../../components/Table/Table';
import Button from '../../components/Button/Button';
import { IconUsers, IconCalendar, IconBook, IconSearch } from '../../components/Icons/Icons';
import styles from './MentorDashboard.module.css';
import { useOutletContext } from 'react-router-dom';

const SessionHistory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSession, setSelectedSession] = useState(null);

  const [history, setHistory] = useState([])
  const userData = useOutletContext();

  useEffect(() => {
    fetch(`http://localhost:3000/api/studentmentoring/mentor/history/${userData?.user?.StaffID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setHistory(data);
        } else {
          setHistory(data.data || []);
        }
      });

  }, [userData]);

  const columns = [
    { header: 'Enrollment No', field: 'EnrollmentNo' },
    { header: 'Mentee', field: 'StudentName' },
    { header: 'Date', field: 'DateOfMentoring' },
    { header: 'Subject', field: 'MentoringMeetingAgenda' },
    { header: 'Logged Notes', field: 'Description' },
    {
      header: 'Report',
      render: (row) => (
        <Button
          variant="secondary"
          className={styles.outlineBtn}
          onClick={() => setSelectedSession(row)}
        >
          View Details
        </Button>
      )
    }
  ];

  const filteredSessions = Array.isArray(history)
    ? history.filter(session =>
      session.EnrollmentNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.StudentName?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : [];

  return (
    <>
      <div className={styles.header}>
        <div>
          <h1 className="animate-slide-up stagger-1">Session History</h1>
          <p className="animate-fade-in stagger-2 text-subtle">Review past sessions and generated documentation.</p>
        </div>
        <div className="animate-fade-in stagger-3">
          <div className={styles.searchContainer}>
            <IconSearch size={18} className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search by Name Or Enrollment No..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="animate-fade-in stagger-4">
        <Card title="Student Session History">
          <Table columns={columns} data={filteredSessions} keyField="StudentMentoringID" />
        </Card>
      </div>

      {selectedSession && createPortal(
        <div className={styles.modalOverlay} onClick={() => setSelectedSession(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Session Details</h2>
              <button className={styles.closeBtn} onClick={() => setSelectedSession(null)}>&times;</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalField}>
                <span className={styles.modalFieldLabel}>Student Name</span>
                <span className={styles.modalFieldValue}>{selectedSession.StudentName} ({selectedSession.EnrollmentNo})</span>
              </div>
              <div className={styles.modalField}>
                <span className={styles.modalFieldLabel}>Student Mentoring Id</span>
                <span className={styles.modalFieldValue}>{selectedSession.StudentMentoringID}</span>
              </div>
              <div className={styles.modalField}>
                <span className={styles.modalFieldLabel}>Date of Mentoring</span>
                <span className={styles.modalFieldValue}>{selectedSession.DateOfMentoring}</span>
              </div>
              <div className={styles.modalField}>
                <span className={styles.modalFieldLabel}>Schedule Meeting Date</span>
                <span className={styles.modalFieldValue}>{selectedSession.ScheduledMeetingDate}</span>
              </div>
              <div className={styles.modalField}>
                <span className={styles.modalFieldLabel}>Next Mentoring Date</span>
                <span className={styles.modalFieldValue}>{selectedSession.NextMentoringDate}</span>
              </div>
              <div className={`${styles.modalField} ${styles.modalFieldFull}`}>
                <span className={styles.modalFieldLabel}>Mentoring Meeting Agenda</span>
                <span className={styles.modalFieldValue}>{selectedSession.MentoringMeetingAgenda}</span>
              </div>
              <div className={styles.modalField}>
                <span className={styles.modalFieldLabel}>Attendance Status</span>
                <span className={styles.modalFieldValue}>{selectedSession.AttendanceStatus}</span>
              </div>
              <div className={`${styles.modalField} ${styles.modalFieldFull}`}>
                <span className={styles.modalFieldLabel}>Absent Remark</span>
                <span className={styles.modalFieldValue}>{selectedSession.AbsentRemarks}</span>
              </div>
              <div className={styles.modalField}>
                <span className={styles.modalFieldLabel}>Is Parent Present</span>
                <span className={styles.modalFieldValue}>{selectedSession.IsParentPresent}</span>
              </div>
              <div className={`${styles.modalField} ${styles.modalFieldFull}`}>
                <span className={styles.modalFieldLabel}>Student's Opinion</span>
                <span className={styles.modalFieldValue}>{selectedSession.StudentsOpinion}</span>
              </div>
              <div className={styles.modalField}>
                <span className={styles.modalFieldLabel}>Stress Level</span>
                <span className={styles.modalFieldValue}>{selectedSession.StressLevel}</span>
              </div>
              <div className={styles.modalField}>
                <span className={styles.modalFieldLabel}>Learner Type</span>
                <span className={styles.modalFieldValue}>{selectedSession.LearnerType}</span>
              </div>
              <div className={`${styles.modalField} ${styles.modalFieldFull}`}>
                <span className={styles.modalFieldLabel}>Description</span>
                <span className={styles.modalFieldValue}>{selectedSession.Description}</span>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default SessionHistory;
