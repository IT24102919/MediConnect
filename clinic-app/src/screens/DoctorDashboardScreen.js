import React, { useContext, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { COLORS, SHADOWS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import axiosInstance from '../api/axios';
import { useFocusEffect } from '@react-navigation/native';

export default function DoctorDashboardScreen({ navigation }) {
  const { logout, token, user, deleteAccount } = useContext(AuthContext);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    const baseURL = axiosInstance.defaults.baseURL;
    const backendUrl = baseURL.replace('/api', '');
    return `${backendUrl}${imagePath}`;
  };

  useEffect(() => {
    fetchDoctorProfile();
    fetchAppointments();
  }, []);

  //refreshes data when returning to this screen
  useFocusEffect(
    useCallback(() => {
      fetchDoctorProfile();
      fetchAppointments();
    }, [])
  );

  const fetchDoctorProfile = async () => {
    try {
      const response = await axiosInstance.get('/doctors');
      const profile = response.data.doctors.find(doc => doc.name === user.name);
      setDoctorProfile(profile);
    } catch (error) {
      console.log("Error fetching profile:", error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await axiosInstance.get('/appointments');
      const myAppointments = response.data.appointments?.filter(
        apt => apt.doctorId === doctorProfile?._id
      ) || [];
      setAppointments(myAppointments);
    } catch (error) {
      console.log("Error fetching appointments:", error);
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
              doctorData: doctorProfile  //Pass the existing profile data to edit form
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
        <Text style={styles.sectionTitle}>Today's Appointments</Text>
        {appointments.length === 0 ? (
          <Text style={styles.emptyText}>No appointments yet</Text>
        ) : (
          appointments.map(apt => (
            <View key={apt._id} style={styles.appointmentItem}>
              <Text style={styles.patientName}>{apt.patientName}</Text>
              <Text style={styles.appointmentTime}>{apt.timeSlot}</Text>
              <Text style={[styles.status,
              apt.status === 'Confirmed' ? styles.confirmed : styles.pending]}>
                {apt.status}
              </Text>
            </View>
          ))
        )}
      </View>
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
    borderColor: COLORS.error,
  },
  deleteButtonText: {
    color: COLORS.error,
    fontWeight: '600',
  },
  appointmentsCard: {
    margin: SPACING.xl,
    padding: SPACING.xl,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.md,
  },
  appointmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.textMuted,
    opacity: 0.2,
  },
  patientName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.dark,
  },
  appointmentTime: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
  },
  confirmed: {
    backgroundColor: COLORS.primary,
    color: COLORS.white,
  },
  pending: {
    backgroundColor: COLORS.secondary,
    color: COLORS.dark,
  },
  emptyText: {
    color: COLORS.textLight,
    textAlign: 'center',
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
});