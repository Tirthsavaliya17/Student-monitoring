import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import authStyles from '../auth/Auth.module.css';
import styles from './AdminDashboard.module.css';

const AddMentor = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    StaffID: '',
    StaffName: '',
    MobileNo: '',
    EmailAddress: '',
    Password: '',
    Description: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    fetch('http://localhost:3000/api/staff', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    })
      .then(res => {
        if (!res.ok) return res.json().then(err => { throw new Error(err.message || 'Failed to add mentor'); });
        return res.json();
      })
      .then(() => {
        navigate('/admin/mentors');
      })
      .catch(err => {
        console.error(err);
        setError(err.message || 'Something went wrong. Please try again.');
      })
      .finally(() => setSaving(false));
  };

  return (
    <>
      <div className={styles.header}>
        <div>
          <h1 className="animate-slide-up stagger-1">Add New Mentor</h1>
          <p className="animate-fade-in stagger-2 text-subtle">Enter staff details to create a mentor account.</p>
        </div>
        <div className="animate-fade-in stagger-3">
          <Button variant="secondary" onClick={() => navigate('/admin/mentors')}>Back to Mentors</Button>
        </div>
      </div>

      <div className="animate-fade-in stagger-4">
        <Card>
          <form onSubmit={handleSubmit} className={authStyles.form} style={{ padding: '1rem', maxWidth: '600px' }}>

            {error && (
              <p style={{ color: 'var(--color-danger)', marginBottom: '1rem', fontWeight: 500 }}>{error}</p>
            )}

            <div className={authStyles.inputGroup}>
              <label>Staff ID</label>
              <input
                type="text"
                name="StaffID"
                value={formData.StaffID}
                onChange={handleChange}
                className={authStyles.input}
                placeholder="e.g. STF100"
                required
              />
            </div>

            <div className={authStyles.inputGroup}>
              <label>Staff Name</label>
              <input
                type="text"
                name="StaffName"
                value={formData.StaffName}
                onChange={handleChange}
                className={authStyles.input}
                placeholder="Full Name"
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
                placeholder="Mobile Number"
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
                placeholder="staff@institution.edu"
                required
              />
            </div>

            <div className={authStyles.inputGroup}>
              <label>Password</label>
              <input
                type="password"
                name="Password"
                value={formData.Password}
                onChange={handleChange}
                className={authStyles.input}
                placeholder="Create a secure password"
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
                placeholder="Mentorship focus or additional details..."
                rows="4"
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ marginTop: '1rem' }}>
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? 'Adding...' : 'Add Mentor'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
};

export default AddMentor;
