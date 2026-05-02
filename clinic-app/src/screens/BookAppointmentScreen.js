import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AppointmentContext } from '../context/AppointmentContext';
import { AuthContext } from '../context/AuthContext';

const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '02:00', '02:30', '03:00', '03:30', '04:00'];

export default function BookAppointmentScreen({ route, navigation }) {
  const { doctor } = route.params;
  const { user } = useContext(AuthContext);
  const { addAppointment, loading } = useContext(AppointmentContext);

  const [patientName, setPatientName] = useState(user?.name || '');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [dateValue, setDateValue] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notes, setNotes] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const isValidDateString = (value) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(value);
    return !Number.isNaN(date.getTime());
  };

  const handleConfirm = async () => {
    // Validate required fields
    if (!patientName.trim() || !appointmentDate.trim() || !selectedTime) {
      Alert.alert('Missing Info', 'Please fill in date, time, and patient name.');
      return;
    }

    if (!isValidDateString(appointmentDate.trim())) {
      Alert.alert('Invalid Date', 'Please enter date in YYYY-MM-DD format.');
      return;
    }

    // Prepare appointment data
    const appointmentData = {
      doctorId: doctor._id,
      patientName: patientName.trim(),
      appointmentDate: appointmentDate.trim(),
      timeSlot: selectedTime,
      notes: notes.trim() || ''
    };

    try {
      // Call API to create appointment
      const result = await addAppointment(appointmentData);

      if (result.success) {
        Alert.alert('Booking Success', 'Appointment booked successfully. Please complete payment.');
        navigation.navigate('Payment', {
          appointment: result.appointment,
          doctor
        });
      } else {
        Alert.alert('Booking Failed', result.message || 'Failed to book appointment');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (_event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (!selectedDate) return;
    setDateValue(selectedDate);
    setAppointmentDate(formatDate(selectedDate));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Book Appointment with {doctor.name}</Text>

      {/* Doctor Info */}
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName}>{doctor.name}</Text>
        <Text style={styles.doctorSpec}>{doctor.specialization}</Text>
        <Text style={styles.doctorHospital}>📍 {doctor.hospital}</Text>
        <View style={styles.feeBox}>
          <Text style={styles.feeLabel}>Consultation Fee:</Text>
          <Text style={styles.feeValue}>Rs. {doctor.fee}</Text>
        </View>
      </View>

      {/* Patient Name */}
      <Text style={styles.label}>Patient Name *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        placeholderTextColor="rgba(29, 78, 216, 0.45)"
        value={patientName}
        onChangeText={setPatientName}
      />

      {/* Appointment Date */}
      <Text style={styles.label}>Appointment Date (YYYY-MM-DD) *</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowDatePicker(true)}
        activeOpacity={0.85}
      >
        <Text style={appointmentDate ? styles.dateText : styles.datePlaceholder}>
          {appointmentDate || 'Select date from calendar'}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <View style={styles.datePickerWrap}>
          <DateTimePicker
            value={dateValue}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            minimumDate={new Date()}
            onChange={handleDateChange}
          />
          {Platform.OS === 'ios' && (
            <TouchableOpacity style={styles.dateDoneButton} onPress={() => setShowDatePicker(false)}>
              <Text style={styles.dateDoneText}>Done</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Time Slots */}
      <Text style={styles.label}>Select Time Slot *</Text>
      <View style={styles.timeRow}>
        {timeSlots.map((slot) => (
          <TouchableOpacity
            key={slot}
            style={[
              styles.timeButton,
              selectedTime === slot && styles.timeButtonActive
            ]}
            onPress={() => setSelectedTime(slot)}
          >
            <Text
              style={[
                styles.timeText,
                selectedTime === slot && styles.timeTextActive
              ]}
            >
              {slot}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Notes */}
      <Text style={styles.label}>Additional Notes (optional)</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Any additional information..."
        placeholderTextColor="rgba(29, 78, 216, 0.45)"
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={3}
      />

      {/* Confirm Button */}
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleConfirm}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Confirm Appointment</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1D4ED8',
    padding: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  doctorInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  doctorSpec: {
    fontSize: 14,
    color: '#38BDF8',
    fontWeight: '600',
    marginBottom: 2,
  },
  doctorHospital: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 10,
  },
  feeBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  feeLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
  },
  feeValue: {
    color: '#38BDF8',
    fontWeight: '700',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#FFFFFF',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    fontSize: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  timeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  timeButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  timeButtonActive: {
    backgroundColor: '#38BDF8',
    borderColor: '#38BDF8',
  },
  timeText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
    fontSize: 13,
  },
  timeTextActive: {
    color: '#FFFFFF',
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: 15,
  },
  datePlaceholder: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 15,
  },
  datePickerWrap: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    marginBottom: 12,
    overflow: 'hidden',
  },
  dateDoneButton: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 10,
    alignItems: 'center',
  },
  dateDoneText: {
    color: '#38BDF8',
    fontWeight: '700',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#38BDF8',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});



