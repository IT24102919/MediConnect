import React, { useCallback, useContext, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NotificationContext } from '../context/NotificationContext';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString();
};

const reminderTypeLabel = (type) => {
  if (type === 'appointment_reminder_24h') return '24h before';
  if (type === 'appointment_reminder_1h') return '1h before';
  return 'Reminder';
};

export default function RemindersScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const isFirstFocus = useRef(true);
  const {
    upcomingReminders,
    loading,
    fetchUpcomingReminders,
    deleteNotificationById,
    createManualReminder,
    snoozeReminderById
  } = useContext(NotificationContext);

  useFocusEffect(
    useCallback(() => {
      if (isFirstFocus.current) {
        isFirstFocus.current = false;
      }
      fetchUpcomingReminders();
    }, [fetchUpcomingReminders])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUpcomingReminders();
    setRefreshing(false);
  }, [fetchUpcomingReminders]);

  const onCreateReminder = async () => {
    if (!title.trim() || !message.trim() || !reminderDate.trim() || !reminderTime.trim()) {
      Alert.alert('Invalid input', 'Enter title, message, date and time.');
      return;
    }

    // Accept date: YYYY-MM-DD, time: HH:mm (24h)
    const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(reminderDate.trim());
    const timeMatch = /^(\d{2}):(\d{2})$/.exec(reminderTime.trim());
    if (!dateMatch || !timeMatch) {
      Alert.alert('Invalid format', 'Use date as YYYY-MM-DD and time as HH:mm (24-hour).');
      return;
    }

    const year = Number(dateMatch[1]);
    const month = Number(dateMatch[2]) - 1;
    const day = Number(dateMatch[3]);
    const hour = Number(timeMatch[1]);
    const minute = Number(timeMatch[2]);

    const localDateTime = new Date(year, month, day, hour, minute, 0, 0);
    if (Number.isNaN(localDateTime.getTime())) {
      Alert.alert('Invalid date/time', 'Please enter a valid date and time.');
      return;
    }
    if (localDateTime <= new Date()) {
      Alert.alert('Invalid date/time', 'Reminder time must be in the future.');
      return;
    }

    const reminderAt = localDateTime.toISOString();
    const result = await createManualReminder({
      title: title.trim(),
      message: message.trim(),
      reminderAt
    });

    if (result.success) {
      setTitle('');
      setMessage('');
      setReminderDate('');
      setReminderTime('');
      setShowAddForm(false);
      Alert.alert('Success', 'Manual reminder added.');
    } else {
      Alert.alert('Error', result.message || 'Failed to add reminder');
    }
  };

  const confirmDelete = (id) => {
    Alert.alert('Delete reminder', 'Are you sure you want to delete this reminder?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteNotificationById(id) }
    ]);
  };

  const onSnooze = async (id, minutes = 10) => {
    const result = await snoozeReminderById(id, minutes);
    if (!result.success) {
      Alert.alert('Error', result.message || 'Failed to snooze reminder');
    }
  };

  const renderReminder = ({ item }) => (
    <View style={styles.cardRow}>
      <View style={styles.cardLeft}>
        <Text style={styles.badge}>{reminderTypeLabel(item.type)}</Text>
        <Text style={styles.title}>Reminder fires: {formatDate(item.reminderAt)}</Text>
        <Text style={styles.message}>{item.message || item.title}</Text>
        <View style={styles.snoozeRow}>
          <TouchableOpacity style={styles.snoozeButton} onPress={() => onSnooze(item._id, 1440)}>
            <Text style={styles.snoozeText}>Snooze 24h</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.cardDivider} />
      <TouchableOpacity style={styles.cardRight} onPress={() => confirmDelete(item._id)}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.helperText}>
          Scheduled reminders appear here. When the time is reached, you also get a notification.
        </Text>
        <TouchableOpacity
          style={styles.plusButton}
          onPress={() => setShowAddForm((prev) => !prev)}
        >
          <Text style={styles.plusText}>+ Add reminder</Text>
        </TouchableOpacity>
      </View>

      {showAddForm ? (
        <View style={styles.formCard}>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Reminder title"
            placeholderTextColor="rgba(255,255,255,0.5)"
            style={styles.input}
          />
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Reminder message"
            placeholderTextColor="rgba(255,255,255,0.5)"
            style={styles.input}
          />
          <TextInput
            value={reminderDate}
            onChangeText={setReminderDate}
            placeholder="Date (YYYY-MM-DD)"
            placeholderTextColor="rgba(255,255,255,0.5)"
            style={styles.input}
          />
          <TextInput
            value={reminderTime}
            onChangeText={setReminderTime}
            placeholder="Time (HH:mm)"
            placeholderTextColor="rgba(255,255,255,0.5)"
            style={styles.input}
          />
          <TouchableOpacity style={styles.addButton} onPress={onCreateReminder}>
            <Text style={styles.addButtonText}>Save reminder</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {loading && !refreshing ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color="#38BDF8" />
        </View>
      ) : (
        <FlatList
          data={upcomingReminders}
          keyExtractor={(item) => item._id}
          renderItem={renderReminder}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#38BDF8" />
          }
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyIcon}>⏰</Text>
              <Text style={styles.emptyTitle}>No reminders yet</Text>
              <Text style={styles.empty}>Create one manually to see it here.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1D4ED8',
    padding: 16
  },
  loaderWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  listContent: {
    paddingBottom: 24
  },
  topRow: {
    marginBottom: 12
  },
  helperText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10
  },
  plusButton: {
    alignSelf: 'flex-end',
    borderWidth: 1,
    borderColor: '#38BDF8',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  plusText: {
    color: '#38BDF8',
    fontWeight: '700'
  },
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    padding: 12,
    marginBottom: 12
  },
  input: {
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 8,
    backgroundColor: 'rgba(255,255,255,0.06)'
  },
  addButton: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderWidth: 1,
    borderColor: '#38BDF8',
    borderRadius: 10,
    paddingVertical: 9,
    alignItems: 'center'
  },
  addButtonText: {
    color: '#38BDF8',
    fontWeight: '700'
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.35)',
    marginBottom: 10,
    overflow: 'hidden'
  },
  cardLeft: {
    flex: 1,
    padding: 14
  },
  cardDivider: {
    width: StyleSheet.hairlineWidth * 2,
    backgroundColor: 'rgba(255, 255, 255, 0.22)'
  },
  cardRight: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 14,
    minWidth: 84
  },
  badge: {
    alignSelf: 'flex-start',
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.35)',
    marginBottom: 8
  },
  title: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700'
  },
  message: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 6
  },
  meta: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    marginTop: 10
  },
  empty: {
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginTop: 32
  },
  emptyWrap: {
    alignItems: 'center',
    marginTop: 28
  },
  emptyIcon: {
    fontSize: 34,
    marginBottom: 8
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 18
  },
  snoozeRow: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  snoozeButton: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderWidth: 1,
    borderColor: '#38BDF8',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  snoozeText: {
    color: '#38BDF8',
    fontWeight: '700',
    fontSize: 12
  },
  deleteText: {
    color: '#FDBA74',
    fontWeight: '700',
    fontSize: 20
  }
});
