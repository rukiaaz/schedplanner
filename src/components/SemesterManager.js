// src/components/SemesterManager.js
import React, { useState } from 'react';

const SemesterManager = ({ currentSemester, onSelectSemester, onClose }) => {
  const [semesters] = useState([
    '1st Sem 2023-2024',
    '2nd Sem 2023-2024',
    'Summer 2024',
    '1st Sem 2024-2025',
    '2nd Sem 2024-2025',
    'Summer 2025',
    '1st Sem 2025-2026'
  ]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
        <h2>📚 SEMESTER MANAGER</h2>
        
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Current: {currentSemester}</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {semesters.map(sem => (
              <button
                key={sem}
                onClick={() => {
                  onSelectSemester(sem);
                  onClose();
                }}
                style={{
                  padding: '1.5rem',
                  border: '4px solid black',
                  background: sem === currentSemester ? '#000' : '#fff',
                  color: sem === currentSemester ? '#fff' : '#000',
                  fontSize: '1.8rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  textAlign: 'left',
                  boxShadow: '6px 6px 0 #000'
                }}
              >
                {sem} {sem === currentSemester && '✓'}
              </button>
            ))}
          </div>
        </div>

        <div className="modal-buttons">
          <button className="modal-btn" onClick={onClose}>
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};

export default SemesterManager;