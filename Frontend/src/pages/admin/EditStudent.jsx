import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import authStyles from '../auth/Auth.module.css';
import styles from './AdminDashboard.module.css';

const EditStudent = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // EnrollmentNo

  const [formData, setFormData] = useState({
    StudentName: '',
    EnrollmentNo: '',
    MobileNo: '',
    EmailAddress: '',
    Description: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // Pre-fill form with student data from API
  useEffect(() => {
    fetch(`http://localhost:3000/api/students/${id}`, { headers })
      .then(res => {
        if (!res.ok) throw new Error('Student not found');
        return res.json();
      })
      .then(data => {
        const student = Array.isArray(data) ? data[0] : data;
        setFormData({
          StudentName: student.StudentName || '',
          EnrollmentNo: student.EnrollmentNo || '',
          MobileNo: student.MobileNo || '',
          EmailAddress: student.EmailAddress || '',
          Description: student.Description || ''
        });
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load student details.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    fetch(`http://localhost:3000/api/students/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(formData)
    })
      .then(res => {
        if (!res.ok) throw new Error('Update failed');
        return res.json();
      })
      .then(() => navigate('/admin/students'))
      .catch(err => {
        console.error(err);
        setError('Failed to update student. Please try again.');
      })
      .finally(() => setSaving(false));
  };

  return (
    <>
      <div className={styles.header}>
        <div>
          <h1 className="animate-slide-up stagger-1">Edit Student</h1>
          <p className="animate-fade-in stagger-2 text-subtle">
            Update information for enrollment: <strong>{id}</strong>
          </p>
        </div>
        <div className="animate-fade-in stagger-3">
          <Button variant="secondary" onClick={() => navigate('/admin/students')}>Back to Students</Button>
        </div>
      </div>

      <div className="animate-fade-in stagger-4">
        <Card>
          {loading ? (
            <p style={{ padding: '1rem', color: 'var(--color-text-subtle)' }}>Loading student details...</p>
          ) : (
            <form onSubmit={handleSubmit} className={authStyles.form} style={{ padding: '1rem', maxWidth: '600px' }}>
              {error && (
                <p style={{ color: 'var(--color-danger)', marginBottom: '1rem', fontWeight: 500 }}>{error}</p>
              )}

              <div className={authStyles.inputGroup}>
                <label>Student Name</label>
                <input
                  type="text"
                  name="StudentName"
                  value={formData.StudentName}
                  onChange={handleChange}
                  className={authStyles.input}
                  required
                />
              </div>

              <div className={authStyles.inputGroup}>
                <label>Enrollment Number</label>
                <input
                  type="text"
                  name="EnrollmentNo"
                  value={formData.EnrollmentNo}
                  onChange={handleChange}
                  className={authStyles.input}
                  required
                />
              </div>

              <div className={authStyles.inputGroup}>
                <label>Mobile Number</label>
                <input
                  type="tel"
                  name="MobileNo"
                  value={formData.MobileNo}
                  onChange={handleChange}
                  className={authStyles.input}
                  required
                />
              </div>

              <div className={authStyles.inputGroup}>
                <label>Email Address</label>
                <input
                  type="email"
                  name="EmailAddress"
                  value={formData.EmailAddress}
                  onChange={handleChange}
                  className={authStyles.input}
                  required
                />
              </div>

              <div className={authStyles.inputGroup}>
                <label>Description</label>
                <textarea
                  name="Description"
                  value={formData.Description}
                  onChange={handleChange}
                  className={authStyles.input}
                  rows="4"
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ marginTop: '1rem' }}>
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Update Student'}
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </>
  );
};

export default EditStudent;
