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
<<<<<<< HEAD
      required: [true, 'Please provide payment method'],
      trim: true,
      default: 'Credit Card'
=======
      enum: ['Card'],
      default: 'Card'
    },
    cardBrand: {
      type: String,
      trim: true,
      default: ''
    },
    cardLast4: {
      type: String,
      trim: true,
      minlength: 4,
      maxlength: 4,
      default: ''
    },
    cardholderName: {
      type: String,
      trim: true,
      default: ''
    },
    transactionId: {
      type: String,
      trim: true,
      default: ''
>>>>>>> b97bb2a5578a6ebbe5b954f4ae073ee17dd94cae
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
