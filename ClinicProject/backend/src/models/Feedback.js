const mongoose = require('mongoose');

// Define Feedback Schema
const feedbackSchema = new mongoose.Schema(
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
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment'
    },
    rating: {
      type: Number,
      required: [true, 'Please provide rating'],
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: [true, 'Please provide a comment'],
      trim: true,
      minlength: [10, 'Comment must be at least 10 characters long']
    }
  },
  {
    timestamps: true
  }
);

// Index for finding feedbacks by doctor
feedbackSchema.index({ doctorId: 1 });
feedbackSchema.index({ patientId: 1 });

// Create and export Feedback model
module.exports = mongoose.model('Feedback', feedbackSchema);
