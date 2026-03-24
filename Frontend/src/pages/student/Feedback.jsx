import React, { useState } from 'react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import { IconDashboard, IconUsers, IconCalendar, IconBook } from '../../components/Icons/Icons';
import styles from './StudentDashboard.module.css';
import { useOutletContext } from 'react-router-dom';

const Feedback = () => {

  const [data, setData] = useState({ opinion: '' })
  const userData = useOutletContext();

  function handleSubmit(e) {
    e.preventDefault();

    fetch(`http://localhost:3000/api/students/${userData?.user?.EnrollmentNo}/feedback`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    }).then((res) => {
      return res.json()
    }).then(() => {
      alert("Feedback Submitted Succesfully.")
      setData({ opinion: '' });
    })
  }

  return (
    <>
      <div className={styles.header}>
        <div>
          <h1 className="animate-slide-up stagger-1">Provide Mentorship Feedback</h1>
          <p className="animate-fade-in stagger-2 text-subtle">Submit your evaluation and anonymous feedback regarding the mentoring process.</p>
        </div>
      </div>

      <div className={`${styles.dashboardGrid} animate-fade-in stagger-3`}>
        <div className={styles.mainContent}>
          <Card title="Feedback Form">
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={handleSubmit}>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Any areas of improvement for your Mentor?</label>
                <textarea value={data.opinion} rows="4" placeholder="Your feedback helps us improve the program..." style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', fontFamily: 'inherit', resize: 'vertical' }}
                  onChange={(e) => {
                    setData({ ...data, opinion: e.target.value })
                  }}></textarea>
              </div>

              <Button variant="primary" style={{ alignSelf: 'flex-start' }} type='submit'>Submit Feedback</Button>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Feedback;
