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
<<<<<<< HEAD
router.get('/patient/:patientId', authMiddleware, getPaymentsByPatient);
router.get('/', authMiddleware, getAllPayments);
=======
router.get('/', authMiddleware, getAllPayments);
router.get('/patient/:patientId', authMiddleware, getPaymentsByPatient);
>>>>>>> b97bb2a5578a6ebbe5b954f4ae073ee17dd94cae
router.get('/:id', authMiddleware, getPayment);

module.exports = router;
