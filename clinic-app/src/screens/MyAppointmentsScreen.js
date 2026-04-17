import React, { useContext, useEffect, useMemo, useState } from 'react';
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
import AppointmentCard from '../components/AppointmentCard';

export default function MyAppointmentsScreen() {
  const { user } = useContext(AuthContext);
  const { appointments, loading, fetchAppointmentsByPatient, updateAppointment } = useContext(AppointmentContext);
  const [refreshing, setRefreshing] = useState(false);
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

  const { upcomingAppointments, pastAppointments } = useMemo(() => {
    const now = new Date();
    const upcoming = [];
    const past = [];

    appointments.forEach((item) => {
      const appointmentDate = new Date(item.appointmentDate);
      const isUpcoming = appointmentDate >= now && item.status !== 'Cancelled';
      if (isUpcoming) {
        upcoming.push(item);
      } else {
        past.push(item);
      }
    });

    return {
      upcomingAppointments: upcoming,
      pastAppointments: past
    };
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

  const listData = [
    { type: 'header', title: 'Upcoming Appointments' },
    ...upcomingAppointments.map((item) => ({ type: 'appointment', appointment: item, section: 'upcoming' })),
    { type: 'header', title: 'Past & Cancelled Records' },
    ...pastAppointments.map((item) => ({ type: 'appointment', appointment: item, section: 'history' }))
  ];

  // Show loading state
  if (loading && appointments.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#38BDF8" />
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
            <AppointmentCard
              appointment={item.appointment}
              onCancel={
                item.section === 'upcoming'
                  ? () => handleCancelAppointment(item.appointment._id)
                  : null
              }
            />
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
<<<<<<< HEAD
    backgroundColor: '#102A43',
=======
    backgroundColor: '#0F172A',
>>>>>>> b97bb2a5578a6ebbe5b954f4ae073ee17dd94cae
    paddingHorizontal: 16,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#38BDF8',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptySubtext: {
    marginTop: 6,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: '#38BDF8',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 18,
    marginBottom: 4,
  },
});
