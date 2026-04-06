const Feedback = require('../models/Feedback');
const Doctor = require('../models/Doctor');

// Create feedback
const createFeedback = async (req, res) => {
  try {
    const { doctorId, appointmentId, rating, comment } = req.body;
    const patientId = req.user.id; // From auth middleware

    // Validation
    if (!doctorId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide doctor ID, rating, and comment'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    if (comment.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Comment must be at least 10 characters long'
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

    // Create feedback
    const feedback = new Feedback({
      patientId,
      doctorId,
      appointmentId: appointmentId || null,
      rating,
      comment
    });

    await feedback.save();

    // Update doctor's average rating
    const allFeedbacks = await Feedback.find({ doctorId });
    const averageRating = allFeedbacks.reduce((sum, f) => sum + f.rating, 0) / allFeedbacks.length;
    await Doctor.findByIdAndUpdate(doctorId, { rating: Math.round(averageRating * 10) / 10 });

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      feedback
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all feedbacks
const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('patientId', 'name')
      .populate('doctorId', 'name specialization')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      feedbacks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get feedbacks by doctor
const getFeedbacksByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const feedbacks = await Feedback.find({ doctorId })
      .populate('patientId', 'name')
      .sort({ createdAt: -1 });

    if (feedbacks.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No feedbacks found for this doctor'
      });
    }

    // Calculate average rating
    const averageRating =
      feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length;

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      averageRating: Math.round(averageRating * 10) / 10,
      feedbacks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update feedback
const updateFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    let feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    // Update fields if provided
    if (rating) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 5'
        });
      }
      feedback.rating = rating;
    }

    if (comment) {
      if (comment.length < 10) {
        return res.status(400).json({
          success: false,
          message: 'Comment must be at least 10 characters long'
        });
      }
      feedback.comment = comment;
    }

    await feedback.save();

    res.status(200).json({
      success: true,
      message: 'Feedback updated successfully',
      feedback
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete feedback
const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Feedback deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createFeedback,
  getAllFeedbacks,
  getFeedbacksByDoctor,
  updateFeedback,
  deleteFeedback
};
