import React, { useContext, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { NotificationContext } from '../context/NotificationContext';
import { COLORS, SHADOWS, SPACING, BORDER_RADIUS } from '../../constants/theme';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString();
};

export default function NotificationsScreen() {
  const {
    notifications,
    loading,
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
  } = useContext(NotificationContext);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, !item.read && styles.unreadCard]}
      onPress={() => {
        if (!item.read) {
          markNotificationAsRead(item._id);
        }
      }}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.markAllButton} onPress={markAllNotificationsAsRead}>
        <Text style={styles.markAllText}>Mark all as read</Text>
      </TouchableOpacity>

      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color="#38BDF8" />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.empty}>No notifications yet.</Text>}
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
    paddingBottom: SPACING.xxxl
  },
  markAllButton: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  markAllText: {
    color: COLORS.primary,
    fontWeight: '700'
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  unreadCard: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.background,
  },
  title: {
    color: COLORS.dark,
    fontSize: 15,
    fontWeight: '700'
  },
  message: {
    color: COLORS.textLight,
    marginTop: SPACING.md
  },
  date: {
    color: COLORS.text,
    fontSize: 12,
    marginTop: SPACING.md,
    opacity: 0.7,
  },
  empty: {
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: SPACING.xxxl
  }
});





