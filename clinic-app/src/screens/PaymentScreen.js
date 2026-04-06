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
import { PaymentContext } from '../context/PaymentContext';
import { AppointmentContext } from '../context/AppointmentContext';

export default function PaymentScreen({ route, navigation }) {
  const { appointment, doctor } = route.params || {};
  const { createPayment, loading } = useContext(PaymentContext);
  const { updateAppointment } = useContext(AppointmentContext);
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

  const validateCardInputs = () => {
    const cardDigits = cardNumber.replace(/\D/g, '');

    if (!cardholderName.trim()) {
      return 'Cardholder name is required.';
    }

    if (cardDigits.length < 13 || cardDigits.length > 19) {
      return 'Please enter a valid card number.';
    }

    const expiryMatch = expiry.match(/^(\d{2})\/(\d{2})$/);
    if (!expiryMatch) {
      return 'Expiry must be in MM/YY format.';
    }

    const month = Number(expiryMatch[1]);
    const year = 2000 + Number(expiryMatch[2]);
    if (month < 1 || month > 12) {
      return 'Expiry month is invalid.';
    }

    const now = new Date();
    const expiryDate = new Date(year, month, 0, 23, 59, 59, 999);
    if (expiryDate < now) {
      return 'Card has expired.';
    }

    if (!/^\d{3,4}$/.test(cvv)) {
      return 'CVV must be 3 or 4 digits.';
    }

    return null;
  };

  const handlePayment = async () => {
    if (!appointment?._id) {
      Alert.alert('Error', 'Appointment details are missing.');
      return;
    }

    const validationMessage = validateCardInputs();
    if (validationMessage) {
      Alert.alert('Invalid Card Details', validationMessage);
      return;
    }

    const paymentResult = await createPayment({
      appointmentId: appointment._id,
      amount,
      paymentStatus: 'Paid',
      paymentMethod: 'Card',
      cardholderName: cardholderName.trim(),
      cardNumber,
      expiry,
      cvv
    });

    if (!paymentResult.success) {
      Alert.alert('Payment Failed', paymentResult.message || 'Could not process payment.');
      return;
    }

    const appointmentResult = await updateAppointment(appointment._id, {
      status: 'Confirmed'
    });

    if (!appointmentResult.success) {
      Alert.alert('Payment Saved', 'Payment completed, but appointment status update failed.');
      setCurrentStatus('Paid');
      return;
    }

    setCurrentStatus('Paid');
    Alert.alert('Payment Success', 'Your payment is complete and appointment is confirmed.', [
      {
        text: 'Go to My Appointments',
        onPress: () => navigation.navigate('MyAppointments')
      }
    ]);
  };

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
          placeholderTextColor="rgba(255,255,255,0.45)"
          value={cardholderName}
          onChangeText={setCardholderName}
          autoCapitalize="words"
          editable={currentStatus !== 'Paid'}
        />

        <Text style={styles.label}>Card Number</Text>
        <TextInput
          style={styles.input}
          placeholder="1234 5678 9012 3456"
          placeholderTextColor="rgba(255,255,255,0.45)"
          value={cardNumber}
          onChangeText={(value) => setCardNumber(formatCardNumber(value))}
          keyboardType="number-pad"
          editable={currentStatus !== 'Paid'}
        />

        <View style={styles.row}>
          <View style={styles.halfField}>
            <Text style={styles.label}>Expiry (MM/YY)</Text>
            <TextInput
              style={styles.input}
              placeholder="MM/YY"
              placeholderTextColor="rgba(255,255,255,0.45)"
              value={expiry}
              onChangeText={(value) => setExpiry(formatExpiry(value))}
              keyboardType="number-pad"
              editable={currentStatus !== 'Paid'}
            />
          </View>

          <View style={styles.halfField}>
            <Text style={styles.label}>CVV</Text>
            <TextInput
              style={styles.input}
              placeholder="123"
              placeholderTextColor="rgba(255,255,255,0.45)"
              value={cvv}
              onChangeText={(value) => setCvv(value.replace(/\D/g, '').slice(0, 4))}
              keyboardType="number-pad"
              secureTextEntry
              editable={currentStatus !== 'Paid'}
            />
          </View>
        </View>

        <Text style={styles.label}>Payment Status</Text>
        <Text style={[styles.status, currentStatus === 'Paid' ? styles.paid : styles.pending]}>
          {currentStatus}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        disabled={loading || currentStatus === 'Paid'}
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
    backgroundColor: '#0F172A',
    padding: 16
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 14,
    padding: 16,
    marginBottom: 18
  },
  label: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 12,
    marginTop: 10
  },
  value: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 2
  },
  amount: {
    color: '#38BDF8',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 4
  },
  sectionHeading: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 2
  },
  input: {
    marginTop: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 15
  },
  row: {
    flexDirection: 'row',
    gap: 10
  },
  halfField: {
    flex: 1
  },
  status: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: '700'
  },
  pending: {
    color: '#F59E0B'
  },
  paid: {
    color: '#10B981'
  },
  button: {
    backgroundColor: '#38BDF8',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center'
  },
  buttonDisabled: {
    opacity: 0.6
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700'
  }
});
