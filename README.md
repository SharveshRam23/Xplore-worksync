# TaskFlow — MERN Stack Task Management App

A full-stack MERN application with Admin and Employee portals.

## Project Structure
```
taskflow/
├── backend/          → Express.js + MongoDB API
└── frontend/         → React.js SPA
```

## Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas URI)

---

### 1. Backend Setup
```bash
cd backend
npm install
# Edit .env if needed (default: localhost MongoDB)
npm run dev
```
Server starts at: http://localhost:5000

**Default Admin credentials (auto-seeded):**
- Email: `admin@taskflow.com`
- Password: `admin123`

---

### 2. Frontend Setup
```bash
cd frontend
npm install
npm start
```
App opens at: http://localhost:3000

---

## Features

### Admin Portal
- Login with pre-seeded credentials
- View all employee registrations
- Approve / Revoke employee access
- Assign tasks with title, description, assignee, and due date
- View all tasks with status and assignee info
- Dashboard stats (total employees, pending approvals, tasks)

### Employee Portal
- Self-registration (requires admin approval to login)
- View only their own assigned tasks
- Filter tasks by status
- Update task status: Pending → In Progress → Completed
- Personal stats dashboard

## API Endpoints

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | /api/auth/register | Public | Employee registration |
| POST | /api/auth/login | Public | Login (admin/employee) |
| GET | /api/auth/me | Private | Get current user |
| GET | /api/admin/employees | Admin | List all employees |
| PATCH | /api/admin/employees/:id/approve | Admin | Approve employee |
| PATCH | /api/admin/employees/:id/revoke | Admin | Revoke access |
| POST | /api/admin/tasks | Admin | Assign task |
| GET | /api/admin/tasks | Admin | All tasks |
| DELETE | /api/admin/tasks/:id | Admin | Delete task |
| GET | /api/admin/stats | Admin | Dashboard stats |
| GET | /api/employee/tasks | Employee | My tasks |
| PATCH | /api/employee/tasks/:id/status | Employee | Update task status |
| GET | /api/employee/stats | Employee | My task stats |

## Tech Stack
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs
- **Frontend:** React 18, React Router v6, Axios, CSS Modules
