const express = require('express');
const router = express.Router();
const {
  createPayment,
  getAllPayments,
  getPayment,
  getPaymentsByPatient,
  getPaymentByAppointment,
  updatePayment,
  deletePayment
} = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createPayment);
router.get('/', authMiddleware, getAllPayments);
router.get('/patient/:patientId', authMiddleware, getPaymentsByPatient);
router.get('/appointment/:appointmentId', authMiddleware, getPaymentByAppointment);
router.get('/:id', authMiddleware, getPayment);
router.put('/:id', authMiddleware, updatePayment);
router.delete('/:id', authMiddleware, deletePayment);

module.exports = router;
