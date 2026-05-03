import React, { useContext, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  TextInput,
  Modal
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { AppointmentContext } from '../context/AppointmentContext';
import { COLORS, SHADOWS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import axiosInstance from '../api/axios';
import { useFocusEffect } from '@react-navigation/native';

export default function DoctorDashboardScreen({ navigation }) {
  const { logout, token, user, deleteAccount } = useContext(AuthContext);
  const { fetchAppointmentsByDoctor, updateAppointment, loading } = useContext(AppointmentContext);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('today'); // 'today' or 'all'
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    const baseURL = axiosInstance.defaults.baseURL;
    const backendUrl = baseURL.replace('/api', '');
    return `${backendUrl}${imagePath}`;
  };

  useEffect(() => {
    fetchDoctorProfile();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchDoctorProfile();
      if (doctorProfile?._id) {
        loadAppointments();
      }
    }, [doctorProfile?._id, filter])
  );

  const fetchDoctorProfile = async () => {
    try {
      const response = await axiosInstance.get('/doctors');
      const profile = response.data.doctors.find(doc => doc.name === user.name);
      setDoctorProfile(profile);
      if (profile?._id) {
        loadAppointments();
      }
    } catch (error) {
      console.log("Error fetching profile:", error);
    }
  };

  const loadAppointments = async () => {
    if (!doctorProfile?._id) return;
    const result = await fetchAppointmentsByDoctor(doctorProfile._id, filter);
    if (result.success) {
      setAppointments(result.appointments);
    }
  };

  const handleAcceptAppointment = async (appointment) => {
    Alert.alert(
      'Confirm Appointment',
      `Accept appointment with ${appointment.patientName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: async () => {
            const result = await updateAppointment(appointment._id, { status: 'Confirmed' });
            if (result.success) {
              Alert.alert('Success', 'Appointment confirmed');
              loadAppointments();
            } else {
              Alert.alert('Error', result.message);
            }
          }
        }
      ]
    );
  };

  const handleRejectPress = (appointment) => {
    setSelectedAppointment(appointment);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const submitRejection = async () => {
    if (!rejectionReason.trim()) {
      Alert.alert('Error', 'Please provide a reason for rejection');
      return;
    }

    const result = await updateAppointment(selectedAppointment._id, {
      status: 'Rejected',
      rejectionReason: rejectionReason.trim()
    });

    if (result.success) {
      Alert.alert('Success', 'Appointment rejected');
      setShowRejectModal(false);
      setSelectedAppointment(null);
      setRejectionReason('');
      loadAppointments();
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigation.replace('Login');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      '⚠️ WARNING: This action is permanent!\n\nDeleting your account will:\n• Remove your doctor profile\n• Cancel all your appointments\n\nThis cannot be undone.\n\nAre you sure you want to delete your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteAccount();
            if (result.success) {
              Alert.alert('Account Deleted', 'Your account has been deleted.');
              navigation.replace('Login');
            } else {
              Alert.alert('Error', result.message);
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return styles.confirmed;
      case 'Pending': return styles.pending;
      case 'Rejected': return styles.rejected;
      case 'Cancelled': return styles.cancelled;
      default: return styles.pending;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome, Dr. {user?.name}</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {doctorProfile && (
        <View style={styles.profileCard}>
          <Text style={styles.sectionTitle}>Your Profile</Text>
          {doctorProfile.image ? (
            <Image
              source={{ uri: getImageUrl(doctorProfile.image) }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.profileImagePlaceholderText}>👨‍⚕️</Text>
            </View>
          )}
          <Text style={styles.profileText}>🏥 {doctorProfile.hospital}</Text>
          <Text style={styles.profileText}>⚕️ {doctorProfile.specialization}</Text>
          <Text style={styles.profileText}>📅 {doctorProfile.experience} years</Text>
          <Text style={styles.profileText}>💰 Rs. {doctorProfile.fee}</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('CompleteProfile', {
              isEditing: true,
              doctorData: doctorProfile
            })}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.deleteButtonText}>🗑️ Delete Account</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.appointmentsCard}>
        <View style={styles.filterRow}>
          <Text style={styles.sectionTitle}>Appointments</Text>
          <View style={styles.filterButtons}>
            <TouchableOpacity
              style={[styles.filterButton, filter === 'today' && styles.filterButtonActive]}
              onPress={() => setFilter('today')}
            >
              <Text style={[styles.filterText, filter === 'today' && styles.filterTextActive]}>Today</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
              onPress={() => setFilter('all')}
            >
              <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>All</Text>
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <Text style={styles.loadingText}>Loading appointments...</Text>
        ) : appointments.length === 0 ? (
          <Text style={styles.emptyText}>No appointments {filter === 'today' ? 'today' : ''}</Text>
        ) : (
          appointments.map(apt => (
            <View key={apt._id} style={styles.appointmentCard}>
              <View style={styles.appointmentHeader}>
                <Text style={styles.patientName}>{apt.patientName || apt.patientId?.name}</Text>
                <Text style={[styles.status, getStatusColor(apt.status)]}>
                  {apt.status}
                </Text>
              </View>
              <Text style={styles.appointmentDetails}>📅 {new Date(apt.appointmentDate).toDateString()}</Text>
              <Text style={styles.appointmentDetails}>⏰ {apt.timeSlot}</Text>
              {apt.notes ? <Text style={styles.notes}>📝 Notes: {apt.notes}</Text> : null}
              {apt.rejectionReason ? <Text style={styles.rejectionReason}>❌ Reason: {apt.rejectionReason}</Text> : null}
              
              {apt.status === 'Pending' && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.acceptButton]}
                    onPress={() => handleAcceptAppointment(apt)}
                  >
                    <Text style={styles.actionButtonText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.rejectButton]}
                    onPress={() => handleRejectPress(apt)}
                  >
                    <Text style={styles.actionButtonText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
      </View>

      {/* Rejection Reason Modal */}
      <Modal
        visible={showRejectModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowRejectModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rejection Reason</Text>
            <Text style={styles.modalSubtitle}>Please provide a reason for rejecting this appointment</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter reason..."
              placeholderTextColor={COLORS.textMuted}
              value={rejectionReason}
              onChangeText={setRejectionReason}
              multiline
              numberOfLines={3}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelModalButton]}
                onPress={() => setShowRejectModal(false)}
              >
                <Text style={styles.cancelModalText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitModalButton]}
                onPress={submitRejection}
              >
                <Text style={styles.submitModalText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.xxl,
    paddingTop: SPACING.xxxl,
    backgroundColor: COLORS.dark,
    ...SHADOWS.lg,
  },
  welcome: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
  },
  logoutButton: {
    padding: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.accent,
    borderRadius: BORDER_RADIUS.md,
  },
  logoutText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  profileCard: {
    margin: SPACING.xl,
    padding: SPACING.xl,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: SPACING.md,
  },
  profileText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: SPACING.md,
  },
  editButton: {
    marginTop: SPACING.md,
    padding: SPACING.lg,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  editButtonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  deleteButton: {
    marginTop: SPACING.md,
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgb(234, 111, 111)',
  },
  deleteButtonText: {
    color: 'rgb(234, 111, 111)',
    fontWeight: '600',
  },
  appointmentsCard: {
    margin: SPACING.xl,
    padding: SPACING.xl,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.md,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  filterButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  filterTextActive: {
    color: COLORS.white,
  },
  appointmentCard: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.dark,
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  confirmed: {
    backgroundColor: COLORS.success,
    color: COLORS.white,
  },
  pending: {
    backgroundColor: COLORS.warning,
    color: COLORS.white,
  },
  rejected: {
    backgroundColor: COLORS.error,
    color: COLORS.white,
  },
  cancelled: {
    backgroundColor: COLORS.textMuted,
    color: COLORS.white,
  },
  appointmentDetails: {
    fontSize: 13,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  notes: {
    fontSize: 12,
    color: COLORS.textLight,
    fontStyle: 'italic',
    marginTop: SPACING.sm,
  },
  rejectionReason: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: SPACING.sm,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  actionButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    minWidth: 80,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: 'rgb(84, 198, 103)',
  },
  rejectButton: {
    backgroundColor: 'rgb(234, 111, 111)',
  },
  actionButtonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textLight,
    paddingVertical: SPACING.xl,
  },
  loadingText: {
    textAlign: 'center',
    color: COLORS.primary,
    paddingVertical: SPACING.xl,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: SPACING.md,
    alignSelf: 'center',
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    alignSelf: 'center',
  },
  profileImagePlaceholderText: {
    fontSize: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    width: '85%',
    ...SHADOWS.lg,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: SPACING.sm,
  },
  modalSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: SPACING.lg,
  },
  modalInput: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    minHeight: 100,
    textAlignVertical: 'top',
    color: COLORS.dark,
    marginBottom: SPACING.xl,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.md,
  },
  modalButton: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelModalButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  submitModalButton: {
    backgroundColor: COLORS.primary,
  },
  cancelModalText: {
    color: COLORS.error,
    fontWeight: '600',
  },
  submitModalText: {
    color: COLORS.white,
    fontWeight: '600',
  },
});