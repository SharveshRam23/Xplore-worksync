import React from 'react';
import './StatCard.css';

const colorMap = {
  accent: { bg: 'var(--accent-bg)', text: 'var(--accent)', border: 'rgba(37,99,235,0.15)' },
  warning: { bg: 'var(--warning-bg)', text: 'var(--warning)', border: 'rgba(217,119,6,0.2)' },
  success: { bg: 'var(--success-bg)', text: 'var(--success)', border: 'rgba(22,163,74,0.2)' },
  purple: { bg: 'var(--purple-bg)', text: 'var(--purple)', border: 'rgba(124,58,237,0.2)' },
};

export default function StatCard({ label, value, color = 'accent' }) {
  const c = colorMap[color];
  return (
    <div className="stat-card" style={{ background: c.bg, borderColor: c.border }}>
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={{ color: c.text }}>{value}</div>
    </div>
  );
}
