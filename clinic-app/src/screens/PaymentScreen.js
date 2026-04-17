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
<<<<<<< HEAD
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../api/axios';

export default function PaymentScreen({ route, navigation }) {
  const { appointment, doctor } = route.params || {};
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
=======
import { PaymentContext } from '../context/PaymentContext';
import { AppointmentContext } from '../context/AppointmentContext';

export default function PaymentScreen({ route, navigation }) {
  const { appointment, doctor } = route.params || {};
  const { createPayment, loading } = useContext(PaymentContext);
  const { updateAppointment } = useContext(AppointmentContext);
>>>>>>> b97bb2a5578a6ebbe5b954f4ae073ee17dd94cae
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
<<<<<<< HEAD
=======
    const cardDigits = cardNumber.replace(/\D/g, '');

>>>>>>> b97bb2a5578a6ebbe5b954f4ae073ee17dd94cae
    if (!cardholderName.trim()) {
      return 'Cardholder name is required.';
    }

<<<<<<< HEAD
    if (!cardNumber.trim()) {
      return 'Card number is required.';
    }

    if (!expiry.trim()) {
      return 'Expiry must be in MM/YY format.';
    }

    if (!cvv.trim()) {
      return 'CVV is required.';
=======
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
>>>>>>> b97bb2a5578a6ebbe5b954f4ae073ee17dd94cae
    }

    return null;
  };

  const handlePayment = async () => {
<<<<<<< HEAD
    if (loading || currentStatus === 'Paid') {
=======
    if (!appointment?._id) {
      Alert.alert('Error', 'Appointment details are missing.');
>>>>>>> b97bb2a5578a6ebbe5b954f4ae073ee17dd94cae
      return;
    }

    const validationMessage = validateCardInputs();
    if (validationMessage) {
      Alert.alert('Invalid Card Details', validationMessage);
      return;
    }

<<<<<<< HEAD
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
        paymentMethod: 'Credit Card',
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
=======
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
>>>>>>> b97bb2a5578a6ebbe5b954f4ae073ee17dd94cae

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
<<<<<<< HEAD
          editable={!isPaid && !loading}
=======
          editable={currentStatus !== 'Paid'}
>>>>>>> b97bb2a5578a6ebbe5b954f4ae073ee17dd94cae
        />

        <Text style={styles.label}>Card Number</Text>
        <TextInput
          style={styles.input}
          placeholder="1234 5678 9012 3456"
          placeholderTextColor="rgba(255,255,255,0.45)"
          value={cardNumber}
          onChangeText={(value) => setCardNumber(formatCardNumber(value))}
          keyboardType="number-pad"
<<<<<<< HEAD
          editable={!isPaid && !loading}
=======
          editable={currentStatus !== 'Paid'}
>>>>>>> b97bb2a5578a6ebbe5b954f4ae073ee17dd94cae
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
<<<<<<< HEAD
              editable={!isPaid && !loading}
=======
              editable={currentStatus !== 'Paid'}
>>>>>>> b97bb2a5578a6ebbe5b954f4ae073ee17dd94cae
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
<<<<<<< HEAD
              editable={!isPaid && !loading}
=======
              editable={currentStatus !== 'Paid'}
>>>>>>> b97bb2a5578a6ebbe5b954f4ae073ee17dd94cae
            />
          </View>
        </View>

        <Text style={styles.label}>Payment Status</Text>
<<<<<<< HEAD
        <Text style={[styles.status, statusStyle]}>
=======
        <Text style={[styles.status, currentStatus === 'Paid' ? styles.paid : styles.pending]}>
>>>>>>> b97bb2a5578a6ebbe5b954f4ae073ee17dd94cae
          {currentStatus}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
<<<<<<< HEAD
        disabled={loading || isPaid}
=======
        disabled={loading || currentStatus === 'Paid'}
>>>>>>> b97bb2a5578a6ebbe5b954f4ae073ee17dd94cae
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
<<<<<<< HEAD
    backgroundColor: '#102A43',
=======
    backgroundColor: '#0F172A',
>>>>>>> b97bb2a5578a6ebbe5b954f4ae073ee17dd94cae
    padding: 16
  },
  heading: {
    color: '#FFFFFF',
<<<<<<< HEAD
    backgroundColor: '#102A43',
=======
    fontSize: 22,
>>>>>>> b97bb2a5578a6ebbe5b954f4ae073ee17dd94cae
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
