const Payment = require('../models/Payment');
const Appointment = require('../models/Appointment');

const normalizeCardNumber = (value = '') => String(value).replace(/\D/g, '');
const ALLOW_DEMO_CARDS =
  process.env.ALLOW_DEMO_CARDS === 'true' || process.env.NODE_ENV !== 'production';
const DEMO_CARD_NUMBERS = new Set([
  '4242424242424242',
  '4111111111111111',
  '5555555555554444'
]);

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

const detectCardBrand = (number) => {
  if (/^4/.test(number)) return 'Visa';
  if (/^5[1-5]/.test(number)) return 'Mastercard';
  if (/^3[47]/.test(number)) return 'American Express';
  return 'Card';
};

const isValidExpiry = (value = '') => {
  const cleaned = String(value).trim();
  const parts = cleaned.split('/');
  if (parts.length !== 2) return false;

  const month = Number(parts[0]);
  const yearPart = parts[1];
  const fullYear = yearPart.length === 2 ? 2000 + Number(yearPart) : Number(yearPart);

  if (!month || month < 1 || month > 12 || !fullYear) return false;

  const now = new Date();
  const expiryDate = new Date(fullYear, month, 0, 23, 59, 59, 999);
  return expiryDate >= now;
};

const isValidCvv = (value = '') => /^\d{3,4}$/.test(String(value).trim());
const isDemoCard = (number = '') => ALLOW_DEMO_CARDS && DEMO_CARD_NUMBERS.has(String(number));

const makeTransactionId = () => `TXN-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

const normalizePaymentMethod = (value) => {
  if (!value) return 'Card';
  const cleaned = String(value).trim().toLowerCase();
  if (cleaned === 'card' || cleaned === 'credit card' || cleaned === 'credit_card') {
    return 'Card';
  }
  return null;
};
// Create payment
const createPayment = async (req, res) => {
  try {
    const {
      appointmentId,
      amount,
      paymentStatus,
      paymentMethod,
      cardNumber,
      expiry,
      cvv,
      cardholderName
    } = req.body;
    const patientId = req.user.id; // From auth middleware

    // Validation
    if (!appointmentId || amount === undefined || amount === null) {
      return res.status(400).json({
        success: false,
        message: 'Please provide appointment ID and amount'
      });
    }

    if (Number(amount) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than or equal to 0'
      });
    }

    const normalizedStatus = paymentStatus === 'Paid' ? 'Paid' : 'Pending';
    const normalizedMethod = normalizePaymentMethod(paymentMethod);

    if (!normalizedMethod) {
      return res.status(400).json({
        success: false,
        message: 'Only card payments are supported right now'
      });
    }

    const normalizedCardNumber = normalizeCardNumber(cardNumber);

    if (!cardholderName || !String(cardholderName).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Cardholder name is required'
      });
    }

    if (!isValidCardNumber(normalizedCardNumber) && !isDemoCard(normalizedCardNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid card number'
      });
    }

    if (!isValidExpiry(expiry)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid expiry date'
      });
    }

    if (!isValidCvv(cvv)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid CVV'
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

    // Create or update payment for the appointment
    const paidAt = normalizedStatus === 'Paid' ? new Date() : null;
    const cardBrand = detectCardBrand(normalizedCardNumber);
    const cardLast4 = normalizedCardNumber.slice(-4);
    const transactionId = makeTransactionId();

    let payment = await Payment.findOne({ appointmentId, patientId });

    if (payment) {
      payment.amount = Number(amount);
      payment.paymentMethod = normalizedMethod;
      payment.paymentStatus = normalizedStatus;
      payment.paidAt = paidAt;
      payment.cardBrand = cardBrand;
      payment.cardLast4 = cardLast4;
      payment.cardholderName = String(cardholderName).trim();
      payment.transactionId = transactionId;
      await payment.save();
    } else {
      payment = new Payment({
        appointmentId,
        patientId,
        amount: Number(amount),
        paymentMethod: normalizedMethod,
        paymentStatus: normalizedStatus,
        paidAt,
        cardBrand,
        cardLast4,
        cardholderName: String(cardholderName).trim(),
        transactionId
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
