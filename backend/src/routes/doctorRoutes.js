const express = require('express');
const router = express.Router();
const {
  createDoctor,
  getAllDoctors,
  getDoctor,
  updateDoctor,
  deleteDoctor
} = require('../controllers/doctorController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllDoctors);
router.get('/:id', getDoctor);

// Protected routes (admin only)
router.post('/', authMiddleware, createDoctor);
router.put('/:id', authMiddleware, updateDoctor);
router.delete('/:id', authMiddleware, deleteDoctor);

module.exports = router;
