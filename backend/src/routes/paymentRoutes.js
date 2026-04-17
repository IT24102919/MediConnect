const express = require('express');
const router = express.Router();
const {
  createPayment,
  getAllPayments,
  getPayment,
  getPaymentsByPatient
} = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

// Protected routes (only for authenticated users)
router.post('/', authMiddleware, createPayment);
router.get('/patient/:patientId', authMiddleware, getPaymentsByPatient);
router.get('/', authMiddleware, getAllPayments);
router.get('/:id', authMiddleware, getPayment);

module.exports = router;
