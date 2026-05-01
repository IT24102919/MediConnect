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
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
  },
  welcome: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  logoutButton: {
    padding: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  logoutText: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
  profileCard: {
    margin: 20,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  profileText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
  },
  editButton: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#38BDF8',
    borderRadius: 10,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  deleteButton: {
    marginTop: 8,
    padding: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  deleteButtonText: {
    color: '#EF4444',
    fontWeight: '600',
  },
  appointmentsCard: {
    margin: 20,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
  },
  appointmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  patientName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  appointmentTime: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confirmed: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    color: '#22C55E',
  },
  pending: {
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    color: '#FBBF24',
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    paddingVertical: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
    alignSelf: 'center',
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    alignSelf: 'center',
  },
  profileImagePlaceholderText: {
    fontSize: 40,
  },
});