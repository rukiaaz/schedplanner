// components/ScheduleGrid.js
import React from 'react';

const ScheduleGrid = ({ schedule, days, timeSlots, onRemoveItem }) => {
  const handleCellClick = (day, time) => {
    // This would open a modal to add subject
    console.log('Add subject to', day, time);
  };

  const getScheduleItem = (day, time) => {
    const hour = parseInt(time.split(':')[0]);
    return schedule.find(item => 
      item.day === day && 
      parseInt(item.startTime) <= hour && 
      parseInt(item.endTime) > hour
    );
  };

  return (
    <div className="schedule-grid-container">
      <div className="schedule-grid">
        {/* Header row */}
        <div className="grid-header">TIME</div>
        {days.map(day => (
          <div key={day} className="grid-header">{day}</div>
        ))}

        {/* Time rows */}
        {timeSlots.map(time => (
          <React.Fragment key={time}>
            <div className="time-slot">{time}</div>
            {days.map(day => {
              const item = getScheduleItem(day, time);
              return (
                <div 
                  key={`${day}-${time}`} 
                  className="grid-cell"
                  onClick={() => handleCellClick(day, time)}
                >
                  {item && (
                    <div 
                      className="schedule-item"
                      style={{ backgroundColor: item.color }}
                    >
                      <div className="remove-btn" onClick={(e) => {
                        e.stopPropagation();
                        onRemoveItem(item.id);
                      }}>×</div>
                      <strong>{item.code}</strong>
                      <div>{item.name}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ScheduleGrid;