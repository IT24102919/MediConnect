const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getMedicalHistory,
  upsertMedicalHistory
} = require('../controllers/medicalHistoryController');

router.get('/me', authMiddleware, getMedicalHistory);
router.put('/me', authMiddleware, upsertMedicalHistory);

module.exports = router;