require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const User = require('./models/User');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: ['https://xplore-worksync.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/employee', require('./routes/employee'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'TaskFlow API running' }));

// Seed default admin on startup (idempotent)
const seedAdmin = async () => {
  try {
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      await User.create({
        name: 'Admin',
        email: 'admin@worksync.com',
        password: 'admin123',
        role: 'admin',
        isApproved: true,
      });
      console.log('Default admin created → email: admin@worksync.com | password: admin123');
    }
  } catch (err) {
    console.error('Admin seed error:', err.message);
  }
};
seedAdmin();

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
