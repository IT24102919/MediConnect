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
import { COLORS, SHADOWS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import axiosInstance from '../api/axios';

export default function PaymentScreen({ route, navigation }) {
  const { appointment, doctor } = route.params || {};
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('Pending');
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const amount = useMemo(() => Number(doctor?.fee || 0), [doctor]);

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 19);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
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

    if (!cardNumber.trim()) {
      return 'Card number is required.';
    }

    if (!isValidCardNumber(cardNumber)) {
      return 'Please enter a valid card number.';
    }

    if (!expiry.trim()) {
      return 'Expiry must be in MM/YY format.';
    }

    if (!cvv.trim()) {
      return 'CVV is required.';
    }

    return null;
  };

  const handlePayment = async () => {
    if (loading || currentStatus === 'Paid') {
      return;
    }

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

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1800));

      const response = await axiosInstance.post('/payments', {
        appointmentId: appointment._id,
        patientId,
        amount,
        paymentMethod: 'Card',
        cardholderName: cardholderName.trim(),
        cardNumber,
        expiry,
        cvv,
        paymentStatus: 'Paid'
      });

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Payment could not be saved');
      }

      setCurrentStatus('Paid');
      Alert.alert('Payment Successful', 'Your payment was saved successfully.', [
        {
          text: 'Go to My Appointments',
          onPress: () => navigation.navigate('MyAppointments')
        },
        {
          text: 'OK',
          style: 'cancel'
        }
      ]);
    } catch (error) {
      console.error('❌ PAYMENT SAVE ERROR:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      Alert.alert(
        'Payment Failed',
        error.response?.data?.message || error.message || 'Could not save payment.'
      );
    } finally {
      setLoading(false);
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
        <Text style={styles.amount}>Rs. {amount}</Text>

        <Text style={styles.sectionHeading}>Credit Card Details</Text>

        <Text style={styles.label}>Cardholder Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Name on card"
          placeholderTextColor="#94A3B8"
          value={cardholderName}
          onChangeText={setCardholderName}
          autoCapitalize="words"
          editable={!isPaid && !loading}
        />

        <Text style={styles.label}>Card Number</Text>
        <TextInput
          style={styles.input}
          placeholder="1234 5678 9012 3456"
          placeholderTextColor="#94A3B8"
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
              placeholderTextColor="#94A3B8"
              value={expiry}
              onChangeText={(value) => setExpiry(formatExpiry(value))}
              keyboardType="number-pad"
              editable={!isPaid && !loading}
            />
          </View>

          <View style={styles.halfField}>
            <Text style={styles.label}>CVV</Text>
            <TextInput
              style={styles.input}
              placeholder="123"
              placeholderTextColor="#94A3B8"
              value={cvv}
              onChangeText={(value) => setCvv(value.replace(/\D/g, '').slice(0, 4))}
              keyboardType="number-pad"
              secureTextEntry
              editable={!isPaid && !loading}
            />
          </View>
        </View>

        <Text style={styles.label}>Payment Status</Text>
        <Text style={[styles.status, statusStyle]}>
          {currentStatus}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        disabled={loading || isPaid}
        onPress={handlePayment}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
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
    fontSize: 20,
  },
  card: {
    backgroundColor: COLORS.white,
    borderWidth: 0,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  label: {
    color: COLORS.textLight,
    fontSize: 12,
    marginTop: SPACING.md,
    fontWeight: '600',
  },
  value: {
    color: COLORS.dark,
    fontSize: 16,
    fontWeight: '600',
    marginTop: SPACING.sm,
  },
  amount: {
    color: COLORS.accent,
    fontSize: 20,
    fontWeight: '700',
    marginTop: SPACING.md,
  },
  sectionHeading: {
    color: COLORS.dark,
    fontSize: 16,
    fontWeight: '700',
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
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
    fontSize: 15,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  halfField: {
    flex: 1,
  },
  status: {
    marginTop: SPACING.sm,
    fontSize: 16,
    fontWeight: '700',
  },
  pending: {
    color: COLORS.warning,
  },
  paid: {
    color: COLORS.success,
  },
  button: {
    backgroundColor: COLORS.accent,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    ...SHADOWS.lg,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  }
});





