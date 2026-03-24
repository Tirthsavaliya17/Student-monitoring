import React from 'react';
import styles from './Card.module.css';

const Card = ({ children, className = '', title = '', delay = 0 }) => {
  return (
    <div 
      className={`${styles.card} ${className}`} 
      style={{ animationDelay: `${delay}s` }}
    >
      {title && (
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>{title}</h3>
          <div className={styles.cardGlow}></div>
        </div>
      )}
      <div className={styles.cardContent}>
        {children}
      </div>
    </div>
  );
};

export default Card;
