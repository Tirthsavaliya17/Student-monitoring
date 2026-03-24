import React from 'react';
import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import { IconUsers, IconCalendar, IconBook } from '../../components/Icons/Icons';
import styles from './MentorDashboard.module.css';

const ScheduleSession = () => {

  const [enrollment, setEnrollment] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [agenda, setAgenda] = useState("");

  const userData = useOutletContext();

  const handleSubmit = (e) => {
  e.preventDefault();

  fetch(`http://localhost:3000/api/studentmentoring/newsession/${userData?.user?.StaffID}/${enrollment}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({
      date,
      time,
      MentoringMeetingAgenda: agenda
    })
  })
  .then(res => res.json())
  .then(() => {
    alert("Session Created SuccesFully");
    setEnrollment("");
    setDate("");
    setTime("");
    setAgenda("");
  })
  .catch(err => console.log(err));
};

  // http://localhost:3000/api/studentmentoring/newsession/101/DU22CE001

  return (
    <>
      <div className={styles.header}>
        <div>
          <h1 className="animate-slide-up stagger-1">Schedule New Session</h1>
          <p className="animate-fade-in stagger-2 text-subtle">Book a mentoring session with an assigned mentee.</p>
        </div>
      </div>

      <div className={`${styles.dashboardGrid} animate-fade-in stagger-3`}>
        <div className={styles.mainContent}>
          <Card title="Session Details Form">
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Student Enrollment No.</label>
                <input type="text" value={enrollment} onChange={(e) => setEnrollment(e.target.value)} placeholder="Enter Enrollment No (e.g., EN2026001)" style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Date</label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Time</label>
                  <input type="time" value={time} onChange={(e) => setTime(e.target.value)} style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Session Topic / Agenda</label>
                <input type="text" value={agenda} onChange={(e) => setAgenda(e.target.value)} placeholder="E.g., Midterm review and stress management" style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }} />
              </div>

              <Button variant="primary" type="submit" style={{ alignSelf: 'flex-start' }}>Schedule Meeting</Button>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ScheduleSession;
