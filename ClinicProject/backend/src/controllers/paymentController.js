const Payment = require('../models/Payment');
const Appointment = require('../models/Appointment');

const PAYMENT_METHODS = ['Card', 'Cash', 'Online'];
const PAYMENT_STATUSES = ['Pending', 'Paid', 'Failed', 'Refunded', 'Cancelled'];

const normalizeCardNumber = (value = '') => String(value).replace(/\D/g, '');
const normalizeExpiry = (value = '') => String(value).trim();
const isValidCardNumber = (number) => {
  if (!number || number.length < 13 || number.length > 19) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = number.length - 1; i >= 0; i -= 1) {
    let digit = Number(number[i]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};

const getCardBrand = (number) => {
  if (/^4/.test(number)) return 'Visa';
  if (/^5/.test(number)) return 'MasterCard';
  if (/^3[47]/.test(number)) return 'Amex';
  if (/^6/.test(number)) return 'Discover';
  return 'Unknown';
};

const isValidExpiry = (value = '') => {
  const cleaned = String(value).trim();
  const parts = cleaned.split('/');
  if (parts.length !== 2) return false;

  const month = Number(parts[0]);
  const yearPart = parts[1];
  if (!month || month < 1 || month > 12) return false;

  const fullYear = yearPart.length === 2 ? 2000 + Number(yearPart) : Number(yearPart);
  if (!fullYear || fullYear < 2000) return false;

  const expiryDate = new Date(fullYear, month - 1, 1);
  const now = new Date();
  expiryDate.setMonth(expiryDate.getMonth() + 1);
  expiryDate.setDate(0);
  expiryDate.setHours(23, 59, 59, 999);

  return expiryDate >= now;
};

const isValidCvv = (value = '') => /^\d{3,4}$/.test(String(value).trim());

const validateExpiryDate = (expiryDate) => {
  if (!expiryDate) {
    return {
      valid: false,
      message: 'Expiry date is required'
    };
  }

  const cleaned = String(expiryDate).trim().replace(/\s/g, '');

  let month;
  let year;

  if (/^\d{2}\/\d{2}$/.test(cleaned)) {
    const parts = cleaned.split('/');
    month = parseInt(parts[0], 10);
    year = 2000 + parseInt(parts[1], 10);
  } else if (/^\d{2}\/\d{4}$/.test(cleaned)) {
    const parts = cleaned.split('/');
    month = parseInt(parts[0], 10);
    year = parseInt(parts[1], 10);
  } else if (/^\d{4}$/.test(cleaned)) {
    month = parseInt(cleaned.substring(0, 2), 10);
    year = 2000 + parseInt(cleaned.substring(2, 4), 10);
  } else if (/^\d{6}$/.test(cleaned)) {
    month = parseInt(cleaned.substring(0, 2), 10);
    year = parseInt(cleaned.substring(2, 6), 10);
  } else {
    return {
      valid: false,
      message: 'Invalid expiry date format. Use MM/YY or MM/YYYY'
    };
  }

  if (!month || month < 1 || month > 12) {
    return {
      valid: false,
      message: 'Invalid expiry month'
    };
  }

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return {
      valid: false,
      message: 'Card has expired'
    };
  }

  return {
    valid: true,
    month,
    year
  };
};

const generateTransactionId = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `PAY-${year}${month}${day}-${random}`;
};

const validateCardDetails = (cardNumber, expiryDate, cvv) => {
  const normalizedNumber = normalizeCardNumber(cardNumber);
  if (!normalizedNumber) {
    return 'Card number is required.';
  }
  if (normalizedNumber.length < 13 || normalizedNumber.length > 19) {
    return 'Card number must be between 13 and 19 digits.';
  }
  if (!isValidCardNumber(normalizedNumber)) {
    return 'Please enter a valid card number.';
  }

  const expiryValidation = validateExpiryDate(expiryDate);
  if (!expiryValidation.valid) {
    return expiryValidation.message;
  }

  if (!cvv || !isValidCvv(cvv)) {
    return 'CVV must be 3 or 4 digits.';
  }

  return null;
};

const createPayment = async (req, res) => {
  try {
    const {
      appointmentId,
      patientId,
      amount,
      paymentMethod = 'Card',
      cardholderName = '',
      cardNumber = '',
      expiryDate = '',
      cvv = '',
      description = ''
    } = req.body;

    const requestorId = String(req.user?.id);
    const requestorRole = String(req.user?.role || 'patient').toLowerCase();

    if (!appointmentId || !patientId || amount === undefined || amount === null) {
      return res.status(400).json({
        success: false,
        message: 'appointmentId, patientId, and amount are required.'
      });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0.'
      });
    }

    if (!PAYMENT_METHODS.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'paymentMethod must be Card, Cash, or Online.'
      });
    }

    if (requestorRole === 'patient' && requestorId !== String(patientId)) {
      return res.status(403).json({
        success: false,
        message: 'You can only create payments for your own patient account.'
      });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.'
      });
    }

    if (requestorRole === 'patient' && String(appointment.patientId) !== requestorId) {
      return res.status(403).json({
        success: false,
        message: 'You can only create payment for your own appointment.'
      });
    }

    let cardBrand = '';
    let cardLast4 = '';
    let storedCardholderName = '';

    if (paymentMethod === 'Card') {
      if (!cardholderName || !String(cardholderName).trim()) {
        return res.status(400).json({
          success: false,
          message: 'cardholderName is required for card payments.'
        });
      }

      const cardValidationError = validateCardDetails(cardNumber, expiryDate, cvv);
      if (cardValidationError) {
        return res.status(400).json({
          success: false,
          message: cardValidationError
        });
      }

      const normalizedCardNumber = normalizeCardNumber(cardNumber);
      cardBrand = getCardBrand(normalizedCardNumber);
      cardLast4 = normalizedCardNumber.slice(-4);
      storedCardholderName = String(cardholderName).trim();
    }

    const transactionId = generateTransactionId();
    const paymentStatus = 'Paid';
    const paidAt = new Date();

    const payment = await Payment.create({
      appointmentId,
      patientId,
      amount: Number(amount),
      paymentMethod,
      paymentStatus,
      description: String(description || 'Appointment payment').trim(),
      paidAt,
      cardBrand,
      cardLast4,
      cardholderName: storedCardholderName,
      transactionId
    });

    return res.status(201).json({
      success: true,
      message: 'Payment created successfully',
      payment
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while creating payment.'
    });
  }
};

const getAllPayments = async (req, res) => {
  try {
    if (String(req.user?.role).toLowerCase() !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required.'
      });
    }

    const { status, method, patientId, appointmentId, fromDate, toDate, search } = req.query;
    const query = {};

    if (status) query.paymentStatus = status;
    if (method) query.paymentMethod = method;
    if (patientId) query.patientId = patientId;
    if (appointmentId) query.appointmentId = appointmentId;

    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) {
        const startDate = new Date(fromDate);
        if (!Number.isNaN(startDate.getTime())) {
          query.createdAt.$gte = startDate;
        }
      }
      if (toDate) {
        const endDate = new Date(toDate);
        if (!Number.isNaN(endDate.getTime())) {
          endDate.setHours(23, 59, 59, 999);
          query.createdAt.$lte = endDate;
        }
      }
      if (Object.keys(query.createdAt).length === 0) {
        delete query.createdAt;
      }
    }

    if (search) {
      const regex = new RegExp(String(search).trim(), 'i');
      query.$or = [
        { transactionId: regex },
        { description: regex }
      ];
    }

    const payments = await Payment.find(query)
      .populate('patientId', 'name email phone')
      .populate('appointmentId', 'appointmentDate timeSlot doctorId status')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: payments.length,
      payments
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching payments.'
    });
  }
};

const getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('patientId', 'name email phone')
      .populate('appointmentId', 'appointmentDate timeSlot doctorId status');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found.'
      });
    }

    const isAdmin = String(req.user?.role).toLowerCase() === 'admin';
    const requestorId = String(req.user?.id);
    if (!isAdmin && String(payment.patientId?._id || payment.patientId) !== requestorId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this payment.'
      });
    }

    return res.status(200).json({
      success: true,
      payment
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching payment.'
    });
  }
};

const getPaymentsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID is required.'
      });
    }

    const isAdmin = String(req.user?.role).toLowerCase() === 'admin';
    const requestorId = String(req.user?.id);
    if (!isAdmin && requestorId !== String(patientId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this patient payment history.'
      });
    }

    const payments = await Payment.find({ patientId })
      .populate('appointmentId', 'appointmentDate timeSlot doctorId status')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: payments.length,
      payments
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching patient payments.'
    });
  }
};

const getPaymentByAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: 'Appointment ID is required.'
      });
    }

    const payment = await Payment.findOne({ appointmentId })
      .populate('patientId', 'name email phone')
      .populate('appointmentId', 'appointmentDate timeSlot doctorId status');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found for this appointment.'
      });
    }

    const isAdmin = String(req.user?.role).toLowerCase() === 'admin';
    const requestorId = String(req.user?.id);
    if (!isAdmin && String(payment.patientId?._id || payment.patientId) !== requestorId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this payment.'
      });
    }

    return res.status(200).json({
      success: true,
      payment
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching appointment payment.'
    });
  }
};

const updatePayment = async (req, res) => {
  try {
    if (String(req.user?.role).toLowerCase() !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required.'
      });
    }

    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found.'
      });
    }

    const {
      amount,
      paymentMethod,
      paymentStatus,
      description,
      refundReason
    } = req.body;

    if (amount !== undefined && amount !== null) {
      if (Number(amount) < 0) {
        return res.status(400).json({
          success: false,
          message: 'Amount cannot be negative.'
        });
      }
      payment.amount = Number(amount);
    }

    if (paymentMethod) {
      if (!PAYMENT_METHODS.includes(paymentMethod)) {
        return res.status(400).json({
          success: false,
          message: 'paymentMethod must be Card, Cash, or Online.'
        });
      }
      payment.paymentMethod = paymentMethod;
    }

    if (paymentStatus) {
      if (!PAYMENT_STATUSES.includes(paymentStatus)) {
        return res.status(400).json({
          success: false,
          message: 'paymentStatus must be Pending, Paid, Failed, Refunded, or Cancelled.'
        });
      }
      payment.paymentStatus = paymentStatus;

      if (paymentStatus === 'Paid' && !payment.paidAt) {
        payment.paidAt = new Date();
      }

      if (paymentStatus === 'Pending') {
        payment.paidAt = null;
      }
    }

    if (description !== undefined) {
      payment.description = String(description).trim();
    }

    if (refundReason !== undefined) {
      payment.refundReason = String(refundReason).trim();
    }

    if (payment.paymentStatus === 'Refunded' && !payment.refundReason) {
      payment.refundReason = 'Refund processed by administrator.';
    }

    await payment.save();

    const updatedPayment = await Payment.findById(payment._id)
      .populate('patientId', 'name email phone')
      .populate('appointmentId', 'appointmentDate timeSlot doctorId status');

    return res.status(200).json({
      success: true,
      message: 'Payment updated successfully',
      payment: updatedPayment
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while updating payment.'
    });
  }
};

const deletePayment = async (req, res) => {
  try {
    if (String(req.user?.role).toLowerCase() !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required.'
      });
    }

    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found.'
      });
    }

    await payment.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Payment deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while deleting payment.'
    });
  }
};

module.exports = {
  createPayment,
  getAllPayments,
  getPayment,
  getPaymentsByPatient,
  getPaymentByAppointment,
  updatePayment,
  deletePayment,
  generateTransactionId,
  getCardBrand,
  validateCardDetails
};
