// App.js - V3 Complete Schedule Planner
import React, { useState, useEffect } from 'react';
import './App.css';
import ScheduleGrid from './components/ScheduleGrid';
import SubjectList from './components/SubjectList';
import ExportButtons from './components/ExportButtons';
import ConflictModal from './components/ConflictModal';
import AddSubjectForm from './components/AddSubjectForm';
import TimeEditor from './components/TimeEditor';
import SemesterManager from './components/SemesterManager';

function App() {
  // State Management
  const [subjects, setSubjects] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [currentConflict, setCurrentConflict] = useState(null);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [showTimeEditor, setShowTimeEditor] = useState(false);
  const [showSemesterManager, setShowSemesterManager] = useState(false);
  const [currentSemester, setCurrentSemester] = useState('2nd Sem 2024-2025');

  // Days and time slots - editable
  const [days, setDays] = useState(['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']);
  const [timeSlots, setTimeSlots] = useState([
    '7:00', '8:00', '9:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ]);

  // Load from localStorage on startup
  useEffect(() => {
    const savedSubjects = localStorage.getItem('subjects');
    const savedSchedule = localStorage.getItem('schedule');
    const savedDays = localStorage.getItem('days');
    const savedTimeSlots = localStorage.getItem('timeSlots');
    const savedSemester = localStorage.getItem('currentSemester');

    if (savedSubjects) setSubjects(JSON.parse(savedSubjects));
    if (savedSchedule) setSchedule(JSON.parse(savedSchedule));
    if (savedDays) setDays(JSON.parse(savedDays));
    if (savedTimeSlots) setTimeSlots(JSON.parse(savedTimeSlots));
    if (savedSemester) setCurrentSemester(savedSemester);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('subjects', JSON.stringify(subjects));
    localStorage.setItem('schedule', JSON.stringify(schedule));
    localStorage.setItem('days', JSON.stringify(days));
    localStorage.setItem('timeSlots', JSON.stringify(timeSlots));
    localStorage.setItem('currentSemester', currentSemester);
  }, [subjects, schedule, days, timeSlots, currentSemester]);

  // Check for conflicts when schedule changes
  useEffect(() => {
    const newConflicts = [];
    
    for (let i = 0; i < schedule.length; i++) {
      for (let j = i + 1; j < schedule.length; j++) {
        const a = schedule[i];
        const b = schedule[j];
        
        if (a.day === b.day) {
          const aStart = parseInt(a.startTime);
          const aEnd = parseInt(a.endTime);
          const bStart = parseInt(b.startTime);
          const bEnd = parseInt(b.endTime);
          
          if ((aStart < bEnd && aEnd > bStart)) {
            newConflicts.push({
              subject1: a,
              subject2: b,
              message: `${a.code} and ${b.code} overlap on ${a.day}`
            });
          }
        }
      }
    }
    
    setConflicts(newConflicts);
  }, [schedule]);

  // Add new subject with optional schedule
  const addSubject = (newSubject) => {
    const subjectWithId = {
      ...newSubject,
      id: Date.now(),
      color: getRandomColor()
    };
    
    setSubjects([...subjects, subjectWithId]);
    
    // If schedule info was provided, add to schedule
    if (newSubject.day && newSubject.startTime && newSubject.endTime) {
      // Validate time
      if (parseInt(newSubject.startTime) >= parseInt(newSubject.endTime)) {
        alert('❌ Invalid time range! Subject saved but not scheduled.');
        setShowAddSubject(false);
        return;
      }

      // Check for conflicts
      const conflict = schedule.find(s => 
        s.day === newSubject.day && 
        ((parseInt(newSubject.startTime) < parseInt(s.endTime) && 
          parseInt(newSubject.endTime) > parseInt(s.startTime)))
      );

      if (conflict) {
        setCurrentConflict({
          subject: subjectWithId,
          conflict,
          day: newSubject.day,
          startTime: newSubject.startTime,
          endTime: newSubject.endTime
        });
        setShowConflictModal(true);
      } else {
        // No conflict, add to schedule
        const newScheduleItem = {
          id: Date.now() + 1,
          subjectId: subjectWithId.id,
          ...subjectWithId,
          day: newSubject.day,
          startTime: newSubject.startTime,
          endTime: newSubject.endTime
        };
        setSchedule([...schedule, newScheduleItem]);
      }
    }
    
    setShowAddSubject(false);
  };

  // Delete subject
  const deleteSubject = (subjectId) => {
    setSubjects(subjects.filter(s => s.id !== subjectId));
    setSchedule(schedule.filter(s => s.subjectId !== subjectId));
  };

  // Edit subject
  const editSubject = (updatedSubject) => {
    setSubjects(subjects.map(s => 
      s.id === updatedSubject.id ? updatedSubject : s
    ));
    // Update schedule entries for this subject
    setSchedule(schedule.map(s => 
      s.subjectId === updatedSubject.id 
        ? { ...s, ...updatedSubject, color: s.color } 
        : s
    ));
  };

  // Add to schedule manually
  const addToSchedule = (subject, day, startTime, endTime) => {
    // Validate times
    if (parseInt(startTime) >= parseInt(endTime)) {
      alert('❌ End time must be after start time!');
      return false;
    }

    // Check for conflict
    const conflict = schedule.find(s => 
      s.day === day && 
      ((parseInt(startTime) < parseInt(s.endTime) && 
        parseInt(endTime) > parseInt(s.startTime)))
    );

    if (conflict) {
      setCurrentConflict({
        subject,
        conflict,
        day,
        startTime,
        endTime
      });
      setShowConflictModal(true);
      return false;
    }

    const newScheduleItem = {
      id: Date.now(),
      subjectId: subject.id,
      ...subject,
      day,
      startTime,
      endTime
    };
    
    setSchedule([...schedule, newScheduleItem]);
    return true;
  };

  // Remove from schedule
  const removeFromSchedule = (id) => {
    setSchedule(schedule.filter(item => item.id !== id));
  };

  // Force add despite conflict
  const forceAddDespiteConflict = () => {
    if (currentConflict) {
      const newScheduleItem = {
        id: Date.now(),
        subjectId: currentConflict.subject.id,
        ...currentConflict.subject,
        day: currentConflict.day,
        startTime: currentConflict.startTime,
        endTime: currentConflict.endTime
      };
      setSchedule([...schedule, newScheduleItem]);
      setShowConflictModal(false);
      setCurrentConflict(null);
    }
  };

  // Get random color for subject
  const getRandomColor = () => {
    const colors = ['#ff4d4d', '#2e7dff', '#ffb443', '#00cc99', '#cc66ff', '#ff9933'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Clear all schedule
  const clearSchedule = () => {
    if (window.confirm('Clear ALL schedule items?')) {
      setSchedule([]);
    }
  };

  // Reset all data
  const resetAllData = () => {
    if (window.confirm('⚠️ Reset ALL data? This will delete everything!')) {
      setSubjects([]);
      setSchedule([]);
      setDays(['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']);
      setTimeSlots([
        '7:00', '8:00', '9:00', '10:00', '11:00', '12:00',
        '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
      ]);
    }
  };

  return (
    <div className="brutal-container">
      {/* HEADER */}
      <header className="brutal-header">
        <div className="logo">
          <h1>USC<br />SCHEDULE<br />V3</h1>
          <p>{currentSemester}</p>
        </div>
        <div className="header-stats">
          <div className="stat-block">
            <span className="stat-number">{subjects.length}</span>
            <span className="stat-label">SUBJECTS</span>
          </div>
          <div className="stat-block">
            <span className="stat-number">{schedule.length}</span>
            <span className="stat-label">SCHEDULED</span>
          </div>
          <div className="stat-block" style={{ background: conflicts.length > 0 ? '#ff4d4d' : '#fff' }}>
            <span className="stat-number">{conflicts.length}</span>
            <span className="stat-label">CONFLICTS</span>
          </div>
        </div>
      </header>

      {/* ACTION BUTTONS */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button className="action-btn" onClick={() => setShowAddSubject(true)}>
          ➕ ADD SUBJECT
        </button>
        <button className="action-btn" onClick={() => setShowTimeEditor(true)}>
          ⏰ EDIT TIMES
        </button>
        <button className="action-btn" onClick={() => setShowSemesterManager(true)}>
          📚 SEMESTERS
        </button>
        <button className="action-btn" onClick={clearSchedule}>
          🗑️ CLEAR SCHEDULE
        </button>
        <button className="action-btn danger" onClick={resetAllData}>
          ⚠️ RESET ALL
        </button>
      </div>

      {/* EXPORT BUTTONS */}
      <ExportButtons 
        schedule={schedule} 
        days={days} 
        timeSlots={timeSlots} 
        semester={currentSemester}
      />

      {/* MAIN CONTENT */}
      <div className="main-content">
        {/* SUBJECT LIST */}
        <SubjectList 
          subjects={subjects} 
          onAddToSchedule={addToSchedule}
          onDeleteSubject={deleteSubject}
          onEditSubject={editSubject}
        />

        {/* SCHEDULE GRID */}
        <ScheduleGrid 
          schedule={schedule}
          days={days}
          timeSlots={timeSlots}
          onRemoveItem={removeFromSchedule}
          subjects={subjects}
        />
      </div>

      {/* FOOTER */}
      <footer className="brutal-footer">
        <div className="footer-links">
          <a href="#" onClick={(e) => { e.preventDefault(); setShowAddSubject(true); }}>ADD</a>
          <a href="#" onClick={(e) => { e.preventDefault(); setShowTimeEditor(true); }}>TIMES</a>
          <a href="#" onClick={(e) => { e.preventDefault(); clearSchedule(); }}>CLEAR</a>
        </div>
        <div className="copyright">
          USC SCHEDULE PLANNER · V3 · {new Date().getFullYear()}
        </div>
      </footer>

      {/* MODALS */}
      {showConflictModal && (
        <ConflictModal 
          conflict={currentConflict}
          onForceAdd={forceAddDespiteConflict}
          onCancel={() => setShowConflictModal(false)}
        />
      )}

      {showAddSubject && (
        <AddSubjectForm 
          onSave={addSubject}
          onCancel={() => setShowAddSubject(false)}
          days={days}
        />
      )}

      {showTimeEditor && (
        <TimeEditor 
          days={days}
          timeSlots={timeSlots}
          onSave={(newDays, newTimeSlots) => {
            setDays(newDays);
            setTimeSlots(newTimeSlots);
            setShowTimeEditor(false);
          }}
          onCancel={() => setShowTimeEditor(false)}
        />
      )}

      {showSemesterManager && (
        <SemesterManager
          currentSemester={currentSemester}
          onSelectSemester={setCurrentSemester}
          onClose={() => setShowSemesterManager(false)}
        />
      )}
    </div>
  );
}

export default App;