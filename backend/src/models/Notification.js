const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: [
        'appointment_created',
        'appointment_updated',
        'appointment_cancelled',
        'appointment_confirmed',
        'appointment_rejected',
        'appointment_reminder_24h',
        'appointment_reminder_1h',
        'general'
      ],
      default: 'general'
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      default: null
    },
    isReminder: {
      type: Boolean,
      default: false
    },
    reminderAt: {
      type: Date,
      default: null
    },
    delivered: {
      type: Boolean,
      default: true
    },
    deliveredAt: {
      type: Date,
      default: null
    },
    read: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: {}
    }
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, delivered: 1, reminderAt: 1 });
notificationSchema.index({ appointmentId: 1, isReminder: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
