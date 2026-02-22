// src/components/SubjectList.js
import React, { useState } from 'react';
import { useDrag } from 'react-dnd';

const SubjectList = ({ subjects, onAddToSchedule, onDeleteSubject, onEditSubject }) => {
  const [editingSubject, setEditingSubject] = useState(null);

  const categories = [
    { name: 'CORE IT', filter: (s) => s.type === 'core' },
    { name: 'ELECTIVES', filter: (s) => s.type === 'elective' },
    { name: 'GEN ED', filter: (s) => s.type === 'gened' }
  ];

  const SubjectCard = ({ subject }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: 'SUBJECT',
      item: subject,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }), [subject.id]);

    const handleQuickAdd = (e) => {
      e.stopPropagation();
      onAddToSchedule(subject, 'MON', '9', '11');
    };

    const handleEdit = (e) => {
      e.stopPropagation();
      setEditingSubject(subject);
    };

    const handleDelete = (e) => {
      e.stopPropagation();
      if (window.confirm(`Delete ${subject.code}?`)) {
        onDeleteSubject(subject.id);
      }
    };

    return (
      <div 
        ref={drag}
        className="subject-card"
        style={{ 
          opacity: isDragging ? 0.5 : 1,
          position: 'relative',
          cursor: 'grab'
        }}
      >
        <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '5px' }}>
          <button
            onClick={handleEdit}
            style={{
              background: '#2e7dff',
              color: 'white',
              border: '2px solid white',
              width: '30px',
              height: '30px',
              fontSize: '1.6rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >✎</button>
          <button
            onClick={handleDelete}
            style={{
              background: '#ff4d4d',
              color: 'white',
              border: '2px solid white',
              width: '30px',
              height: '30px',
              fontSize: '1.8rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              lineHeight: '1'
            }}
          >×</button>
        </div>
        
        <h4>{subject.name}</h4>
        <span className="subject-code">{subject.code}</span>
        <div className="subject-units">{subject.units} units</div>
        <button 
          className="quick-add-btn"
          onClick={handleQuickAdd}
        >
          + QUICK ADD (MON 9-11)
        </button>
      </div>
    );
  };

  // Edit Modal
  if (editingSubject) {
    return (
      <div className="modal-overlay" onClick={() => setEditingSubject(null)}>
        <div className="modal-content" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
          <h2>✎ EDIT SUBJECT</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            onEditSubject(editingSubject);
            setEditingSubject(null);
          }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '1.6rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Subject Code:
              </label>
              <input
                type="text"
                value={editingSubject.code}
                onChange={(e) => setEditingSubject({...editingSubject, code: e.target.value})}
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: '4px solid black',
                  fontSize: '1.6rem'
                }}
                required
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '1.6rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Subject Name:
              </label>
              <input
                type="text"
                value={editingSubject.name}
                onChange={(e) => setEditingSubject({...editingSubject, name: e.target.value})}
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: '4px solid black',
                  fontSize: '1.6rem'
                }}
                required
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '1.6rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  Units:
                </label>
                <select
                  value={editingSubject.units}
                  onChange={(e) => setEditingSubject({...editingSubject, units: parseInt(e.target.value)})}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '4px solid black',
                    fontSize: '1.6rem'
                  }}
                >
                  {[1,2,3,4,5].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '1.6rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  Type:
                </label>
                <select
                  value={editingSubject.type}
                  onChange={(e) => setEditingSubject({...editingSubject, type: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '4px solid black',
                    fontSize: '1.6rem'
                  }}
                >
                  <option value="core">Core IT</option>
                  <option value="elective">Elective</option>
                  <option value="gened">Gen Ed</option>
                </select>
              </div>
            </div>
            <div className="modal-buttons">
              <button type="button" className="modal-btn" onClick={() => setEditingSubject(null)}>
                CANCEL
              </button>
              <button type="submit" className="modal-btn" style={{ background: '#000', color: '#fff' }}>
                SAVE CHANGES
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="subject-list">
      <h2>📚 MY SUBJECTS ({subjects.length})</h2>
      
      {subjects.length === 0 ? (
        <div style={{ 
          border: '4px solid black', 
          padding: '3rem', 
          textAlign: 'center',
          fontSize: '2rem',
          background: '#eee'
        }}>
          No subjects yet. Click "ADD SUBJECT" to start!
        </div>
      ) : (
        categories.map(category => {
          const categorySubjects = subjects.filter(category.filter);
          if (categorySubjects.length === 0) return null;
          
          return (
            <div key={category.name} className="subject-category">
              <h3>{category.name} ({categorySubjects.length})</h3>
              {categorySubjects.map(subject => (
                <SubjectCard key={subject.id} subject={subject} />
              ))}
            </div>
          );
        })
      )}
    </div>
  );
};

export default SubjectList;