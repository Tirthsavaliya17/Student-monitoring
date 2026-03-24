import React, { useEffect, useState } from 'react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import { IconUsers, IconDashboard, IconCalendar, IconMessage, IconBook, IconCheckCircle } from '../../components/Icons/Icons';
import styles from './StudentDashboard.module.css'; // Reusing existing styles
import { useOutletContext } from 'react-router-dom';

const AssignedMentor = () => {
  
    const [mentor , setMentor] = useState({});
    const userData = useOutletContext();

    useEffect(() => {
        fetch(`http://localhost:3000/api/students/${userData?.user?.EnrollmentNo}/mentorDetail`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        }).then(res => res.json()).then(detail => setMentor(detail[0]));
      }, [userData]);


  return (
    <>
      <div className={styles.header}>
        <div>
          <h1 className="animate-slide-up stagger-1">My Assigned Mentor</h1>
          <p className="animate-fade-in stagger-2 text-subtle">View your mentor's profile and initiate contact.</p>
        </div>
      </div>

      <div className="animate-fade-in stagger-3">
        <Card title="Mentor Information">
          <div className={styles.mentorBox} style={{ marginBottom: '1.5rem' }}>
            <div className={styles.mentorAvatar} style={{ width: 80, height: 80 }}>
              <IconUsers size={40} />
            </div>
            <div className={styles.mentorDetails}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{mentor?.StaffName}</h3>
              <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)' }}>{mentor?.FacEmail} • {mentor?.MobileNo}</p>
              <p style={{ marginTop: '0.5rem', maxWidth: '600px' }}>{mentor?.Description}</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
            <Button variant="primary" onClick={() => window.open(`https://wa.me/${mentor?.MobileNo}`)}><IconMessage size={16} /> Send Message</Button>
          </div>
        </Card>
      </div>
    </>
  );
};

export default AssignedMentor;
