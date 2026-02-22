// src/components/AddSubjectForm.js
import React, { useState } from 'react';

const AddSubjectForm = ({ onSave, onCancel, days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] }) => {
  const [subject, setSubject] = useState({
    code: '',
    name: '',
    units: 3,
    type: 'core',
    day: 'MON',
    startTime: '9',
    endTime: '11'
  });

  const timeOptions = [
    '7', '8', '9', '10', '11', '12', 
    '13', '14', '15', '16', '17', '18', '19', '20'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!subject.code.trim() || !subject.name.trim()) {
      alert('Please fill in all fields!');
      return;
    }

    // Validate time if both are selected
    if (subject.startTime && subject.endTime) {
      if (parseInt(subject.startTime) >= parseInt(subject.endTime)) {
        alert('❌ End time must be after start time!');
        return;
      }
    }
    
    onSave(subject);
  };

  const isTimeValid = () => {
    if (!subject.startTime || !subject.endTime) return true;
    return parseInt(subject.startTime) < parseInt(subject.endTime);
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
        <h2>➕ ADD NEW SUBJECT</h2>
        <form onSubmit={handleSubmit}>
          {/* Subject Code */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '1.6rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Subject Code:
            </label>
            <input
              type="text"
              name="code"
              value={subject.code}
              onChange={(e) => setSubject({...subject, code: e.target.value.toUpperCase()})}
              placeholder="e.g., IT 221"
              style={{
                width: '100%',
                padding: '1rem',
                border: '4px solid black',
                fontSize: '1.6rem',
                fontWeight: 'bold'
              }}
              autoFocus
              required
            />
          </div>

          {/* Subject Name */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '1.6rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Subject Name:
            </label>
            <input
              type="text"
              name="name"
              value={subject.name}
              onChange={(e) => setSubject({...subject, name: e.target.value})}
              placeholder="e.g., Data Structures"
              style={{
                width: '100%',
                padding: '1rem',
                border: '4px solid black',
                fontSize: '1.6rem',
                fontWeight: 'bold'
              }}
              required
            />
          </div>

          {/* Units and Type */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '1.6rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Units:
              </label>
              <select
                value={subject.units}
                onChange={(e) => setSubject({...subject, units: parseInt(e.target.value)})}
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: '4px solid black',
                  fontSize: '1.6rem',
                  fontWeight: 'bold'
                }}
              >
                {[1,2,3,4,5].map(num => (
                  <option key={num} value={num}>{num} unit{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '1.6rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Type:
              </label>
              <select
                value={subject.type}
                onChange={(e) => setSubject({...subject, type: e.target.value})}
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: '4px solid black',
                  fontSize: '1.6rem',
                  fontWeight: 'bold'
                }}
              >
                <option value="core">Core IT</option>
                <option value="elective">Elective</option>
                <option value="gened">Gen Ed</option>
              </select>
            </div>
          </div>

          {/* SCHEDULE SECTION */}
          <div style={{ 
            border: '4px solid black', 
            padding: '1.5rem', 
            marginBottom: '1.5rem',
            background: '#f5f5f5'
          }}>
            <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
              ⏰ SCHEDULE (Optional)
            </h3>
            
            {/* Day Selector */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '1.6rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Day:
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {days.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSubject({...subject, day})}
                    style={{
                      padding: '1rem 1.5rem',
                      border: '4px solid black',
                      background: subject.day === day ? '#000' : '#fff',
                      color: subject.day === day ? '#fff' : '#000',
                      fontSize: '1.6rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      flex: '1',
                      minWidth: '70px'
                    }}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Pickers */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '1.6rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  Start:
                </label>
                <select
                  value={subject.startTime}
                  onChange={(e) => setSubject({...subject, startTime: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '4px solid black',
                    fontSize: '1.6rem',
                    fontWeight: 'bold'
                  }}
                >
                  {timeOptions.map(time => (
                    <option key={time} value={time}>{time}:00</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '1.6rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  End:
                </label>
                <select
                  value={subject.endTime}
                  onChange={(e) => setSubject({...subject, endTime: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '4px solid black',
                    fontSize: '1.6rem',
                    fontWeight: 'bold',
                    borderColor: !isTimeValid() ? '#ff4d4d' : 'black'
                  }}
                >
                  {timeOptions.map(time => (
                    <option key={time} value={time}>{time}:00</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Preview */}
            {subject.day && subject.startTime && subject.endTime && (
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                border: '3px solid black',
                background: '#fff',
                fontSize: '1.6rem',
                fontWeight: 'bold',
                textAlign: 'center'
              }}>
                📅 {subject.day} {subject.startTime}:00 - {subject.endTime}:00
                {!isTimeValid() && (
                  <span style={{ color: '#ff4d4d', display: 'block', marginTop: '0.5rem' }}>
                    ⚠️ Invalid time range!
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="modal-buttons">
            <button type="button" className="modal-btn" onClick={onCancel}>
              CANCEL
            </button>
            <button 
              type="submit" 
              className="modal-btn" 
              style={{ 
                background: '#000', 
                color: '#fff',
                opacity: !isTimeValid() ? 0.5 : 1
              }}
              disabled={!isTimeValid()}
            >
              SAVE SUBJECT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubjectForm;