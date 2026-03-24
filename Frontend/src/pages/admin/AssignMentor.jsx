import React, { useState, useEffect } from 'react';
import Card from '../../components/Card/Card';
import Table from '../../components/Table/Table';
import Button from '../../components/Button/Button';
import { IconUsers } from '../../components/Icons/Icons';
import adminStyles from './AdminDashboard.module.css';
import styles from './AssignMentor.module.css';

const AssignMentor = () => {
  const [mentors, setMentors] = useState([]);
  const [unassignedStudents, setUnassignedStudents] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState('');
  const [selectedStudentIDs, setSelectedStudentIDs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // Fetch mentors + all students + assigned students, then derive unassigned list
  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch('http://localhost:3000/api/staff', { headers }).then(r => r.json()),
      fetch('http://localhost:3000/api/students', { headers }).then(r => r.json()),
      fetch('http://localhost:3000/api/studentmentoring/reports/mentor-wise-mentees', { headers }).then(r => r.json())
    ])
      .then(([staffList, studentList, menteeData]) => {
        setMentors(Array.isArray(staffList) ? staffList : []);

        // Build a Set of all StudentIDs that are already assigned to some mentor
        const assignedIDs = new Set();
        (Array.isArray(menteeData) ? menteeData : []).forEach(mentor => {
          (mentor.Students || []).forEach(s => assignedIDs.add(s.StudentID));
        });

        // Keep only students who have no mentor yet
        const unassigned = (Array.isArray(studentList) ? studentList : [])
          .filter(s => !assignedIDs.has(s.StudentID));
        setUnassignedStudents(unassigned);
      })
      .catch(err => console.error('Failed to load data:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleStudentToggle = (studentID) => {
    setSelectedStudentIDs(prev =>
      prev.includes(studentID)
        ? prev.filter(id => id !== studentID)
        : [...prev, studentID]
    );
  };

  const handleAssign = async () => {
    if (!selectedMentor || selectedStudentIDs.length === 0) return;

    setAssigning(true);
    setStatusMsg({ type: '', text: '' });

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    let successCount = 0;
    let failCount = 0;

    // Assign each selected student one by one
    for (const studentID of selectedStudentIDs) {
      try {
        const res = await fetch('http://localhost:3000/api/studentmentor/mentor/assign', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            StudentID: studentID,
            StaffID: selectedMentor,
            FromDate: today
          })
        });
        if (res.ok) {
          successCount++;
        } else {
          const err = await res.json();
          console.error(`Failed for StudentID ${studentID}:`, err.message);
          failCount++;
        }
      } catch (e) {
        console.error(e);
        failCount++;
      }
    }

    setAssigning(false);

    if (successCount > 0) {
      setStatusMsg({
        type: 'success',
        text: `✅ ${successCount} student(s) assigned successfully!${failCount > 0 ? ` (${failCount} failed)` : ''}`
      });
      // Reset and refresh
      setSelectedMentor('');
      setSelectedStudentIDs([]);
      setSearchTerm('');
      fetchData();
    } else {
      setStatusMsg({ type: 'error', text: `❌ All assignments failed. Students may already be assigned.` });
    }
  };

  // Live search filter
  const filteredStudents = unassignedStudents.filter(s =>
    s.StudentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.EnrollmentNo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedMentorName = mentors.find(m => String(m.StaffID) === String(selectedMentor))?.StaffName || 'No mentor selected';
  const isAssignDisabled = !selectedMentor || selectedStudentIDs.length === 0 || assigning;

  const columns = [
    {
      header: '',
      render: (row) => (
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={selectedStudentIDs.includes(row.StudentID)}
          onChange={() => handleStudentToggle(row.StudentID)}
        />
      )
    },
    { header: 'Enrollment No', field: 'EnrollmentNo' },
    {
      header: 'Student Name',
      render: (row) => (
        <div className={adminStyles.userCell}>
          <div className={adminStyles.userAvatar}>{row.StudentName?.charAt(0)}</div>
          <span className={adminStyles.userName}>{row.StudentName}</span>
        </div>
      )
    },
    { header: 'Email', field: 'EmailAddress' },
    { header: 'Mobile', field: 'MobileNo' },
  ];

  return (
    <>
      <div className={adminStyles.header}>
        <div>
          <h1 className="animate-slide-up stagger-1">Assign Mentor to Students</h1>
          <p className="animate-fade-in stagger-2 text-subtle">
            Select a mentor and assign unassigned students at once.
          </p>
        </div>
      </div>

      {/* Status message */}
      {statusMsg.text && (
        <div style={{
          padding: '0.875rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          fontWeight: 500,
          fontSize: '0.9rem',
          background: statusMsg.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
          border: `1px solid ${statusMsg.type === 'success' ? 'var(--color-success)' : 'var(--color-danger)'}`,
          color: statusMsg.type === 'success' ? 'var(--color-success)' : 'var(--color-danger)'
        }}>
          {statusMsg.text}
        </div>
      )}

      <div className="animate-fade-in stagger-3">
        {/* Mentor Dropdown */}
        <div className={styles.mentorSelectSection}>
          <label htmlFor="mentorSelect">Select Mentor</label>
          <select
            id="mentorSelect"
            className={styles.selectDropdown}
            value={selectedMentor}
            onChange={(e) => setSelectedMentor(e.target.value)}
            disabled={loading}
          >
            <option value="" disabled>
              {loading ? 'Loading mentors...' : '-- Choose Mentor --'}
            </option>
            {mentors.map(m => (
              <option key={m.StaffID} value={m.StaffID}>
                {m.StaffName} ({m.EmailAddress})
              </option>
            ))}
          </select>
        </div>

        <div className={styles.assignLayout}>
          {/* Left: Unassigned Students Table */}
          <Card title={`Unassigned Students ${loading ? '' : `(${unassignedStudents.length})`}`}>
            <input
              type="text"
              placeholder="Search by Name or Enrollment No..."
              className={styles.menteeSearch}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {loading ? (
              <p style={{ padding: '1rem', color: 'var(--color-text-subtle)' }}>Loading students...</p>
            ) : filteredStudents.length === 0 ? (
              <p style={{ padding: '1rem', color: 'var(--color-text-subtle)' }}>
                {unassignedStudents.length === 0
                  ? '🎉 All students have been assigned a mentor.'
                  : 'No students match your search.'}
              </p>
            ) : (
              <Table columns={columns} data={filteredStudents} keyField="StudentID" />
            )}
          </Card>

          {/* Right: Assignment Summary */}
          <Card title="Assignment Summary">
            <div className={styles.summaryContent}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Selected Mentor:</span>
                <span className={styles.summaryValue} style={{ textAlign: 'right', fontSize: '0.875rem' }}>
                  {selectedMentorName}
                </span>
              </div>

              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Students Selected:</span>
                <span className={`${styles.summaryValue} ${selectedStudentIDs.length > 0 ? styles.summaryHighlight : ''}`}>
                  {selectedStudentIDs.length}
                </span>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleAssign}
                  disabled={isAssignDisabled}
                  style={isAssignDisabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                >
                  <IconUsers size={16} />
                  {assigning ? 'Assigning...' : 'Assign Mentor'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AssignMentor;
