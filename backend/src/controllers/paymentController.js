const Payment = require('../models/Payment');
const Appointment = require('../models/Appointment');

// Create payment
const createPayment = async (req, res) => {
  try {
    const {
      appointmentId,
      amount,
      paymentMethod,
      paymentStatus,
      patientId: patientIdFromBody,
      paidAt
    } = req.body;
    const patientId = patientIdFromBody || req.user?.id;

    // Validation
    if (!appointmentId || !patientId || amount === undefined || amount === null) {
      return res.status(400).json({
        success: false,
        message: 'Please provide appointment ID, patient ID, and amount'
      });
    }

    if (Number(amount) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than or equal to 0'
      });
    }

    if (!paymentMethod || !String(paymentMethod).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a payment method'
      });
    }

    // Check if appointment exists
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    if (String(appointment.patientId) !== String(patientId)) {
      return res.status(403).json({
        success: false,
        message: 'You can only pay for your own appointments'
      });
    }

    const normalizedStatus = paymentStatus === 'Paid' ? 'Paid' : 'Pending';
    const paymentPaidAt = normalizedStatus === 'Paid' ? (paidAt ? new Date(paidAt) : new Date()) : null;

    let payment = await Payment.findOne({ appointmentId, patientId });

    if (payment) {
      payment.amount = Number(amount);
      payment.paymentMethod = String(paymentMethod).trim();
      payment.paymentStatus = normalizedStatus;
      payment.paidAt = paymentPaidAt;
      await payment.save();
    } else {
      payment = new Payment({
        appointmentId,
        patientId,
        amount: Number(amount),
        paymentMethod: String(paymentMethod).trim(),
        paymentStatus: normalizedStatus,
        paidAt: paymentPaidAt
      });

      await payment.save();
    }

    res.status(201).json({
      success: true,
      message: 'Card payment processed successfully',
      payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all payments (admin)
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('patientId', 'name email')
      .populate('appointmentId', 'appointmentDate doctorId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single payment
const getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('patientId', 'name email')
      .populate('appointmentId', 'appointmentDate doctorId');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.status(200).json({
      success: true,
      payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get payments by patient
const getPaymentsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID is required'
      });
    }

    const payments = await Payment.find({ patientId })
      .populate('appointmentId', 'appointmentDate doctorId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createPayment,
  getAllPayments,
  getPayment,
  getPaymentsByPatient
};
