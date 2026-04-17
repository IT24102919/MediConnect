const mongoose = require('mongoose');

// Define Payment Schema
const paymentSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: [true, 'Please provide appointment ID']
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide patient ID']
    },
    amount: {
      type: Number,
      required: [true, 'Please provide amount'],
      min: 0
    },
    paymentMethod: {
      type: String,
      required: [true, 'Please provide payment method'],
      trim: true,
      default: 'Credit Card'
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid'],
      default: 'Pending'
    },
    paidAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Index for finding payments by patient
paymentSchema.index({ patientId: 1 });
paymentSchema.index({ appointmentId: 1 });

// Create and export Payment model
module.exports = mongoose.model('Payment', paymentSchema);
