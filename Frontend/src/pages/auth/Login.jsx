import React, {useState } from 'react';
import {useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';
import Button from '../../components/Button/Button';

const Login = () => {
  const [role, setRole] = useState('student');
  const navigate = useNavigate();
  const apiURL = "http://localhost:3000/api/auth/login";
  const [data, setData] = useState({email:'',password:'',role:role});

  const handleLogin = (e) => {
    e.preventDefault();

    fetch(
      apiURL,{
        method:"POST",
        body:JSON.stringify(data),
        headers:{
          "Content-Type":"application/json"
        }
      }
    ).then((res)=>{
        return res.json()
    })
    .then((data)=>{
      if (data && data.token){
         localStorage.setItem("token",data.token)
         localStorage.setItem("role", role)

         if (role === 'admin') navigate('/admin');
          else if (role === 'staff') navigate('/mentor');
          else navigate('/student');
      }
      else {
        alert(data.message || "Login failed");
      }
       
      
    })
    
  };

  return (
    <div className={styles.loginContainer}>
      {/* SaaS Geometric Grid Background from Global */}
      
      <div className={`${styles.formWrapper} animate-scale`}>
        <div className={styles.brandHeader}>
          <div className={styles.logoMark}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
          </div>
          <h1>SMMS</h1>
          <p>Access your mentoring workspace</p>
        </div>

        <div className={styles.roleTabs}>
          {['student', 'staff', 'admin'].map((r) => (
            <button
              key={r}
              type="button"
              className={`${styles.tabBtn} ${role === r ? styles.tabActive : ''}`}
              onClick={() => {
                setRole(r);
                setData({ ...data, role: r });
              }}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Email Address</label>
            <input 
              type="email" 
              className={styles.input} 
              placeholder={`Enter your ${role.toLowerCase()} email`}
              required
              onChange={(e)=>{
                setData({...data, email : e.target.value})
              }}
            />
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.labelRow}>
              <label>Password</label>
            </div>
            <input 
              type="password" 
              className={styles.input} 
              placeholder="Enter your password"
              required 
              onChange={(e)=>{
                setData({...data, password : e.target.value})
              }}
            />
          </div>

          <Button type="submit" variant="primary" fullWidth className={styles.submitBtn}>
            Continue as {role}
          </Button>

        </form>
      </div>
    </div>
  );
};

export default Login;
