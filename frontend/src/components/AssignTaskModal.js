import React, { useState } from 'react';
import api from '../utils/api';
import './Modal.css';

export default function AssignTaskModal({ employees, onClose, onSuccess }) {
  const [form, setForm] = useState({ title: '', description: '', assignedTo: '', dueDate: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title || !form.assignedTo) { setError('Title and assignee are required'); return; }
    setLoading(true);
    try {
      await api.post('/admin/tasks', form);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <h3>Assign New Task</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Task Title *</label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Write API documentation" required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Optional task details..." rows={3} />
          </div>
          <div className="form-group">
            <label>Assign To *</label>
            <select name="assignedTo" value={form.assignedTo} onChange={handleChange} required>
              <option value="">Select employee...</option>
              {employees.map(emp => (
                <option key={emp._id} value={emp._id}>{emp.name} ({emp.email})</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Due Date</label>
            <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} min={new Date().toISOString().split('T')[0]} />
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <div className="modal-actions">
            <button type="submit" className="btn-modal-primary" disabled={loading}>
              {loading ? 'Assigning...' : 'Assign Task'}
            </button>
            <button type="button" className="btn-modal-cancel" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
