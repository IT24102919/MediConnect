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
  View,
  Platform
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Calendar } from 'react-native-calendars';
import { NotificationContext } from '../context/NotificationContext';
import { COLORS, SPACING, BORDER_RADIUS } from '../../constants/theme';

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
  
  // Calendar and Time Picker states
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [selectedAmPm, setSelectedAmPm] = useState('AM');
  
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

  // Calendar date selection handler
  const onDateSelect = (day) => {
    const today = new Date();
    const selectedDay = new Date(day.dateString);
    
    // Validation: cannot select past date
    if (selectedDay < today.setHours(0, 0, 0, 0)) {
      Alert.alert('Invalid Date', 'Cannot select a past date');
      return;
    }
    
    setSelectedDate(day.dateString);
    setReminderDate(day.dateString);
    setShowCalendar(false);
  };

  const formatDateWithAmPm = (dateString) => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';
  
  const formattedDate = date.toLocaleDateString();
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // Convert 0 to 12
  const minutesStr = minutes.toString().padStart(2, '0');
  const timeWithAmPm = `${hours}:${minutesStr} ${ampm}`;
  
  return `${formattedDate} at ${timeWithAmPm}`;
};
  // Time picker handler
 const handleTimeConfirm = (selectedDateTime) => {
  setTimePickerVisible(false);
  
  const now = new Date();
  const selected = new Date(selectedDateTime);
  
  // Validation: cannot select past time for today
  const selectedDateObj = new Date(reminderDate);
  const isToday = selectedDateObj.toDateString() === now.toDateString();
  
  if (isToday && selected < now) {
    Alert.alert('Invalid Time', 'Cannot select a past time for today');
    return;
  }
  
  setSelectedTime(selected);
  
  // Get hours in 12-hour format for AM/PM display
  let hours = selected.getHours();
  const minutes = selected.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // Convert 0 to 12
  
  setSelectedAmPm(ampm);
  
  // Format time as HH:MM (24-hour format for storage)
  const hours24 = selected.getHours().toString().padStart(2, '0');
  const minutesStr = minutes.toString().padStart(2, '0');
  const timeString = `${hours24}:${minutesStr}`;
  setReminderTime(timeString);
};

const handleTimeCancel = () => {
  setTimePickerVisible(false);
};

  const onCreateReminder = async () => {
    if (!title.trim() || !message.trim() || !reminderDate.trim() || !reminderTime.trim()) {
      Alert.alert('Invalid input', 'Enter title, message, date and time.');
      return;
    }

    // Validate date format
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
      setSelectedDate('');
      setSelectedTime(new Date());
      setShowAddForm(false);
      Alert.alert('Success', 'Reminder added.');
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
        <Text style={styles.title}>
  Reminder fires: {formatDateWithAmPm(item.reminderAt)}
</Text>
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
            placeholderTextColor={COLORS.textSecondary}
            style={styles.input}
          />
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Reminder message"
            placeholderTextColor={COLORS.textSecondary}
            style={styles.input}
          />
          
          {/* Date Picker with Calendar Icon */}
          <View style={styles.datePickerRow}>
            <TextInput
              value={reminderDate}
              onChangeText={setReminderDate}
              placeholder="Date (YYYY-MM-DD)"
              placeholderTextColor={COLORS.textSecondary}
              style={[styles.input, styles.dateInput]}
              editable={false}
            />
            <TouchableOpacity 
              style={styles.calendarIconButton} 
              onPress={() => setShowCalendar(true)}
            >
              <Text style={styles.calendarIcon}>📅</Text>
            </TouchableOpacity>
          </View>

          {/* Time Picker with Clock Icon */}
          <View style={styles.datePickerRow}>
            <TextInput
  value={reminderTime && reminderTime !== '' ? `${reminderTime} ${selectedAmPm}` : ''}
  placeholder="Time (HH:MM AM/PM)"
  placeholderTextColor={COLORS.textSecondary}
  style={[styles.input, styles.dateInput]}
  editable={false}
/>
            <TouchableOpacity 
              style={styles.calendarIconButton} 
              onPress={() => setTimePickerVisible(true)}
            >
              <Text style={styles.calendarIcon}>⏰</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.addButton} onPress={onCreateReminder}>
            <Text style={styles.addButtonText}>Save reminder</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Calendar Modal */}
      {showCalendar && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Date</Text>
              <TouchableOpacity onPress={() => setShowCalendar(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <Calendar
              onDayPress={onDateSelect}
              markedDates={{
                [selectedDate]: { selected: true, selectedColor: COLORS.primary }
              }}
              minDate={new Date().toISOString().split('T')[0]}
              theme={{
                todayTextColor: COLORS.primary,
                selectedDayBackgroundColor: COLORS.primary,
                arrowColor: COLORS.primary
              }}
            />
            <TouchableOpacity style={styles.modalButton} onPress={() => setShowCalendar(false)}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Time Picker */}
      <DateTimePickerModal
  isVisible={isTimePickerVisible}
  mode="time"
  onConfirm={handleTimeConfirm}
  onCancel={handleTimeCancel}
  date={selectedTime}
  is24Hour={false}
  display="spinner"
  themeVariant="light"
  textColor="#ffffff"
/>

      {loading && !refreshing ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={upcomingReminders}
          keyExtractor={(item) => item._id}
          renderItem={renderReminder}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
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
    backgroundColor: COLORS.background,
    padding: SPACING.lg
  },
  loaderWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  listContent: {
    paddingBottom: SPACING.xl
  },
  topRow: {
    marginBottom: SPACING.md
  },
  helperText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: SPACING.sm
  },
  plusButton: {
    alignSelf: 'flex-end',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm
  },
  plusText: {
    color: COLORS.primary,
    fontWeight: '700'
  },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginBottom: SPACING.md
  },
  input: {
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.surface
  },
  datePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm
  },
  dateInput: {
    flex: 1
  },
  calendarIconButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm
  },
  calendarIcon: {
    fontSize: 20,
    color: COLORS.white
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.sm,
    paddingVertical: SPACING.sm,
    alignItems: 'center'
  },
  addButtonText: {
    color: COLORS.white,
    fontWeight: '700'
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
    overflow: 'hidden'
  },
  cardLeft: {
    flex: 1,
    padding: SPACING.lg
  },
  cardDivider: {
    width: StyleSheet.hairlineWidth * 2,
    backgroundColor: COLORS.border
  },
  cardRight: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    minWidth: 84
  },
  badge: {
    alignSelf: 'flex-start',
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    backgroundColor: COLORS.light,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    marginBottom: SPACING.sm
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700'
  },
  message: {
    color: COLORS.textSecondary,
    marginTop: SPACING.xs
  },
  meta: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: SPACING.sm
  },
  empty: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xxxl
  },
  emptyWrap: {
    alignItems: 'center',
    marginTop: SPACING.xl
  },
  emptyIcon: {
    fontSize: 34,
    marginBottom: SPACING.sm
  },
  emptyTitle: {
    color: COLORS.textPrimary,
    fontWeight: '700',
    fontSize: 18
  },
  snoozeRow: {
    marginTop: SPACING.sm,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm
  },
  snoozeButton: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs
  },
  snoozeText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 12
  },
  deleteText: {
    color: COLORS.error,
    fontWeight: '700',
    fontSize: 20
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    width: '90%',
    maxWidth: 350
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  modalClose: {
    fontSize: 20,
    color: COLORS.textMuted,
    padding: SPACING.xs
  },
  modalButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.md
  },
  modalButtonText: {
    color: COLORS.white,
    fontWeight: '700'
  }
});