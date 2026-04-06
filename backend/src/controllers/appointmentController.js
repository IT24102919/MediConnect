const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

const isValidDateInput = (value) => {
  if (!value) return false;
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime());
};

// Create appointment
const createAppointment = async (req, res) => {
  try {
    const { doctorId, patientName, appointmentDate, timeSlot, notes } = req.body;
    const patientId = req.user.id; // From auth middleware

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

    console.log('Notification: Appointment booked', {
      appointmentId: appointment._id,
      patientId,
      doctorId,
      appointmentDate,
      timeSlot
    });

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

    const appointments = await Appointment.find({ patientId })
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

    const now = new Date();

    const appointments = await Appointment.find({ patientId })
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

    const allowedStatuses = ['Pending', 'Confirmed', 'Cancelled'];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be Pending, Confirmed, or Cancelled'
      });
    }

    // Update fields if provided
    if (appointmentDate) appointment.appointmentDate = new Date(appointmentDate);
    if (timeSlot) appointment.timeSlot = timeSlot;
    if (notes !== undefined) appointment.notes = notes;
    if (status) appointment.status = status;

    await appointment.save();

    if (status === 'Cancelled') {
      console.log('Notification: Appointment cancelled', {
        appointmentId: appointment._id,
        patientId: appointment.patientId,
        doctorId: appointment.doctorId
      });
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
  updateAppointment,
  deleteAppointment
};
