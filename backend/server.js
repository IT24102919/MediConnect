// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

// Import database configuration
const connectDB = require('./src/config/db');
const seedDoctors = require('./src/utils/seedDoctors');

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const doctorRoutes = require('./src/routes/doctorRoutes');
const scheduleRoutes = require('./src/routes/scheduleRoutes');
const appointmentRoutes = require('./src/routes/appointmentRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const feedbackRoutes = require('./src/routes/feedbackRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');
const medicalHistoryRoutes = require('./src/routes/medicalHistoryRoutes');

// Import middleware
const errorMiddleware = require('./src/middleware/errorMiddleware');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/medical-history', medicalHistoryRoutes);

// Simple DB test route
app.get('/api/test-db', (req, res) => {
  res.json({
    message: 'Database connected successfully'
  });
});

// Welcome route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Clinic Appointment Backend API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      doctors: '/api/doctors',
      schedules: '/api/schedules',
      appointments: '/api/appointments',
      payments: '/api/payments',
      feedbacks: '/api/feedbacks',
      upload: '/api/upload',
      medicalHistory: '/api/medical-history'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware (must be last)
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

// Start server after successful database connection
const startServer = async () => {
  await connectDB();
  await seedDoctors();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API Documentation: http://localhost:${PORT}`);
  });
};

startServer();
