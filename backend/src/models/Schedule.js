const mongoose = require('mongoose');

// Define Schedule Schema
const scheduleSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'Please provide doctor ID']
    },
    date: {
      type: Date,
      required: [true, 'Please provide schedule date']
    },
    timeSlots: {
      type: [String],
      required: [true, 'Please provide time slots'],
      // Example: ['09:00', '09:30', '10:00', '10:30', '11:00']
      validate: {
        validator: function (arr) {
          return arr.length > 0;
        },
        message: 'At least one time slot is required'
      }
    },
    isAvailable: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Index for finding schedules by doctor
scheduleSchema.index({ doctorId: 1, date: 1 });

// Create and export Schedule model
module.exports = mongoose.model('Schedule', scheduleSchema);
