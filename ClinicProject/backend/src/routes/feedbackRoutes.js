const express = require('express');
const router = express.Router();
const {
  createFeedback,
  getAllFeedbacks,
  getFeedbacksByDoctor,
  updateFeedback,
  deleteFeedback
} = require('../controllers/feedbackController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllFeedbacks);
router.get('/doctor/:doctorId', getFeedbacksByDoctor);

// Protected routes
router.post('/', authMiddleware, createFeedback);
router.put('/:id', authMiddleware, updateFeedback);
router.delete('/:id', authMiddleware, deleteFeedback);

module.exports = router;
