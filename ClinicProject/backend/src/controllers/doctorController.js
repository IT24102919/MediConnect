const Doctor = require('../models/Doctor');

// Create doctor
const createDoctor = async (req, res) => {
  try {
    const {
      name,
      specialization,
      hospital,
      experience,
      fee,
      rating,
      description,
      available,
      phone,
      image,
      userId
    } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Only validate if experience/fee are provided (not undefined during initial creation)
    if (experience !== undefined && Number(experience) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Experience must be a valid positive number'
      });
    }
    if (fee !== undefined && Number(fee) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Fee must be a valid positive number'
      });
    }

    // Create doctor
    const doctor = new Doctor({
      name: name.trim(),
      specialization: specialization || '',  // Allow empty
      hospital: hospital || '',              // Allow empty
      experience: experience !== undefined ? Number(experience) : 0,
      fee: fee !== undefined ? Number(fee) : 0,
      rating: rating !== undefined ? Number(rating) : 0,
      description: description || '',
      available: available !== undefined ? Boolean(available) : false,  // Default false until profile complete
      phone: phone || '',
      image: image || null,
      userId: userId || null
    });

    await doctor.save();

    res.status(201).json({
      success: true,
      message: 'Doctor created successfully',
      doctor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all doctors
const getAllDoctors = async (req, res) => {
  try {
    // Optional: filter by specialization or availability
    const { specialization, available, search } = req.query;
    let filter = {};

    if (specialization) {
      filter.specialization = specialization;
    }
    if (available !== undefined) {
      filter.available = available === 'true';
    }

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const doctors = await Doctor.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: doctors.length,
      doctors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single doctor
const getDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.status(200).json({
      success: true,
      doctor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update doctor
const updateDoctor = async (req, res) => {
  try {
    const { name, specialization, hospital, experience, fee, rating, phone, description, available, image } = req.body;

    let doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Update fields if provided
    if (name) doctor.name = name;
    if (specialization) doctor.specialization = specialization;
    if (hospital) doctor.hospital = hospital;
    if (experience !== undefined) doctor.experience = experience;
    if (fee !== undefined) doctor.fee = fee;
    if (rating !== undefined) doctor.rating = rating;
    if (phone) doctor.phone = phone;
    if (description !== undefined) doctor.description = description;
    if (available !== undefined) doctor.available = available;
    if (image) doctor.image = image;

    await doctor.save();

    res.status(200).json({
      success: true,
      message: 'Doctor updated successfully',
      doctor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete doctor
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Doctor deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createDoctor,
  getAllDoctors,
  getDoctor,
  updateDoctor,
  deleteDoctor
};
