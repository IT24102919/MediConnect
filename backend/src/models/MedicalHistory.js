const mongoose = require('mongoose');

const medicalHistorySchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide patient ID'],
      unique: true
    },
    bloodGroup: {
      type: String,
      trim: true,
      default: ''
    },
    allergies: {
      type: [String],
      default: []
    },
    chronicConditions: {
      type: [String],
      default: []
    },
    currentMedications: {
      type: [String],
      default: []
    },
    surgeries: {
      type: [String],
      default: []
    },
    familyHistory: {
      type: String,
      trim: true,
      default: ''
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('MedicalHistory', medicalHistorySchema);
