// src/components/ConflictModal.js
import React from 'react';

const ConflictModal = ({ conflict, onForceAdd, onCancel }) => {
  if (!conflict) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>⚠️ SCHEDULE CONFLICT</h2>
        <p>
          <strong>{conflict.subject?.code || 'New subject'}</strong> conflicts with <br />
          <strong>{conflict.conflict?.code}</strong> on {conflict.day} at {conflict.startTime}:00
        </p>
        <div className="modal-buttons">
          <button className="modal-btn" onClick={onCancel}>
            CANCEL
          </button>
          <button className="modal-btn danger" onClick={onForceAdd}>
            FORCE ADD ANYWAY
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConflictModal;