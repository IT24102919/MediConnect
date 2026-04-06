const express = require('express');
const router = express.Router();
const {
  createSchedule,
  getAllSchedules,
  getScheduleByDoctor,
  updateSchedule,
  deleteSchedule
} = require('../controllers/scheduleController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllSchedules);
router.get('/doctor/:doctorId', getScheduleByDoctor);

// Protected routes
router.post('/', authMiddleware, createSchedule);
router.put('/:id', authMiddleware, updateSchedule);
router.delete('/:id', authMiddleware, deleteSchedule);

module.exports = router;
