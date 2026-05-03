const mongoose = require('mongoose');

// Define Appointment Schema
const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide patient ID']
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'Please provide doctor ID']
    },
    patientName: {
      type: String,
      required: [true, 'Please provide patient name']
    },
    appointmentDate: {
      type: Date,
      required: [true, 'Please provide appointment date']
    },
    timeSlot: {
      type: String,
      required: [true, 'Please provide time slot']
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Cancelled'],
      default: 'Pending'
    },
    symptoms: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Index for finding appointments by patient
appointmentSchema.index({ patientId: 1 });
appointmentSchema.index({ doctorId: 1 });
appointmentSchema.index({ appointmentDate: 1 });

// Create and export Appointment model
module.exports = mongoose.model('Appointment', appointmentSchema);
