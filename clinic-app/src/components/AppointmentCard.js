import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SHADOWS, SPACING, BORDER_RADIUS } from '../../constants/theme';

export default function AppointmentCard({ appointment, onCancel, onDelete, onEdit, onStatusPress }) {
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
        return COLORS.warning;
      case 'confirmed':
        return COLORS.primary;
      case 'completed':
        return COLORS.success;
      case 'cancelled':
        return COLORS.error;
      default:
        return COLORS.primary;
    }
  };

  return (
    <View style={styles.card}>
      {/* Header with doctor name and status */}
      <View style={styles.header}>
        <Text style={styles.doctorName} numberOfLines={1}>
          {appointment.doctorId?.name || 'Doctor'}
        </Text>
        <TouchableOpacity
          style={[
            styles.statusBadge,
            onStatusPress && appointment.status?.toLowerCase() === 'pending' && styles.statusBadgeAction,
            { backgroundColor: getStatusColor(appointment.status) + '20' }
          ]}
          onPress={onStatusPress}
          disabled={!onStatusPress || appointment.status?.toLowerCase() !== 'pending'}
        >
          <Text style={[styles.status, { color: getStatusColor(appointment.status) }]}>
            {appointment.status || 'Pending'}
          </Text>
        </TouchableOpacity>
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

      {onEdit && appointment.status !== 'Cancelled' && (
        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
          <Text style={styles.editButtonText}>Edit Appointment</Text>
        </TouchableOpacity>
      )}

      {onDelete && (
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Text style={styles.deleteButtonText}>Delete Record</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    marginTop: SPACING.md,
    borderWidth: 0,
    borderColor: COLORS.primary,
    ...SHADOWS.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.dark,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    marginLeft: SPACING.md,
  },
  statusBadgeAction: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  status: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  details: {
    marginBottom: SPACING.md,
  },
  detailRow: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: SPACING.md,
    fontWeight: '500',
  },
  detailText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  notesBox: {
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.secondary,
  },
  notesLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: SPACING.sm,
  },
  notesText: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  symptomsBox: {
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.secondary,
  },
  symptomsLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: SPACING.sm,
  },
  symptomsText: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  cancelButton: {
    marginTop: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.accent,
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  cancelButtonText: {
    color: COLORS.accent,
    fontWeight: '700',
    fontSize: 13,
  },
  editButton: {
    marginTop: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  editButtonText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  deleteButton: {
    marginTop: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.error,
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  deleteButtonText: {
    color: COLORS.error,
    fontWeight: '700',
    fontSize: 13,
  },
});



