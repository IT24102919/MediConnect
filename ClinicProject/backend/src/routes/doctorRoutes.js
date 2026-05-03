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
const Doctor = require('../models/Doctor');

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `doctor_${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

// Public routes
router.get('/', getAllDoctors);
router.get('/:id', getDoctor);

// Protected routes (admin only)
router.post('/', authMiddleware, createDoctor);
router.put('/:id', authMiddleware, updateDoctor);
router.delete('/:id', authMiddleware, deleteDoctor);

// Image upload route
router.post('/:id/upload-image', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    if (req.file) {
      doctor.image = `/uploads/${req.file.filename}`;
      await doctor.save();
    }

    res.json({
      success: true,
      image: doctor.image,
      imageUrl: doctor.image
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
