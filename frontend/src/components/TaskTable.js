import React from 'react';
import './Table.css';

const STATUS_CLASSES = { 'Pending': 'pending', 'In Progress': 'progress', 'Completed': 'approved' };

export default function TaskTable({ tasks, onDelete, isAdmin }) {
  if (!tasks.length) {
    return <div className="table-empty">No tasks assigned yet. Click "+ Assign Task" to get started.</div>;
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Task</th>
            {isAdmin && <th>Assigned To</th>}
            <th>Due Date</th>
            <th>Status</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task._id}>
              <td>
                <div className="task-title-cell">{task.title}</div>
                {task.description && <div className="task-desc-cell">{task.description}</div>}
              </td>
              {isAdmin && (
                <td>
                  <div className="name-cell">
                    <div className="table-avatar sm">
                      {task.assignedTo?.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <span>{task.assignedTo?.name || '—'}</span>
                  </div>
                </td>
              )}
              <td className="muted">
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
              </td>
              <td>
                <span className={`status-pill ${STATUS_CLASSES[task.status]}`}>
                  <span className="dot" />
                  {task.status}
                </span>
              </td>
              {isAdmin && (
                <td>
                  <button className="btn-action danger" onClick={() => onDelete(task._id)}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
