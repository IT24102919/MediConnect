import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function AppointmentCard({ appointment, onCancel }) {
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return '#38BDF8';
      case 'confirmed':
        return '#1D4ED8';
      case 'completed':
        return '#38BDF8';
      case 'cancelled':
        return '#1D4ED8';
      default:
        return '#1D4ED8';
    }
  };

  return (
    <View style={styles.card}>
      {/* Header with doctor name and status */}
      <View style={styles.header}>
        <Text style={styles.doctorName} numberOfLines={1}>
          {appointment.doctorId?.name || 'Doctor'}
        </Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(appointment.status) + '20' }
          ]}
        >
          <Text style={[styles.status, { color: getStatusColor(appointment.status) }]}>
            {appointment.status || 'Pending'}
          </Text>
        </View>
      </View>

      {/* Appointment Details */}
      <View style={styles.details}>
        <Text style={styles.detailRow}>
          📅 <Text style={styles.detailText}>{formatDate(appointment.appointmentDate)}</Text>
        </Text>
        <Text style={styles.detailRow}>
          🕐 <Text style={styles.detailText}>{appointment.timeSlot || 'N/A'}</Text>
        </Text>
        <Text style={styles.detailRow}>
          🏥{' '}
          <Text style={styles.detailText}>
            {appointment.doctorId?.specialization || 'Specialist'}
          </Text>
        </Text>
        {appointment.doctorId?.hospital && (
          <Text style={styles.detailRow}>
            📍 <Text style={styles.detailText}>{appointment.doctorId.hospital}</Text>
          </Text>
        )}
      </View>

      {/* Notes if any */}
      {appointment.notes && (
        <View style={styles.notesBox}>
          <Text style={styles.notesLabel}>Notes</Text>
          <Text style={styles.notesText} numberOfLines={2}>
            {appointment.notes}
          </Text>
        </View>
      )}

      {/* Symptoms if any */}
      {appointment.symptoms && (
        <View style={styles.symptomsBox}>
          <Text style={styles.symptomsLabel}>Symptoms</Text>
          <Text style={styles.symptomsText} numberOfLines={2}>
            {appointment.symptoms}
          </Text>
        </View>
      )}

      {onCancel && appointment.status !== 'Cancelled' && (
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancel Appointment</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#1D4ED8',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginLeft: 8,
  },
  status: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  details: {
    marginBottom: 12,
  },
  detailRow: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 6,
    fontWeight: '500',
  },
  detailText: {
    color: '#38BDF8',
    fontWeight: '600',
  },
  notesBox: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#38BDF8',
  },
  notesLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#38BDF8',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  symptomsBox: {
    backgroundColor: 'rgba(29, 78, 216, 0.1)',
    borderRadius: 10,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#1D4ED8',
  },
  symptomsLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1D4ED8',
    marginBottom: 4,
  },
  symptomsText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  cancelButton: {
    marginTop: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1D4ED8',
    backgroundColor: 'rgba(29, 78, 216, 0.14)',
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#38BDF8',
    fontWeight: '700',
    fontSize: 13,
  },
});



