import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { AppointmentContext } from '../context/AppointmentContext';
import { AuthContext } from '../context/AuthContext';
import { COLORS, SHADOWS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import AppointmentCard from '../components/AppointmentCard';

export default function MyAppointmentsScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const { appointments, loading, fetchAppointmentsByPatient, updateAppointment } = useContext(AppointmentContext);
  const [refreshing, setRefreshing] = useState(false);
  const [editingAppointmentId, setEditingAppointmentId] = useState(null);
  const [editDate, setEditDate] = useState('');
  const [editTimeSlot, setEditTimeSlot] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const patientId = user?._id || user?.id;

  // Fetch appointments when component mounts
  useEffect(() => {
    if (patientId) {
      fetchAppointmentsByPatient(patientId);
    }
  }, [patientId, fetchAppointmentsByPatient]);

  // Handle manual refresh
  const onRefresh = async () => {
    if (patientId) {
      setRefreshing(true);
      await fetchAppointmentsByPatient(patientId);
      setRefreshing(false);
    }
  };

  const upcomingAppointments = useMemo(() => {
    const now = new Date();
    const upcoming = [];

    appointments.forEach((item) => {
      const appointmentDate = new Date(item.appointmentDate);
      const isUpcoming = appointmentDate >= now && item.status !== 'Cancelled';
      if (isUpcoming) {
        upcoming.push(item);
      }
    });

    return upcoming;
  }, [appointments]);

  const handleCancelAppointment = (appointmentId) => {
    Alert.alert('Cancel Appointment', 'Are you sure you want to cancel this appointment?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, Cancel',
        style: 'destructive',
        onPress: async () => {
          const result = await updateAppointment(appointmentId, { status: 'Cancelled' });
          if (result.success) {
            Alert.alert('Cancelled', 'Your appointment has been cancelled.');
          } else {
            Alert.alert('Error', result.message || 'Could not cancel appointment.');
          }
        }
      }
    ]);
  };

  const handlePendingStatusPress = (appointment) => {
    if (appointment?.status?.toLowerCase() !== 'pending') return;

    navigation.navigate('Payment', {
      appointment,
      doctor: appointment?.doctorId || {}
    });
  };

  const startEditingAppointment = (appointment) => {
    const normalizedDate = appointment?.appointmentDate
      ? new Date(appointment.appointmentDate).toISOString().split('T')[0]
      : '';
    setEditingAppointmentId(appointment._id);
    setEditDate(normalizedDate);
    setEditTimeSlot(appointment?.timeSlot || '');
    setEditNotes(appointment?.notes || '');
  };

  const cancelEditingAppointment = () => {
    setEditingAppointmentId(null);
    setEditDate('');
    setEditTimeSlot('');
    setEditNotes('');
  };

  const handleUpdateAppointment = async () => {
    if (!editingAppointmentId) return;
    if (!editDate.trim() || !editTimeSlot.trim()) {
      Alert.alert('Missing Info', 'Please provide date and time.');
      return;
    }

    try {
      setUpdating(true);
      const result = await updateAppointment(editingAppointmentId, {
        appointmentDate: editDate.trim(),
        timeSlot: editTimeSlot.trim(),
        notes: editNotes.trim()
      });

      if (result.success) {
        Alert.alert('Updated', 'Appointment updated successfully.');
        cancelEditingAppointment();
      } else {
        Alert.alert('Error', result.message || 'Could not update appointment.');
      }
    } finally {
      setUpdating(false);
    }
  };

  const listData = upcomingAppointments.length
    ? [
      { type: 'header', title: 'Upcoming Appointments' },
      ...upcomingAppointments.map((item) => ({ type: 'appointment', appointment: item, section: 'upcoming' }))
    ]
    : [];

  // Show loading state
  if (loading && appointments.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading your appointments...</Text>
      </View>
    );
  }

  // Show empty state
  if (appointments.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.emptyIcon}>📅</Text>
        <Text style={styles.emptyText}>No Appointments Yet</Text>
        <Text style={styles.emptySubtext}>
          Book an appointment with a doctor to see it here
        </Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={listData}
        keyExtractor={(item, index) =>
          item.type === 'header' ? `${item.title}-${index}` : item.appointment._id
        }
        renderItem={({ item }) => {
          if (item.type === 'header') {
            return <Text style={styles.sectionTitle}>{item.title}</Text>;
          }

          return (
            <View>
              <AppointmentCard
                appointment={item.appointment}
                onCancel={
                  item.section === 'upcoming'
                    ? () => handleCancelAppointment(item.appointment._id)
                    : null
                }
                onEdit={
                  item.section === 'upcoming'
                    ? () => startEditingAppointment(item.appointment)
                    : null
                }
                onStatusPress={
                  item.section === 'upcoming'
                    ? () => handlePendingStatusPress(item.appointment)
                    : null
                }
              />
              {editingAppointmentId === item.appointment._id && (
                <View style={styles.editPanel}>
                  <Text style={styles.editTitle}>Edit Appointment</Text>
                  <TextInput
                    style={styles.editInput}
                    placeholder="Date (YYYY-MM-DD)"
                    placeholderTextColor={COLORS.textMuted}
                    value={editDate}
                    onChangeText={setEditDate}
                  />
                  <TextInput
                    style={styles.editInput}
                    placeholder="Time slot (e.g. 10:00 AM)"
                    placeholderTextColor={COLORS.textMuted}
                    value={editTimeSlot}
                    onChangeText={setEditTimeSlot}
                  />
                  <TextInput
                    style={[styles.editInput, styles.editNotesInput]}
                    placeholder="Notes (optional)"
                    placeholderTextColor={COLORS.textMuted}
                    value={editNotes}
                    onChangeText={setEditNotes}
                    multiline
                  />
                  <TouchableOpacity
                    style={[styles.updateButton, updating && styles.disabledButton]}
                    onPress={handleUpdateAppointment}
                    disabled={updating}
                  >
                    <Text style={styles.updateButtonText}>{updating ? 'Updating...' : 'Save Changes'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.closeEditButton}
                    onPress={cancelEditingAppointment}
                    disabled={updating}
                  >
                    <Text style={styles.closeEditButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptySubtext}>No appointment records found.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.lg,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: SPACING.md,
  },
  emptySubtext: {
    marginTop: SPACING.md,
    color: COLORS.textLight,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
  },
  sectionTitle: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '700',
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  editPanel: {
    marginTop: -2,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.white,
    borderWidth: 0,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    ...SHADOWS.md,
  },
  editTitle: {
    color: COLORS.dark,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  editInput: {
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    color: COLORS.dark,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.md,
  },
  editNotesInput: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  updateButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.md,
    ...SHADOWS.sm,
  },
  updateButtonText: {
    color: COLORS.white,
    fontWeight: '700',
  },
  closeEditButton: {
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  closeEditButtonText: {
    color: COLORS.text,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.7,
  },
});









