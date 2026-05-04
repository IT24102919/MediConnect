const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAllAppointments,
  getAppointment,
  getAppointmentsByPatient,
  getAppointmentRecordsByPatient,
  getAppointmentsByDoctor,
  updateAppointment,
  deleteAppointment
} = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');

// Protected routes (only for authenticated users)
router.post('/', authMiddleware, createAppointment);
router.get('/', authMiddleware, getAllAppointments);
router.get('/patient/:patientId/records', authMiddleware, getAppointmentRecordsByPatient);
router.get('/patient/:patientId', authMiddleware, getAppointmentsByPatient);
router.get('/doctor/:doctorId', authMiddleware, getAppointmentsByDoctor);
router.get('/:id', authMiddleware, getAppointment);
router.put('/:id', authMiddleware, updateAppointment);
router.delete('/:id', authMiddleware, deleteAppointment);

module.exports = router;
