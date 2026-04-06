import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import EmployeeTable from '../components/EmployeeTable';
import TaskTable from '../components/TaskTable';
import AssignTaskModal from '../components/AssignTaskModal';
import './Dashboard.css';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('employees');
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchData = useCallback(async () => {
    try {
      const [empRes, taskRes, statsRes] = await Promise.all([
        api.get('/admin/employees'),
        api.get('/admin/tasks'),
        api.get('/admin/stats'),
      ]);
      setEmployees(empRes.data);
      setTasks(taskRes.data);
      setStats(statsRes.data);
    } catch (err) {
      notify('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const approveEmployee = async (id) => {
    try {
      const { data } = await api.patch(`/admin/employees/${id}/approve`);
      notify(data.message);
      fetchData();
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to approve');
    }
  };

  const revokeEmployee = async (id) => {
    try {
      const { data } = await api.patch(`/admin/employees/${id}/revoke`);
      notify(data.message);
      fetchData();
    } catch (err) {
      notify('Failed to revoke access');
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/admin/tasks/${id}`);
      notify('Task deleted');
      fetchData();
    } catch {
      notify('Failed to delete task');
    }
  };

  const onTaskAssigned = () => {
    setShowModal(false);
    fetchData();
    notify('Task assigned successfully');
  };

  return (
    <div className="dashboard">
      <Navbar role="admin" name={user?.name} />
      {toast && <div className="toast">{toast}</div>}

      <div className="dash-content">
        <div className="dash-header">
          <div>
            <h1 className="dash-title">Admin Dashboard</h1>
            <p className="dash-sub">Manage employees and assign tasks</p>
          </div>
        </div>

        {loading ? (
          <div className="loading-area">Loading...</div>
        ) : (
          <>
            <div className="stats-row">
              <StatCard label="Total Employees" value={stats.totalEmployees || 0} color="accent" />
              <StatCard label="Pending Approval" value={stats.pendingApproval || 0} color="warning" />
              <StatCard label="Total Tasks" value={stats.totalTasks || 0} color="purple" />
              <StatCard label="Completed" value={stats.Completed || 0} color="success" />
            </div>

            <div className="tabs-bar">
              <button className={`tab ${activeTab === 'employees' ? 'active' : ''}`} onClick={() => setActiveTab('employees')}>
                Employees <span className="tab-count">{employees.length}</span>
              </button>
              <button className={`tab ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => setActiveTab('tasks')}>
                Tasks <span className="tab-count">{tasks.length}</span>
              </button>
            </div>

            {activeTab === 'employees' && (
              <EmployeeTable
                employees={employees}
                onApprove={approveEmployee}
                onRevoke={revokeEmployee}
              />
            )}

            {activeTab === 'tasks' && (
              <>
                <div className="section-actions">
                  <button className="btn-primary" onClick={() => setShowModal(true)}>+ Assign Task</button>
                </div>
                <TaskTable tasks={tasks} onDelete={deleteTask} isAdmin />
              </>
            )}
          </>
        )}
      </div>

      {showModal && (
        <AssignTaskModal
          employees={employees.filter(e => e.isApproved)}
          onClose={() => setShowModal(false)}
          onSuccess={onTaskAssigned}
        />
      )}
    </div>
  );
}
