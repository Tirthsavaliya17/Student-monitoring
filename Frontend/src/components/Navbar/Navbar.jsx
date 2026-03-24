import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconSearch, IconBell, IconChevronDown, IconMoon, IconSun } from '../Icons/Icons';
import styles from './Navbar.module.css';

const Navbar = ({ role, userName, email }) => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    const nextTheme = !isDarkMode;
    const allEls = document.querySelectorAll('*');
    const viewH = window.innerHeight;
    const maxDelay = 1.2; // seconds for wave to sweep full screen top→bottom

    allEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      const ratio = Math.max(0, Math.min(1, centerY / viewH));
      const delay = (ratio * maxDelay).toFixed(3);
      el.style.transition = [
        `background-color 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        `color 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        `border-color 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        `box-shadow 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        `fill 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        `stroke 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      ].join(', ');
    });

    setIsDarkMode(nextTheme);

    // Clean up inline styles after full wave completes so CSS hover etc. work normally
    const cleanupDelay = (maxDelay + 0.9 + 0.15) * 1000;
    setTimeout(() => {
      allEls.forEach((el) => { el.style.transition = ''; });
    }, cleanupDelay);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate('/login');
  };

  console.log(userName)
  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.navLeft}>
        <div className={styles.mobileLogo}>
          <span className={styles.logoText}>SMMS</span>
        </div>
        <div className={styles.roleBadge}>
          <span className={styles.pulseDot}></span>
          {role?.charAt(0).toUpperCase() + role?.slice(1)} Workspace
        </div>
      </div>
      
      <div className={styles.navRight}>
        <div className={styles.searchBar}>
          <IconSearch size={16} className={styles.searchIcon} />
         <input
            type="text"
            placeholder={`Search ${role?.toLowerCase()} resources...`}
          />
        </div>
        <button 
          className={styles.themeToggleBtn} 
          onClick={toggleTheme}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          <div key={isDarkMode ? 'dark' : 'light'} className={styles.iconSpring}>
            {isDarkMode ? <IconSun size={18} /> : <IconMoon size={18} />}
          </div>
        </button>
        <div className={styles.profileBox}>
          <div className={styles.avatarWrapper}>
            <div className={styles.avatar}>
              {userName ? userName.charAt(0) : "U"}
            </div>
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{userName}</span>
            <span className={styles.userRole}>{email}</span>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout} title="Logout">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;







