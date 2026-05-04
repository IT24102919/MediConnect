const mongoose = require('mongoose');

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
      min: [0, 'Amount cannot be negative']
    },
    paymentMethod: {
      type: String,
      enum: ['Card', 'Cash', 'Online'],
      default: 'Card'
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded', 'Cancelled'],
      default: 'Pending'
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
      unique: true,
      sparse: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    refundReason: {
      type: String,
      trim: true,
      default: ''
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

paymentSchema.index({ patientId: 1 });
paymentSchema.index({ appointmentId: 1 });
paymentSchema.index({ paymentStatus: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
