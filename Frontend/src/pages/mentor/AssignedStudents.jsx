import React, { useState,useEffect } from 'react';
import Card from '../../components/Card/Card';
import Table from '../../components/Table/Table';
import Button from '../../components/Button/Button';
import { IconUsers, IconCalendar, IconMessage, IconBook, IconSearch } from '../../components/Icons/Icons';
import styles from './MentorDashboard.module.css'; // Reusing established styles
import { useOutletContext } from 'react-router-dom';

const AssignedStudents = () => {
  const [mentee,setMentee] = useState([]);
  const userData = useOutletContext();

  useEffect(() => {
      fetch(`http://localhost:3000/api/staff/${userData?.user?.StaffID}/mentees`, {
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
          setMentee(data);
        });

    }, [mentee]);

  const columns = [
    { header: 'Enrollment No', field: 'EnrollmentNo' },
    { header: 'Mentee Name', field: 'StudentName' },
    { header: 'Email', field: 'EmailAddress' },
    { header: 'Mobile Number', field: 'MobileNo' },
    { 
      header: 'Actions', 
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="secondary" className={styles.outlineBtn} onClick={() => window.open(`https://wa.me/${row?.MobileNo}`)}><IconMessage size={14} /> Msg</Button>
          <Button variant="primary" className={styles.outlineBtn} onClick={() => window.open(`mailto:${row?.EmailAddress}`)}><IconMessage size={14} /> Email</Button>
        </div>
      ) 
    }
  ];

  return (
    <>
      <div className={styles.header}>
        <div>
          <h1 className="animate-slide-up stagger-1">Assigned Mentees</h1>
          <p className="animate-fade-in stagger-2 text-subtle">Detailed roster of your currently assigned students.</p>
        </div>
      </div>

      <div className="animate-fade-in stagger-4">
        <Card title="Mentee Caseload">
          <Table columns={columns} data={mentee} keyField="id" />
        </Card>
      </div>
    </>
  );
};

export default AssignedStudents;
