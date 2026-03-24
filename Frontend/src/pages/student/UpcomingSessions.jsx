import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import styles from './StudentDashboard.module.css';
import tableStyles from '../../components/Table/Table.module.css';
import { useOutletContext } from 'react-router-dom';

const UpcomingSessions = () => {
  const [selectedSession, setSelectedSession] = useState(null);
  const [upcomingSesData , setUpcomingSesData] = useState([]);
  const [mentoringHistory , setMentoringHistory] = useState([]);
  const userData = useOutletContext();

  useEffect(()=>{
    fetch(`http://localhost:3000/api/students/${userData?.user?.EnrollmentNo}/upcoming-mentoring`,{
      method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
    }).then(res => res.json()).then(detail => setUpcomingSesData(detail));
  },[upcomingSesData]);

  useEffect(() => {
      fetch(`http://localhost:3000/api/students/${userData?.user?.EnrollmentNo}/mentoring-history`,{
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
      }).then(res => res.json()).then(detail => setMentoringHistory(detail));
    },[mentoringHistory]);

  return (
    <>
      <div className={styles.header}>
        <div>
          <h1 className="animate-slide-up stagger-1">Session Records</h1>
          <p className="animate-fade-in stagger-2 text-subtle">View upcoming calendar events and review past mentoring records.</p>
        </div>
      </div>

      <div className={`${styles.dashboardGrid} animate-fade-in stagger-4`} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <Card title="Upcoming Mentoring Schedule">
          <div className={tableStyles.tableWrapper}>
            <div className={tableStyles.tableContainer}>
              <table className={tableStyles.table}>
                <thead>
                  <tr>
                    <th>
                      <div className={tableStyles.thContent}>
                        Session Date & Time
                        <span className={tableStyles.sortIcon}>↕</span>
                      </div>
                    </th>
                    <th>
                      <div className={tableStyles.thContent}>
                        Agenda / Topic
                        <span className={tableStyles.sortIcon}>↕</span>
                      </div>
                    </th>
                    <th>
                      <div className={tableStyles.thContent}>
                        Status
                        <span className={tableStyles.sortIcon}>↕</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingSesData.length > 0 ? (
                    upcomingSesData.map((row, rowIndex) => (
                      <tr 
                        key={row.StudentMentoringID} 
                        style={{ animationDelay: `${rowIndex * 0.1}s` }}
                        className={tableStyles.tableRow}
                      >
                        <td>
                          <div className={tableStyles.tdContent}>
                            {row.ScheduledMeetingDate}
                          </div>
                        </td>
                        <td>
                          <div className={tableStyles.tdContent}>
                            {row.MentoringMeetingAgenda}
                          </div>
                        </td>
                        <td>
                          <div className={tableStyles.tdContent}>
                            <span className={`${styles.stressBadge} ${row.status === 'Scheduled' ? styles.low : styles.medium}`}>
                              {row.AttendanceStatus}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className={tableStyles.emptyState}>
                        <div className={tableStyles.emptyContent}>
                          <span className={tableStyles.emptyIcon}>📭</span>
                          <p>No data available</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        <Card title="Past session history">
          <div className={tableStyles.tableWrapper}>
            <div className={tableStyles.tableContainer}>
              <table className={tableStyles.table}>
                <thead>
                  <tr>
                    <th>
                      <div className={tableStyles.thContent}>
                        Session Id
                        <span className={tableStyles.sortIcon}>↕</span>
                      </div>
                    </th>
                    <th>
                      <div className={tableStyles.thContent}>
                        Date
                        <span className={tableStyles.sortIcon}>↕</span>
                      </div>
                    </th>
                    <th>
                      <div className={tableStyles.thContent}>
                        Issue Discussed
                        <span className={tableStyles.sortIcon}>↕</span>
                      </div>
                    </th>
                    <th>
                      <div className={tableStyles.thContent}>
                        Attendance
                        <span className={tableStyles.sortIcon}>↕</span>
                      </div>
                    </th>
                    <th>
                      <div className={tableStyles.thContent}>
                        Report
                        <span className={tableStyles.sortIcon}>↕</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mentoringHistory.length > 0 ? (
                    mentoringHistory.map((row, rowIndex) => (
                      <tr 
                        key={row.StudentMentoringID} 
                        style={{ animationDelay: `${rowIndex * 0.1}s` }}
                        className={tableStyles.tableRow}
                      >
                        <td>
                          <div className={tableStyles.tdContent}>
                            {row.StudentMentoringID}
                          </div>
                        </td>
                        <td>
                          <div className={tableStyles.tdContent}>
                            {row.DateOfMentoring}
                          </div>
                        </td>
                        <td>
                          <div className={tableStyles.tdContent}>
                            {row.IssuesDiscussed}
                          </div>
                        </td>
                        <td>
                          <div className={tableStyles.tdContent}>
                            {row.AttendanceStatus}
                          </div>
                        </td>
                        <td>
                          <div className={tableStyles.tdContent}>
                            <Button variant="secondary" className={styles.outlineBtn} onClick={() => setSelectedSession(row)}>View Details</Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className={tableStyles.emptyState}>
                        <div className={tableStyles.emptyContent}>
                          <span className={tableStyles.emptyIcon}>📭</span>
                          <p>No data available</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>

      {/* View Details Modal for Sessions */}
      {selectedSession && createPortal(
        <div className={styles.modalOverlay} onClick={() => setSelectedSession(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Session Details</h2>
              <button className={styles.closeBtn} onClick={() => setSelectedSession(null)}>&times;</button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.modalFieldGroup}>
                <label>Student Mentoring ID</label>
                <div className={styles.fieldValue}>{selectedSession.StudentMentoringID}</div>
              </div>
              <div className={styles.modalFieldGroup}>
                <label>Date of Mentoring</label>
                <div className={styles.fieldValue}>{selectedSession.DateOfMentoring}</div>
              </div>
              <div className={styles.modalFieldGroup}>
                <label>Schedule Meeting Date</label>
                <div className={styles.fieldValue}>{selectedSession.ScheduledMeetingDate}</div>
              </div>
              <div className={styles.modalFieldGroup}>
                <label>Issue Discussed</label>
                <div className={styles.fieldValue}>{selectedSession.IssuesDiscussed}</div>
              </div>

              <div className={`${styles.modalFieldGroup} ${styles.modalFieldFull}`}>
                <label>Mentoring Meeting Agenda</label>
                <div className={styles.fieldValue}>{selectedSession.MentoringMeetingAgenda || '-'}</div>
              </div>

              <div className={styles.modalFieldGroup}>
                <label>Attendance Status</label>
                <div className={styles.fieldValue}>{selectedSession.AttendanceStatus}</div>
              </div>
              <div className={styles.modalFieldGroup}>
                <label>Is Parent Present</label>
                <div className={styles.fieldValue}>{selectedSession.IsParentPresent}</div>
              </div>

              <div className={`${styles.modalFieldGroup} ${styles.modalFieldFull}`}>
                <label>Staff Opinion</label>
                <div className={styles.fieldValue}>{selectedSession.StaffOpinion || '-'}</div>
              </div>

              <div className={styles.modalFieldGroup}>
                <label>Stress Level</label>
                <div className={styles.fieldValue}>
                  <span className={`${styles.stressBadge} ${selectedSession.StressLevel?.toLowerCase() === 'high' ? styles.high : styles.low}`}>
                    {selectedSession.StressLevel || '-'}
                  </span>
                </div>
              </div>
              <div className={styles.modalFieldGroup}>
                <label>Learner Type</label>
                <div className={styles.fieldValue}>{selectedSession.LearnerType || '-'}</div>
              </div>
              
              <div className={`${styles.modalFieldGroup} ${styles.modalFieldFull}`}>
                <label>Description</label>
                <div className={styles.fieldValue}>{selectedSession.Description || '-'}</div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default UpcomingSessions;
