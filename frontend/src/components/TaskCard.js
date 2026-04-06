import React from 'react';
import './TaskCard.css';

const STATUS_OPTIONS = ['Pending', 'In Progress', 'Completed'];

const STATUS_CLASSES = {
  'Pending': 'pending',
  'In Progress': 'progress',
  'Completed': 'completed',
};

export default function TaskCard({ task, onStatusChange }) {
  const statusClass = STATUS_CLASSES[task.status];
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Completed';

  return (
    <div className={`task-card ${task.status === 'Completed' ? 'done' : ''}`}>
      <div className="tc-header">
        <span className={`tc-status ${statusClass}`}>
          <span className="tc-dot" />
          {task.status}
        </span>
        {isOverdue && <span className="tc-overdue">Overdue</span>}
      </div>

      <div className="tc-title">{task.title}</div>

      {task.description && (
        <div className="tc-desc">{task.description}</div>
      )}

      <div className="tc-meta">
        {task.dueDate && (
          <div className={`tc-due ${isOverdue ? 'overdue' : ''}`}>
            Due {new Date(task.dueDate).toLocaleDateString()}
          </div>
        )}
        {task.assignedBy && (
          <div className="tc-by">Assigned by {task.assignedBy.name}</div>
        )}
      </div>

      <div className="tc-footer">
        <label className="tc-select-label">Update status</label>
        <select
          className="tc-select"
          value={task.status}
          onChange={e => onStatusChange(task._id, e.target.value)}
        >
          {STATUS_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
