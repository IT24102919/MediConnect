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
import { COLORS, SHADOWS, SPACING, BORDER_RADIUS } from '../../constants/theme';

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
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={renderNotification}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
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
    backgroundColor: COLORS.background,
    padding: SPACING.lg
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: SPACING.md
  },
  markAllButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginRight: SPACING.md,
    ...SHADOWS.sm
  },
  markAllText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 13
  },
  deleteAllButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.error,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.sm
  },
  deleteAllText: {
    color: COLORS.error,
    fontWeight: '700',
    fontSize: 13
  },
  loaderWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  listContent: {
    paddingBottom: SPACING.xxxl
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    ...SHADOWS.sm
  },
  unreadCard: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.background,
    borderWidth: 2
  },
  cardLeft: {
    flex: 1,
    paddingVertical: SPACING.lg,
    paddingLeft: SPACING.lg,
    paddingRight: SPACING.md
  },
  cardTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700'
  },
  cardBody: {
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    fontSize: 14,
    lineHeight: 20
  },
  cardTime: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: SPACING.md
  },
  cardDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.border
  },
  cardRight: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    minWidth: 90,
    gap: SPACING.md
  },
  sideAction: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    minWidth: 80,
    alignItems: 'center',
    backgroundColor: COLORS.surface
  },
  sideDelete: {
    borderColor: COLORS.error
  },
  sideActionText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 12
  },
  sideDeleteText: {
    color: COLORS.error
  },
  emptyWrap: {
    alignItems: 'center',
    marginTop: SPACING.xxxl,
    paddingHorizontal: SPACING.xl
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.md
  },
  emptyTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '700'
  },
  emptySub: {
    color: COLORS.textMuted,
    marginTop: SPACING.sm,
    textAlign: 'center'
  }
});