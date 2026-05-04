import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import { AppointmentContext } from '../context/AppointmentContext';
import { AuthContext } from '../context/AuthContext';
import { COLORS, SHADOWS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import AppointmentCard from '../components/AppointmentCard';

export default function AppointmentRecordsScreen() {
  const { user } = useContext(AuthContext);
  const { loading, appointmentRecords, fetchAppointmentRecordsByPatient, deleteAppointment } = useContext(AppointmentContext);
  const [refreshing, setRefreshing] = useState(false);

  const patientId = user?._id || user?.id;

  useEffect(() => {
    if (patientId) {
      fetchAppointmentRecordsByPatient(patientId);
    }
  }, [patientId, fetchAppointmentRecordsByPatient]);

  const onRefresh = async () => {
    if (!patientId) return;

    setRefreshing(true);
    await fetchAppointmentRecordsByPatient(patientId);
    setRefreshing(false);
  };

  const handleDeleteRecord = (appointmentId) => {
    Alert.alert('Delete Appointment Record', 'Are you sure you want to delete this record?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, Delete',
        style: 'destructive',
        onPress: async () => {
          const result = await deleteAppointment(appointmentId);
          if (result.success) {
            Alert.alert('Deleted', 'Appointment record deleted successfully.');
            await fetchAppointmentRecordsByPatient(patientId);
          } else {
            Alert.alert('Error', result.message || 'Could not delete appointment record.');
          }
        }
      }
    ]);
  };

  if (loading && appointmentRecords.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading appointment records...</Text>
      </View>
    );
  }

  if (appointmentRecords.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.emptyIcon}>📁</Text>
        <Text style={styles.emptyTitle}>No Records Yet</Text>
        <Text style={styles.emptySubtext}>Past and cancelled appointments will appear here.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={appointmentRecords}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <AppointmentCard
            appointment={item}
            onDelete={() => handleDeleteRecord(item._id)}
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={styles.sectionTitle}>Past and Cancelled Appointment Records</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600'
  },
  sectionTitle: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '700',
    marginTop: SPACING.lg,
    marginBottom: SPACING.md
  },
  emptyIcon: {
    fontSize: 46,
    marginBottom: SPACING.md
  },
  emptyTitle: {
    color: COLORS.dark,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: SPACING.md
  },
  emptySubtext: {
    color: COLORS.textLight,
    textAlign: 'center'
  }
});






