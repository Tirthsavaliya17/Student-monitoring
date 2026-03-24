import React, { useRef, useState } from 'react';
import styles from './Button.module.css';

const Button = ({ children, variant = 'primary', onClick, type = 'button', fullWidth = false, className = '', icon }) => {
  const btnRef = useRef(null);
  const [ripple, setRipple] = useState({ x: -1, y: -1, show: false });

  const handleRipple = (e) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    setRipple({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      show: true
    });
    setTimeout(() => setRipple(r => ({ ...r, show: false })), 600);
    if (onClick) onClick(e);
  };

  const btnClass = `
    ${styles.btn} 
    ${styles[variant]} 
    ${fullWidth ? styles.fullWidth : ''} 
    ${className}
  `.trim();

  return (
    <button ref={btnRef} type={type} className={btnClass} onClick={handleRipple}>
      {ripple.show && (
        <span 
          className={styles.rippleEffect} 
          style={{ left: ripple.x, top: ripple.y }} 
        />
      )}
      <span className={styles.content}>
        {icon && <span className={styles.icon}>{icon}</span>}
        {children}
      </span>
      <div className={styles.btnGlow}></div>
    </button>
  );
};

export default Button;
