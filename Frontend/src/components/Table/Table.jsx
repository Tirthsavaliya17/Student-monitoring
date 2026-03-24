import React from 'react';
import styles from './Table.module.css';

const Table = ({ columns, data, keyField = 'id' }) => {
  return (
    <div className={styles.tableWrapper}>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={index}>
                  <div className={styles.thContent}>
                    {col.header}
                    <span className={styles.sortIcon}>↕</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr 
                  key={row[keyField]} 
                  style={{ animationDelay: `${rowIndex * 0.1}s` }}
                  className={styles.tableRow}
                >
                  {columns.map((col, colIndex) => (
                    <td key={colIndex}>
                      <div className={styles.tdContent}>
                        {col.render ? col.render(row) : row[col.field]}
                      </div>
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className={styles.emptyState}>
                  <div className={styles.emptyContent}>
                    <span className={styles.emptyIcon}>📭</span>
                    <p>No data available</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
