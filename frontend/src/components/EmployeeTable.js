import React from 'react';
import './Table.css';

function Avatar({ name }) {
  const initials = name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  return <div className="table-avatar">{initials}</div>;
}

export default function EmployeeTable({ employees, onApprove, onRevoke }) {
  if (!employees.length) {
    return <div className="table-empty">No employee registrations yet.</div>;
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Email</th>
            <th>Registered</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp._id}>
              <td>
                <div className="name-cell">
                  <Avatar name={emp.name} />
                  <span>{emp.name}</span>
                </div>
              </td>
              <td className="muted">{emp.email}</td>
              <td className="muted">{new Date(emp.createdAt).toLocaleDateString()}</td>
              <td>
                <span className={`status-pill ${emp.isApproved ? 'approved' : 'pending'}`}>
                  <span className="dot" />
                  {emp.isApproved ? 'Approved' : 'Pending'}
                </span>
              </td>
              <td>
                <div className="action-btns">
                  {!emp.isApproved ? (
                    <button className="btn-action success" onClick={() => onApprove(emp._id)}>Approve</button>
                  ) : (
                    <button className="btn-action danger" onClick={() => onRevoke(emp._id)}>Revoke</button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
