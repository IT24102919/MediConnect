require("dotenv").config({ path: require("path").resolve(__dirname, ".env") });

const express = require('express');
const cors = require('cors');
const path = require('path');

const connectDB = require('./src/config/db');
const seedDoctors = require('./src/utils/seedDoctors');

const authRoutes = require('./src/routes/authRoutes');
const doctorRoutes = require('./src/routes/doctorRoutes');
const scheduleRoutes = require('./src/routes/scheduleRoutes');
const appointmentRoutes = require('./src/routes/appointmentRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const feedbackRoutes = require('./src/routes/feedbackRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');
const medicalHistoryRoutes = require('./src/routes/medicalHistoryRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');

const errorMiddleware = require('./src/middleware/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/medical-history', medicalHistoryRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/api/test-db', (req, res) => {
  res.json({
    message: 'Database connected successfully'
  });
});

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
      medicalHistory: '/api/medical-history',
      notifications: '/api/notifications'
    }
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log('MONGO_URI LOADED:', process.env.MONGO_URI ? 'YES' : 'NO');

    await connectDB();
    await seedDoctors();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup error:', error.message);
    process.exit(1);
  }
};

startServer();
