const Appointment = require('../models/Appointment');
const mongoose = require('mongoose');
const Doctor = require('../models/Doctor');
const Notification = require('../models/Notification');
const {
  createInstantNotification,
  createAppointmentReminders,
  clearAppointmentReminders
} = require('../services/reminderService');

const isValidDateInput = (value) => {
  if (!value) return false;
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime());
};

// Create appointment
const createAppointment = async (req, res) => {
  try {
    const { doctorId, patientName, appointmentDate, timeSlot, notes } = req.body;
    const patientId = new mongoose.Types.ObjectId(req.user.id);

    // Validation
    if (!doctorId || !patientName || !appointmentDate || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    if (!isValidDateInput(appointmentDate)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid appointment date'
      });
    }

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Check if time slot is already booked for this doctor on this date
    const existingAppointment = await Appointment.findOne({
      doctorId,
      appointmentDate: new Date(appointmentDate),
      timeSlot,
      status: { $nin: ['Cancelled', 'Rejected'] } // Only check active appointments
    });

    if (existingAppointment) {
      return res.status(409).json({
        success: false,
        message: 'This time slot is already booked for this doctor. Please select another time.'
      });
    }

    if (!doctor.available) {
      return res.status(400).json({
        success: false,
        message: 'Doctor is currently unavailable for booking'
      });
    }

    // Create appointment
    const appointment = new Appointment({
      patientId,
      doctorId,
      patientName,
      appointmentDate: new Date(appointmentDate),
      timeSlot,
      notes: notes || '',
      status: 'Pending'
    });

    await appointment.save();

    await createInstantNotification({
      userId: patientId,
      title: 'Appointment Booked',
      message: `Your appointment is booked for ${new Date(appointmentDate).toDateString()} at ${timeSlot}.`,
      type: 'appointment_created',
      appointmentId: appointment._id,
      data: {
        appointmentId: appointment._id,
        doctorId
      }
    });
    await createAppointmentReminders(appointment);

    // Populate doctor details
    await appointment.populate('doctorId', 'name specialization hospital fee');

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all appointments (admin)
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patientId', 'name email')
      .populate('doctorId', 'name specialization hospital')
      .sort({ appointmentDate: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single appointment
const getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId', 'name email')
      .populate('doctorId', 'name specialization hospital fee');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get appointments by patient
const getAppointmentsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID is required'
      });
    }

    // CONVERT STRING TO OBJECTID
    const patientObjectId = new mongoose.Types.ObjectId(patientId);

    const appointments = await Appointment.find({ patientId: patientObjectId })
      .populate('doctorId', 'name specialization hospital fee rating')
      .sort({ appointmentDate: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get appointments by doctor
const getAppointmentsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { filter } = req.query; // 'today' or 'all'

    if (!doctorId) {
      return res.status(400).json({
        success: false,
        message: 'Doctor ID is required'
      });
    }

    let query = Appointment.find({ doctorId })
      .populate('patientId', 'name email')
      .sort({ appointmentDate: 1 });

    // Filter for today's appointments
    if (filter === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      query = Appointment.find({
        doctorId,
        appointmentDate: { $gte: today, $lt: tomorrow }
      }).populate('patientId', 'name email').sort({ appointmentDate: 1 });
    }

    const appointments = await query;

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get appointment records by patient (past and cancelled)
const getAppointmentRecordsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID is required'
      });
    }

    // Convert string patientId to ObjectId for MongoDB query
    const patientObjectId = new mongoose.Types.ObjectId(patientId);

    const now = new Date();

    const appointments = await Appointment.find({ patientId: patientObjectId })
      .populate('doctorId', 'name specialization hospital fee rating')
      .sort({ appointmentDate: -1 });

    const records = appointments.filter((item) => {
      const isPast = new Date(item.appointmentDate) < now;
      return item.status === 'Cancelled' || isPast;
    });

    res.status(200).json({
      success: true,
      count: records.length,
      records
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update appointment
const updateAppointment = async (req, res) => {
  try {
    const { appointmentDate, timeSlot, notes, status } = req.body;

    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    if (appointmentDate && !isValidDateInput(appointmentDate)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid appointment date'
      });
    }

    const allowedStatuses = ['Pending', 'Confirmed', 'Cancelled', 'Rejected'];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be Pending, Confirmed, Cancelled, or Rejected'
      });
    }

    // Update fields if provided
    if (appointmentDate) appointment.appointmentDate = new Date(appointmentDate);
    if (timeSlot) appointment.timeSlot = timeSlot;
    if (notes !== undefined) appointment.notes = notes;
    if (status) appointment.status = status;

    await appointment.save();

    // Send notification for status changes
    if (status === 'Rejected') {
      await createInstantNotification({
        userId: appointment.patientId,
        title: 'Appointment Rejected',
        message: `Your appointment on ${appointment.appointmentDate.toDateString()} at ${appointment.timeSlot} was rejected. ${req.body.rejectionReason ? `Reason: ${req.body.rejectionReason}` : ''}`,
        type: 'appointment_rejected',
        appointmentId: appointment._id,
        data: {
          appointmentId: appointment._id,
          doctorId: appointment.doctorId,
          rejectionReason: req.body.rejectionReason || ''
        }
      });
      await clearAppointmentReminders(appointment._id);
    } else if (status === 'Confirmed') {
      await createInstantNotification({
        userId: appointment.patientId,
        title: 'Appointment Confirmed',
        message: `Your appointment on ${appointment.appointmentDate.toDateString()} at ${appointment.timeSlot} has been confirmed.`,
        type: 'appointment_confirmed',
        appointmentId: appointment._id,
        data: {
          appointmentId: appointment._id,
          doctorId: appointment.doctorId
        }
      });
      await createAppointmentReminders(appointment);
    } else if (status === 'Cancelled') {
      await clearAppointmentReminders(appointment._id);
      await createInstantNotification({
        userId: appointment.patientId,
        title: 'Appointment Cancelled',
        message: 'Your appointment has been cancelled.',
        type: 'appointment_cancelled',
        appointmentId: appointment._id,
        data: {
          appointmentId: appointment._id,
          doctorId: appointment.doctorId
        }
      });
    } else if (appointmentDate || timeSlot) {
      await createInstantNotification({
        userId: appointment.patientId,
        title: 'Appointment Updated',
        message: 'Your appointment details were updated.',
        type: 'appointment_updated',
        appointmentId: appointment._id,
        data: {
          appointmentId: appointment._id,
          doctorId: appointment.doctorId
        }
      });
      await createAppointmentReminders(appointment);
    }

    res.status(200).json({
      success: true,
      message: 'Appointment updated successfully',
      appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete appointment
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    await clearAppointmentReminders(appointment._id);

    res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createAppointment,
  getAllAppointments,
  getAppointment,
  getAppointmentsByPatient,
  getAppointmentRecordsByPatient,
  getAppointmentsByDoctor,
  updateAppointment,
  deleteAppointment
};
