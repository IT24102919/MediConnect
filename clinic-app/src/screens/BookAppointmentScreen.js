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
import { COLORS, SHADOWS, SPACING, BORDER_RADIUS } from '../../constants/theme';

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
        placeholderTextColor="rgba(56, 189, 248, 0.45)"
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
        placeholderTextColor="rgba(56, 189, 248, 0.45)"
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
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: SPACING.lg,
  },
  doctorInfo: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    ...SHADOWS.md,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: SPACING.sm,
  },
  doctorSpec: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  doctorHospital: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: SPACING.md,
  },
  feeBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.textMuted,
    opacity: 0.2,
  },
  feeLabel: {
    color: COLORS.text,
    fontWeight: '600',
  },
  feeValue: {
    color: COLORS.accent,
    fontWeight: '700',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: SPACING.md,
    marginTop: SPACING.lg,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    color: COLORS.dark,
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.primary,
    fontSize: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: SPACING.lg,
  },
  timeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.lg,
    gap: SPACING.md,
  },
  timeButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  timeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  timeText: {
    color: COLORS.dark,
    fontWeight: '600',
    fontSize: 13,
  },
  timeTextActive: {
    color: COLORS.white,
  },
  dateText: {
    color: COLORS.dark,
    fontSize: 15,
  },
  datePlaceholder: {
    color: COLORS.textLight,
    fontSize: 15,
  },
  datePickerWrap: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  dateDoneButton: {
    borderTopWidth: 1,
    borderTopColor: COLORS.primary,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  dateDoneText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  button: {
    backgroundColor: COLORS.accent,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.xl,
    ...SHADOWS.lg,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 16,
  },
});





