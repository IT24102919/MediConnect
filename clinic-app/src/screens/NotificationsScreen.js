import React, { useCallback, useContext, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
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

export default function NotificationsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const isFirstFocus = useRef(true);
  const {
    notifications,
    loading,
    refreshNotificationCenter,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotificationById,
    deleteAllInboxNotifications
  } = useContext(NotificationContext);

  useFocusEffect(
    useCallback(() => {
      if (isFirstFocus.current) {
        isFirstFocus.current = false;
        refreshNotificationCenter({ showLoading: true });
      } else {
        refreshNotificationCenter({ showLoading: false });
      }
    }, [refreshNotificationCenter])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshNotificationCenter({ showLoading: false });
    setRefreshing(false);
  }, [refreshNotificationCenter]);

  const confirmDeleteOne = (id) => {
    Alert.alert('Delete notification', 'Are you sure you want to delete this notification?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteNotificationById(id) }
    ]);
  };

  const confirmDeleteAll = () => {
    if (notifications.length === 0) return;
    Alert.alert(
      'Delete all notifications',
      'Are you sure you want to delete all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete all', style: 'destructive', onPress: () => deleteAllInboxNotifications() }
      ]
    );
  };

  const renderNotification = ({ item }) => (
    <View style={[styles.cardRow, !item.read && styles.unreadCard]}>
      <TouchableOpacity
        style={styles.cardLeft}
        activeOpacity={0.85}
        onPress={() => {
          if (!item.read) {
            markNotificationAsRead(item._id);
          }
        }}
      >
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardBody}>{item.message}</Text>
        <Text style={styles.cardTime}>{formatDate(item.createdAt)}</Text>
      </TouchableOpacity>
      <View style={styles.cardDivider} />
      <View style={styles.cardRight}>
        {!item.read ? (
          <TouchableOpacity style={styles.sideAction} onPress={() => markNotificationAsRead(item._id)}>
            <Text style={styles.sideActionText}>Mark read</Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity style={[styles.sideAction, styles.sideDelete]} onPress={() => confirmDeleteOne(item._id)}>
          <Text style={[styles.sideActionText, styles.sideDeleteText]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.markAllButton} onPress={markAllNotificationsAsRead}>
          <Text style={styles.markAllText}>Mark all read</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteAllButton} onPress={confirmDeleteAll}>
          <Text style={styles.deleteAllText}>Delete all</Text>
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color="#38BDF8" />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={renderNotification}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#38BDF8" />
          }
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyIcon}>🔔</Text>
              <Text style={styles.emptyTitle}>No notifications</Text>
              <Text style={styles.emptySub}>You will see booking updates and alerts here.</Text>
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
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 12
  },
  markAllButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#38BDF8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 10
  },
  markAllText: {
    color: '#38BDF8',
    fontWeight: '700',
    fontSize: 13
  },
  deleteAllButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#F97316',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10
  },
  deleteAllText: {
    color: '#FDBA74',
    fontWeight: '700',
    fontSize: 13
  },
  loaderWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  listContent: {
    paddingBottom: 24
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(147, 197, 253, 0.35)',
    marginBottom: 10,
    overflow: 'hidden'
  },
  unreadCard: {
    borderColor: '#38BDF8'
  },
  cardLeft: {
    flex: 1,
    paddingVertical: 14,
    paddingLeft: 14,
    paddingRight: 10
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700'
  },
  cardBody: {
    color: 'rgba(255, 255, 255, 0.92)',
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20
  },
  cardTime: {
    color: 'rgba(255, 255, 255, 0.45)',
    fontSize: 12,
    marginTop: 10
  },
  markOneButton: {
    alignSelf: 'flex-start',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#38BDF8',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  markOneText: {
    color: '#38BDF8',
    fontWeight: '700',
    fontSize: 12
  },
  cardDivider: {
    width: StyleSheet.hairlineWidth * 2,
    backgroundColor: 'rgba(255, 255, 255, 0.22)'
  },
  cardRight: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    minWidth: 92,
    gap: 10
  },
  sideAction: {
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.75)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    minWidth: 82,
    alignItems: 'center'
  },
  sideDelete: {
    borderColor: 'rgba(249, 115, 22, 0.9)'
  },
  sideActionText: {
    color: '#38BDF8',
    fontWeight: '800',
    fontSize: 12
  },
  sideDeleteText: {
    color: '#FDBA74'
  },
  emptyWrap: {
    alignItems: 'center',
    marginTop: 44,
    paddingHorizontal: 24
  },
  emptyIcon: {
    fontSize: 34,
    marginBottom: 8
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700'
  },
  emptySub: {
    color: 'rgba(255, 255, 255, 0.65)',
    marginTop: 6,
    textAlign: 'center'
  }
});
