import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Auth.module.css';
import Button from '../../components/Button/Button';
import { API_ENDPOINTS } from '../../config/api';

const Register = () => {
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: role
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registration successful! Please login to continue.');
        navigate('/login');
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setFormData(prev => ({
      ...prev,
      role: newRole
    }));
  };

  return (
    <div className={styles.loginContainer}>
      <div className={`${styles.formWrapper} animate-scale`}>
        <div className={styles.brandHeader}>
          <div className={styles.logoMark}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
          </div>
          <h1>Join SMMS</h1>
          <p>Create your mentoring account</p>
        </div>

        <div className={styles.roleTabs}>
          {['student', 'staff', 'admin'].map((r) => (
            <button
              key={r}
              type="button"
              className={`${styles.tabBtn} ${role === r ? styles.tabActive : ''}`}
              onClick={() => handleRoleChange(r)}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>

        <form onSubmit={handleRegister} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Full Name</label>
            <input 
              type="text" 
              name="name"
              className={styles.input} 
              placeholder={`Enter your ${role.toLowerCase()} name`}
              required
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Email Address</label>
            <input 
              type="email" 
              name="email"
              className={styles.input} 
              placeholder={`Enter your ${role.toLowerCase()} email`}
              required
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <input 
              type="password" 
              name="password"
              className={styles.input} 
              placeholder="Create a strong password"
              required
              value={formData.password}
              onChange={handleInputChange}
              minLength="6"
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword"
              className={styles.input} 
              placeholder="Confirm your password"
              required
              value={formData.confirmPassword}
              onChange={handleInputChange}
              minLength="6"
            />
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : `Register as ${role}`}
          </Button>
        </form>

        <div className={styles.footerText}>
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
