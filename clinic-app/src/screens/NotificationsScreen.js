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
    backgroundColor: '#F8FAFC',
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
  markAllButton: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderWidth: 1,
    borderColor: '#38BDF8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 12
  },
  markAllText: {
    color: '#38BDF8',
    fontWeight: '700'
  },
  card: {
    backgroundColor: '#EAF3FF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 10
  },
  unreadCard: {
    borderColor: '#38BDF8'
  },
  title: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '700'
  },
  message: {
    color: '#334155',
    marginTop: 6
  },
  date: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 10
  },
  empty: {
    color: '#64748B',
    textAlign: 'center',
    marginTop: 32
  }
});





