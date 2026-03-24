import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import authStyles from '../auth/Auth.module.css';
import styles from './AdminDashboard.module.css';

const EditMentor = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // StaffID

  const [formData, setFormData] = useState({
    StaffName: '',
    MobileNo: '',
    EmailAddress: '',
    Password: '',
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

  // Pre-fill the form with existing mentor data on load
  useEffect(() => {
    fetch(`http://localhost:3000/api/staff/${id}`, { headers })
      .then(res => {
        if (!res.ok) throw new Error('Mentor not found');
        return res.json();
      })
      .then(data => {
        setFormData({
          StaffName: data.StaffName || '',
          MobileNo: data.MobileNo || '',
          EmailAddress: data.EmailAddress || '',
          Password: '',           // Never pre-fill password for security
          Description: data.Description || ''
        });
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load mentor details.');
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

    // Only send Password if the user typed something
    const payload = {
      StaffName: formData.StaffName,
      MobileNo: formData.MobileNo,
      EmailAddress: formData.EmailAddress,
      Description: formData.Description,
      ...(formData.Password ? { Password: formData.Password } : {})
    };

    fetch(`http://localhost:3000/api/staff/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error('Update failed');
        return res.json();
      })
      .then(() => {
        navigate('/admin/mentors');
      })
      .catch(err => {
        console.error(err);
        setError('Failed to update mentor. Please try again.');
      })
      .finally(() => setSaving(false));
  };

  return (
    <>
      <div className={styles.header}>
        <div>
          <h1 className="animate-slide-up stagger-1">Edit Mentor</h1>
          <p className="animate-fade-in stagger-2 text-subtle">
            Update information for staff ID: <strong>{id}</strong>
          </p>
        </div>
        <div className="animate-fade-in stagger-3">
          <Button variant="secondary" onClick={() => navigate('/admin/mentors')}>
            Back to Mentors
          </Button>
        </div>
      </div>

      <div className="animate-fade-in stagger-4">
        <Card>
          {loading ? (
            <p style={{ padding: '1rem', color: 'var(--color-text-subtle)' }}>Loading mentor details...</p>
          ) : (
            <form onSubmit={handleSubmit} className={authStyles.form} style={{ padding: '1rem', maxWidth: '600px' }}>
              {error && (
                <p style={{ color: 'var(--color-danger)', marginBottom: '1rem', fontWeight: 500 }}>{error}</p>
              )}

              <div className={authStyles.inputGroup}>
                <label>Staff Name</label>
                <input
                  type="text"
                  name="StaffName"
                  value={formData.StaffName}
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
                <label>Password <span style={{ color: 'var(--color-text-subtle)', fontWeight: 400 }}>(Leave blank to keep current)</span></label>
                <input
                  type="password"
                  name="Password"
                  value={formData.Password}
                  onChange={handleChange}
                  className={authStyles.input}
                  placeholder="New password"
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
                  {saving ? 'Saving...' : 'Update Mentor'}
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </>
  );
};

export default EditMentor;
