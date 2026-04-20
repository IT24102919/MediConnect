const mongoose = require('mongoose');

// Define Doctor Schema
const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      unique: true,  // One doctor per user
      sparse: true   // Allow null for existing doctors
    },
    name: {
      type: String,
      required: [true, 'Please provide doctor name'],
      trim: true
    },
    specialization: {
      type: String,
      required: [true, 'Please provide specialization'],
      enum: [
        'Cardiologist',
        'Dermatologist',
        'Neurologist',
        'Orthopedic',
        'Orthopedic Surgeon',
        'ENT Specialist',
        'Gynecologist',
        'Endocrinologist',
        'Dentist',
        'General Practitioner',
        'Pediatrician',
        'Psychiatrist',
        'Other'
      ]
    },
    hospital: {
      type: String,
      required: [true, 'Please provide hospital name'],
      trim: true
    },
    experience: {
      type: Number,
      required: [true, 'Please provide experience in years'],
      min: 0
    },
    fee: {
      type: Number,
      required: [true, 'Please provide consultation fee'],
      min: 0
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    description: {
      type: String,
      trim: true
    },
    image: {
      type: String,
      default: null
    },
    available: {
      type: Boolean,
      default: true
    },
    phone: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Create and export Doctor model
module.exports = mongoose.model('Doctor', doctorSchema);
