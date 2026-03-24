import React, { useState,useEffect } from 'react';
import Card from '../../components/Card/Card';
import Table from '../../components/Table/Table';
import { IconBook, IconSearch } from '../../components/Icons/Icons';
import styles from './MentorDashboard.module.css';
import { useOutletContext } from 'react-router-dom';

const MentorFeedback = () => {
  const [searchQuery, setSearchQuery] = useState('');

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

  }, [userData])

  // Sample feedback data from students
  const feedbackData = [
    {
      id: 1,
      student: 'Eva Green',
      date: 'Oct 05, 2026',
      topic: 'Initial onboard',
      rating: '⭐⭐⭐⭐⭐',
      comments: 'Very helpful session. I feel much clearer about my semester goals now.'
    },
    {
      id: 2,
      student: 'David Lee',
      date: 'Oct 10, 2026',
      topic: 'Project discussion',
      rating: '⭐⭐⭐⭐',
      comments: 'Good guidance on the bibliography. Needs a bit more time for in-depth code review.'
    },
    {
      id: 3,
      student: 'Frank White',
      date: 'Oct 15, 2026',
      topic: 'Career advice',
      rating: '⭐⭐⭐⭐⭐',
      comments: 'Amazing alumni connections provided. Very grateful for the resume tips!'
    },
    {
      id: 4,
      student: 'Alice Smith',
      date: 'Oct 18, 2026',
      topic: 'Stress Management Guidance',
      rating: '⭐⭐⭐⭐',
      comments: 'Helped calm my nerves before midterms. Suggested great study schedules.'
    },
  ];

  /* Columns mapped exactly to the required data */
  const columns = [
    { header: 'Student Name', field: 'StudentName' },
    { header: 'Meeting Date', field: 'DateOfMentoring' },
    { header: 'Topic', field: 'MentoringMeetingAgenda' },
    { header: 'Student Comments', field: 'StudentsOpinion', render: (row) => <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: '1.4', display: 'block', width: '100%' }}>{row.StudentsOpinion}</span> }
  ];

  /* Live filter by student name or topic */
  const filteredFeedback = Array.isArray(history)
    ? history.filter(item => item.StudentsOpinion)
    .filter(item =>
    item.StudentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.MentoringMeetingAgenda.toLowerCase().includes(searchQuery.toLowerCase())
  ):[];

  return (
    <>
      <div className={styles.header}>
        <div>
          <h1 className="animate-slide-up stagger-1">Student Feedback</h1>
          <p className="animate-fade-in stagger-2 text-subtle">Review all feedback and ratings submitted by students post-mentoring.</p>
        </div>
        <div className="animate-fade-in stagger-3">
          <div className={styles.searchContainer}>
            <IconSearch size={18} className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search by student or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="animate-fade-in stagger-4">
        <Card title="Student Feedback Overview">
          <Table columns={columns} data={filteredFeedback} keyField="id" />
        </Card>
      </div>
    </>
  );
};

export default MentorFeedback;
