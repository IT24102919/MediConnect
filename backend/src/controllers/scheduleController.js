const Schedule = require('../models/Schedule');
const Doctor = require('../models/Doctor');

// Create schedule
const createSchedule = async (req, res) => {
  try {
    const { doctorId, date, timeSlots } = req.body;

    // Validation
    if (!doctorId || !date || !timeSlots || timeSlots.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide doctor ID, date, and time slots'
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

    // Create schedule
    const schedule = new Schedule({
      doctorId,
      date: new Date(date),
      timeSlots,
      isAvailable: true
    });

    await schedule.save();

    res.status(201).json({
      success: true,
      message: 'Schedule created successfully',
      schedule
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all schedules
const getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find()
      .populate('doctorId', 'name specialization')
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: schedules.length,
      schedules
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get schedules by doctor
const getScheduleByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    let filter = { doctorId };

    // Optional: filter by specific date
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.date = { $gte: startDate, $lt: endDate };
    }

    const schedules = await Schedule.find(filter)
      .populate('doctorId', 'name specialization hospital')
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: schedules.length,
      schedules
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update schedule
const updateSchedule = async (req, res) => {
  try {
    const { date, timeSlots, isAvailable } = req.body;

    let schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    // Update fields if provided
    if (date) schedule.date = new Date(date);
    if (timeSlots) schedule.timeSlots = timeSlots;
    if (isAvailable !== undefined) schedule.isAvailable = isAvailable;

    await schedule.save();

    res.status(200).json({
      success: true,
      message: 'Schedule updated successfully',
      schedule
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete schedule
const deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndDelete(req.params.id);

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Schedule deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createSchedule,
  getAllSchedules,
  getScheduleByDoctor,
  updateSchedule,
  deleteSchedule
};
