import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import TaskCard from '../components/TaskCard';
import './Dashboard.css';

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({});
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchData = useCallback(async () => {
    try {
      const [taskRes, statsRes] = await Promise.all([
        api.get('/employee/tasks'),
        api.get('/employee/stats'),
      ]);
      setTasks(taskRes.data);
      setStats(statsRes.data);
    } catch {
      notify('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const updateStatus = async (taskId, status) => {
    try {
      await api.patch(`/employee/tasks/${taskId}/status`, { status });
      notify(`Status updated to "${status}"`);
      fetchData();
    } catch (err) {
      notify(err.response?.data?.message || 'Update failed');
    }
  };

  const filtered = filter === 'All' ? tasks : tasks.filter(t => t.status === filter);
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="dashboard">
      <Navbar role="employee" name={user?.name} />
      {toast && <div className="toast">{toast}</div>}

      <div className="dash-content">
        <div className="dash-header">
          <div>
            <h1 className="dash-title">My Tasks</h1>
            <p className="dash-sub">Track and update your assigned work</p>
          </div>
          <div className="emp-avatar">{initials}</div>
        </div>

        {loading ? (
          <div className="loading-area">Loading your tasks...</div>
        ) : (
          <>
            <div className="stats-row">
              <StatCard label="Total Tasks" value={stats.total || 0} color="accent" />
              <StatCard label="Pending" value={stats.pending || 0} color="warning" />
              <StatCard label="In Progress" value={stats.inProgress || 0} color="purple" />
              <StatCard label="Completed" value={stats.completed || 0} color="success" />
            </div>

            <div className="filter-bar">
              {['All', 'Pending', 'In Progress', 'Completed'].map(f => (
                <button
                  key={f}
                  className={`filter-btn ${filter === f ? 'active' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">✓</div>
                <div className="empty-title">
                  {filter === 'All' ? 'No tasks assigned yet' : `No ${filter} tasks`}
                </div>
                <div className="empty-sub">Check back later or contact your admin</div>
              </div>
            ) : (
              <div className="task-grid">
                {filtered.map(task => (
                  <TaskCard key={task._id} task={task} onStatusChange={updateStatus} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
