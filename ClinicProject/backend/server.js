const express = require('express');
const cors = require('cors');
const path = require('path');

const envPath = process.env.ENV_FILE || path.resolve(__dirname, '.env');
require('dotenv').config({ path: envPath });

if (!process.env.MONGO_URI && process.env.MONGODB_URI) {
  process.env.MONGO_URI = process.env.MONGODB_URI;
}

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

const { isDatabaseConnected, requireDatabase } = require('./src/middleware/dbMiddleware');
const errorMiddleware = require('./src/middleware/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    api: 'running',
    database: isDatabaseConnected() ? 'connected' : 'disconnected'
  });
});

app.use('/api/auth', requireDatabase, authRoutes);
app.use('/api/doctors', requireDatabase, doctorRoutes);
app.use('/api/schedules', requireDatabase, scheduleRoutes);
app.use('/api/appointments', requireDatabase, appointmentRoutes);
app.use('/api/payments', requireDatabase, paymentRoutes);
app.use('/api/feedbacks', requireDatabase, feedbackRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/medical-history', requireDatabase, medicalHistoryRoutes);
app.use('/api/notifications', requireDatabase, notificationRoutes);

app.get('/api/test-db', (req, res) => {
  res.json({
    success: isDatabaseConnected(),
    database: isDatabaseConnected() ? 'connected' : 'disconnected'
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

app.use((error, req, res, next) => {
  if (error.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      message: 'Image is too large. Please choose a smaller file.'
    });
  }

  return next(error);
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log('MONGO_URI LOADED:', process.env.MONGO_URI ? 'YES' : 'NO');

    await connectDB();
    
    try {
      await seedDoctors();
    } catch (seedError) {
      console.log('⚠️ Skipping doctor seeding due to database connection issues.');
    }

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Stop the other server or start this backend with a different PORT.`);
        process.exit(1);
      }

      throw error;
    });
  } catch (error) {
    console.error('Server startup error:', error.message);
    process.exit(1);
  }
};

startServer();
