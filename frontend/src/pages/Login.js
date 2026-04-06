import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      navigate(data.user.role === 'admin' ? '/admin' : '/employee');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <span className="brand-name">WorkSync</span>
        </div>
        <div className="auth-hero">
          <h1>Manage tasks,<br />not chaos.</h1>
          <p>A streamlined portal for teams to stay aligned, accountable, and on track.</p>
        </div>
        <div className="auth-features">
          <div className="feat"><span>→</span> Admin approves & assigns</div>
          <div className="feat"><span>→</span> Employees update progress</div>
          <div className="feat"><span>→</span> Real-time status tracking</div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Sign in</h2>
            <p>Enter your credentials to access your portal</p>
          </div>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} autoComplete="off" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} autoComplete="new-password" required />
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <button type="submit" className="btn-auth" disabled={loading}>
              {loading ? <span className="btn-spinner" /> : 'Continue →'}
            </button>
          </form>

          <p className="auth-switch">
            New employee? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
