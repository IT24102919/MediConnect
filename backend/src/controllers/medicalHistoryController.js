const MedicalHistory = require('../models/MedicalHistory');

const normalizeStringArray = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter((item) => item.length > 0);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  return [];
};

const getMedicalHistory = async (req, res) => {
  try {
    const patientId = req.params.patientId || req.user.id;

    const medicalHistory = await MedicalHistory.findOne({ patientId });

    if (!medicalHistory) {
      return res.status(200).json({
        success: true,
        medicalHistory: {
          patientId,
          bloodGroup: '',
          allergies: [],
          chronicConditions: [],
          currentMedications: [],
          surgeries: [],
          familyHistory: '',
          notes: ''
        }
      });
    }

    res.status(200).json({
      success: true,
      medicalHistory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const upsertMedicalHistory = async (req, res) => {
  try {
    const patientId = req.params.patientId || req.user.id;

    const payload = {
      bloodGroup: (req.body.bloodGroup || '').trim(),
      allergies: normalizeStringArray(req.body.allergies),
      chronicConditions: normalizeStringArray(req.body.chronicConditions),
      currentMedications: normalizeStringArray(req.body.currentMedications),
      surgeries: normalizeStringArray(req.body.surgeries),
      familyHistory: (req.body.familyHistory || '').trim(),
      notes: (req.body.notes || '').trim()
    };

    const medicalHistory = await MedicalHistory.findOneAndUpdate(
      { patientId },
      { $set: payload },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Medical history saved successfully',
      medicalHistory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getMedicalHistory,
  upsertMedicalHistory
};