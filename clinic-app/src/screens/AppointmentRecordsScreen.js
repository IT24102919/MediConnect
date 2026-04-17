import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { AppointmentContext } from '../context/AppointmentContext';
import { AuthContext } from '../context/AuthContext';
import AppointmentCard from '../components/AppointmentCard';

export default function AppointmentRecordsScreen() {
  const { user } = useContext(AuthContext);
  const { loading, appointmentRecords, fetchAppointmentRecordsByPatient } = useContext(AppointmentContext);
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

  if (loading && appointmentRecords.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#38BDF8" />
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
        renderItem={({ item }) => <AppointmentCard appointment={item} />}
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
<<<<<<< HEAD
    backgroundColor: '#102A43',
=======
    backgroundColor: '#0F172A',
>>>>>>> b97bb2a5578a6ebbe5b954f4ae073ee17dd94cae
    paddingHorizontal: 16
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 12,
    color: '#38BDF8',
    fontSize: 16,
    fontWeight: '600'
  },
  sectionTitle: {
    color: '#38BDF8',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8
  },
  emptyIcon: {
    fontSize: 46,
    marginBottom: 12
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6
  },
  emptySubtext: {
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center'
  }
});