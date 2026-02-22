import React, { useState } from 'react';

const TimeEditor = ({ days, timeSlots, onSave, onCancel }) => {
  const [editedDays, setEditedDays] = useState([...days]);
  const [editedTimeSlots, setEditedTimeSlots] = useState([...timeSlots]);
  const [newDay, setNewDay] = useState('');
  const [newTime, setNewTime] = useState('');

  const addDay = () => {
    if (newDay && !editedDays.includes(newDay)) {
      setEditedDays([...editedDays, newDay.toUpperCase()]);
      setNewDay('');
    }
  };

  const removeDay = (day) => {
    setEditedDays(editedDays.filter(d => d !== day));
  };

  const addTimeSlot = () => {
    if (newTime && !editedTimeSlots.includes(newTime)) {
      // Sort time slots
      const newSlots = [...editedTimeSlots, newTime];
      newSlots.sort((a, b) => {
        const hourA = parseInt(a.split(':')[0]);
        const hourB = parseInt(b.split(':')[0]);
        return hourA - hourB;
      });
      setEditedTimeSlots(newSlots);
      setNewTime('');
    }
  };

  const removeTimeSlot = (time) => {
    setEditedTimeSlots(editedTimeSlots.filter(t => t !== time));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <h2>⏰ EDIT TIME SLOTS & DAYS</h2>
        
        {/* DAYS SECTION */}
        <div style={{ marginBottom: '2rem', border: '4px solid black', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>DAYS OF WEEK</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            {editedDays.map(day => (
              <div key={day} style={{
                border: '3px solid black',
                padding: '0.8rem 1.5rem',
                fontSize: '1.6rem',
                fontWeight: 'bold',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                {day}
                <button 
                  onClick={() => removeDay(day)}
                  style={{
                    background: 'black',
                    color: 'white',
                    border: 'none',
                    width: '25px',
                    height: '25px',
                    fontSize: '1.6rem',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >×</button>
              </div>
            ))}
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={newDay}
              onChange={(e) => setNewDay(e.target.value)}
              placeholder="New day (e.g., SUN)"
              style={{
                flex: 1,
                padding: '1rem',
                border: '4px solid black',
                fontSize: '1.6rem',
                fontWeight: 'bold'
              }}
            />
            <button 
              onClick={addDay}
              style={{
                padding: '1rem 2rem',
                background: 'black',
                color: 'white',
                border: '4px solid black',
                fontSize: '1.6rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              ADD DAY
            </button>
          </div>
        </div>

        {/* TIME SLOTS SECTION */}
        <div style={{ marginBottom: '2rem', border: '4px solid black', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>TIME SLOTS</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            {editedTimeSlots.map(time => (
              <div key={time} style={{
                border: '3px solid black',
                padding: '0.8rem 1.5rem',
                fontSize: '1.6rem',
                fontWeight: 'bold',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                {time}
                <button 
                  onClick={() => removeTimeSlot(time)}
                  style={{
                    background: 'black',
                    color: 'white',
                    border: 'none',
                    width: '25px',
                    height: '25px',
                    fontSize: '1.6rem',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >×</button>
              </div>
            ))}
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              placeholder="New time (e.g., 20:00)"
              style={{
                flex: 1,
                padding: '1rem',
                border: '4px solid black',
                fontSize: '1.6rem',
                fontWeight: 'bold'
              }}
            />
            <button 
              onClick={addTimeSlot}
              style={{
                padding: '1rem 2rem',
                background: 'black',
                color: 'white',
                border: '4px solid black',
                fontSize: '1.6rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              ADD TIME
            </button>
          </div>
        </div>

        <div className="modal-buttons">
          <button className="modal-btn" onClick={onCancel}>
            CANCEL
          </button>
          <button 
            className="modal-btn" 
            style={{ background: '#000', color: '#fff' }}
            onClick={() => onSave(editedDays, editedTimeSlots)}
          >
            SAVE CHANGES
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeEditor;