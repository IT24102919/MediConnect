import React, { useContext, useMemo, useState } from 'react';
import {
  Alert,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TextInput
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { PaymentContext } from '../context/PaymentContext';
import { COLORS, SHADOWS, SPACING, BORDER_RADIUS } from '../../constants/theme';

export default function PaymentScreen({ route, navigation }) {
  const { appointment, doctor } = route.params || {};
  const { user } = useContext(AuthContext);
  const { createPayment, loading } = useContext(PaymentContext);
  const [currentStatus, setCurrentStatus] = useState('Pending');
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const amount = useMemo(() => Number(doctor?.fee || 0), [doctor]);

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 19);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, '');

    if (cleaned.length <= 2) {
      return cleaned;
    }

    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
  };

  const isValidCardNumber = (value) => {
    const digits = String(value).replace(/\D/g, '');
    if (digits.length < 13 || digits.length > 19) return false;

    let sum = 0;
    let shouldDouble = false;

    for (let i = digits.length - 1; i >= 0; i -= 1) {
      let digit = Number(digits[i]);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  };

  const validateCardInputs = () => {
    if (!cardholderName.trim()) {
      return 'Cardholder name is required.';
    }

    const digits = String(cardNumber).replace(/\D/g, '');
    if (!digits) {
      return 'Card number is required.';
    }

    if (!isValidCardNumber(cardNumber)) {
      return 'Please enter a valid card number.';
    }

    if (!expiryDate.trim()) {
      return 'Expiry date is required.';
    }

    if (expiryDate.length < 4) {
      return 'Expiry date must be at least 4 characters.';
    }

    if (!cvv.trim() || cvv.length < 3 || cvv.length > 4) {
      return 'CVV must be 3 or 4 digits.';
    }

    return null;
  };

  const handlePayment = async () => {
    if (submitting || loading || currentStatus === 'Paid') return;

    const validationMessage = validateCardInputs();
    if (validationMessage) {
      Alert.alert('Invalid Card Details', validationMessage);
      return;
    }

    if (!appointment?._id) {
      Alert.alert('Error', 'Appointment details are missing.');
      return;
    }

    const patientId = user?._id || user?.id;
    if (!patientId) {
      Alert.alert('Error', 'Patient information is missing. Please log in again.');
      return;
    }

    const paymentData = {
      appointmentId: appointment._id,
      patientId,
      amount,
      paymentMethod: 'Card',
      cardholderName: cardholderName.trim(),
      cardNumber: cardNumber.replace(/\s/g, ''),
      expiryDate: expiryDate.trim(),
      cvv: cvv.trim(),
      description: 'Appointment payment'
    };

    try {
      setSubmitting(true);
      const result = await createPayment(paymentData);

      if (result.success) {
        setCurrentStatus('Paid');
        Alert.alert('Payment Successful', 'Your payment was saved successfully.', [
          {
            text: 'View Payment History',
            onPress: () => navigation.navigate('PaymentHistory')
          },
          {
            text: 'OK',
            style: 'cancel',
            onPress: () => navigation.goBack()
          }
        ]);
        return;
      }

      Alert.alert('Payment Failed', result.message || 'Could not save payment.');
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Payment Failed', 'An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  const isPaid = currentStatus === 'Paid';
  const statusStyle = isPaid ? styles.paid : styles.pending;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Complete Your Payment</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Doctor</Text>
        <Text style={styles.value}>{doctor?.name || 'N/A'}</Text>

        <Text style={styles.label}>Specialization</Text>
        <Text style={styles.value}>{doctor?.specialization || 'N/A'}</Text>

        <Text style={styles.label}>Appointment Date</Text>
        <Text style={styles.value}>{appointment?.appointmentDate || 'N/A'}</Text>

        <Text style={styles.label}>Time Slot</Text>
        <Text style={styles.value}>{appointment?.timeSlot || 'N/A'}</Text>

        <Text style={styles.label}>Amount</Text>
        <Text style={styles.amount}>Rs. {amount.toFixed(2)}</Text>

        <Text style={styles.sectionHeading}>Credit Card Details</Text>

        <Text style={styles.label}>Cardholder Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Name on card"
          placeholderTextColor={COLORS.textMuted}
          value={cardholderName}
          onChangeText={setCardholderName}
          autoCapitalize="words"
          editable={!isPaid && !loading}
        />

        <Text style={styles.label}>Card Number</Text>
        <TextInput
          style={styles.input}
          placeholder="1234 5678 9012 3456"
          placeholderTextColor={COLORS.textMuted}
          value={cardNumber}
          onChangeText={(value) => setCardNumber(formatCardNumber(value))}
          keyboardType="number-pad"
          editable={!isPaid && !loading}
        />

        <View style={styles.row}>
          <View style={styles.halfField}>
            <Text style={styles.label}>Expiry (MM/YY)</Text>
            <TextInput
              style={styles.input}
              placeholder="MM/YY"
              placeholderTextColor={COLORS.textMuted}
              value={expiryDate}
              onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
              keyboardType="number-pad"
              maxLength={5}
              editable={!isPaid && !loading}
            />
          </View>

          <View style={styles.halfField}>
            <Text style={styles.label}>CVV</Text>
            <TextInput
              style={styles.input}
              placeholder="123"
              placeholderTextColor={COLORS.textMuted}
              value={cvv}
              onChangeText={(value) => setCvv(value.replace(/\D/g, '').slice(0, 4))}
              keyboardType="number-pad"
              secureTextEntry
              editable={!isPaid && !loading}
            />
          </View>
        </View>

        <View style={styles.noteBox}>
          <Text style={styles.noteText}>
            This is a simulated payment for academic project purposes. Full card details are not stored.
          </Text>
        </View>

        <Text style={styles.label}>Payment Status</Text>
        <Text style={[styles.status, statusStyle]}>{currentStatus}</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, (submitting || loading || isPaid) && styles.buttonDisabled]}
        disabled={submitting || loading || isPaid}
        onPress={handlePayment}
      >
        {(submitting || loading) ? (
          <ActivityIndicator size="small" color={COLORS.white} />
        ) : (
          <Text style={styles.buttonText}>
            {currentStatus === 'Paid' ? 'Payment Completed' : 'Pay with Credit Card'}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.lg
  },
  heading: {
    color: COLORS.dark,
    fontWeight: '700',
    marginBottom: SPACING.lg,
    fontSize: 20
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.md
  },
  label: {
    color: COLORS.textLight,
    fontSize: 12,
    marginTop: SPACING.md,
    fontWeight: '600'
  },
  value: {
    color: COLORS.dark,
    fontSize: 16,
    fontWeight: '600',
    marginTop: SPACING.sm
  },
  amount: {
    color: COLORS.accent,
    fontSize: 20,
    fontWeight: '700',
    marginTop: SPACING.md
  },
  sectionHeading: {
    color: COLORS.dark,
    fontSize: 16,
    fontWeight: '700',
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm
  },
  input: {
    marginTop: SPACING.sm,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    color: COLORS.dark,
    fontSize: 15
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.md
  },
  halfField: {
    flex: 1
  },
  noteBox: {
    marginTop: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.md
  },
  noteText: {
    color: COLORS.dark,
    fontSize: 13,
    lineHeight: 20
  },
  status: {
    marginTop: SPACING.sm,
    fontSize: 16,
    fontWeight: '700'
  },
  pending: {
    color: COLORS.warning
  },
  paid: {
    color: COLORS.success
  },
  button: {
    backgroundColor: COLORS.accent,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    ...SHADOWS.lg
  },
  buttonDisabled: {
    opacity: 0.6
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700'
  }
});







