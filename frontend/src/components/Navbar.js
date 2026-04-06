import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar({ role, name }) {
  const { logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <div className="nav-brand">
          <span className="nav-logo">WorkSync</span>
        </div>
        <div className="nav-right">
          <span className={`role-badge ${role}`}>{role === 'admin' ? 'Admin' : 'Employee'}</span>
          <span className="nav-name">{name}</span>
          <button className="btn-logout" onClick={logout}>Sign out</button>
        </div>
      </div>
    </nav>
  );
}
