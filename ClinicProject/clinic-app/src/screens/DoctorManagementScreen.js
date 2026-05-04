import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import axiosInstance from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { COLORS, SHADOWS, SPACING, BORDER_RADIUS } from '../../constants/theme';

export default function DoctorManagementScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get('/doctors');
      if (response.data.success) {
        setDoctors(response.data.doctors || []);
      } else {
        setError(response.data.message || 'Failed to load doctors.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load doctors.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleDeleteDoctor = (doctorId) => {
    Alert.alert(
      'Delete doctor profile',
      'This will permanently delete the doctor profile. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              const response = await axiosInstance.delete(`/doctors/${doctorId}`);
              if (response.data.success) {
                setDoctors((prev) => prev.filter((item) => item._id !== doctorId));
              } else {
                Alert.alert('Delete failed', response.data.message || 'Unable to delete doctor');
              }
            } catch (err) {
              Alert.alert('Delete failed', err.response?.data?.message || 'Unable to delete doctor');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.title}>Doctor Management</Text>
        <Text style={styles.subtitle}>View and delete doctor profiles</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : error ? (
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>{error}</Text>
        </View>
      ) : doctors.length === 0 ? (
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>No doctor profiles found.</Text>
        </View>
      ) : (
        doctors.map((doctor) => (
          <View key={doctor._id} style={[styles.card, SHADOWS.sm]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{doctor.name || 'Unnamed Doctor'}</Text>
              <Text style={styles.cardMeta}>{doctor.specialization || 'No specialization'}</Text>
            </View>
            <Text style={styles.cardSubtitle}>Hospital: {doctor.hospital || 'N/A'}</Text>
            <Text style={styles.cardSubtitle}>Fee: Rs. {doctor.fee ?? 'N/A'}</Text>
            <Text style={styles.cardSubtitle}>Available: {doctor.available ? 'Yes' : 'No'}</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteDoctor(doctor._id)}
            >
              <Text style={styles.deleteText}>Delete Doctor</Text>
            </TouchableOpacity>
          </View>
        ))
      )}

      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Back to Dashboard</Text>
      </TouchableOpacity>
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  scrollContent: {
    paddingBottom: SPACING.xl
  },
  header: {
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    ...SHADOWS.sm,
    marginBottom: SPACING.md
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: SPACING.lg
  },
  messageBox: {
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.sm,
    marginBottom: SPACING.md,
    marginHorizontal: SPACING.lg
  },
  messageText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    textAlign: 'center'
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.sm
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs
  },
  cardMeta: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600'
  },
  cardSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    marginBottom: SPACING.md
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600'
  },
  deleteButton: {
    marginTop: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.error,
    alignItems: 'center'
  },
  deleteText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700'
  },
  bottomSpacing: {
    height: SPACING.xl
  }
});