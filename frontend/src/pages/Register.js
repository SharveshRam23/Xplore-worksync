import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const data = await register(form.name, form.email, form.password);
      setSuccess(data.message);
      setForm({ name: '', email: '', password: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
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
          <h1>Join your<br />team today.</h1>
          <p>Register as an employee and get started once your admin approves your account.</p>
        </div>
        <div className="auth-features">
          <div className="feat"><span>①</span> Fill in your details</div>
          <div className="feat"><span>②</span> Wait for admin approval</div>
          <div className="feat"><span>③</span> Log in and view your tasks</div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Create account</h2>
            <p>Employee registration — admin approval required</p>
          </div>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Jane Smith" required />
            </div>
            <div className="form-group">
              <label>Email address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="jane@company.com" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="min. 6 characters" required />
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <button type="submit" className="btn-auth" disabled={loading}>
              {loading ? <span className="btn-spinner" /> : 'Register →'}
            </button>
          </form>
          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
