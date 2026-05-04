import React, { createContext, useCallback, useState } from 'react';
import axiosInstance from '../api/axios';

export const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [upcomingReminders, setUpcomingReminders] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/notifications');
      if (response.data.success) {
        const list = response.data.notifications || [];
        setNotifications(list);
        setUnreadCount(list.filter((item) => !item.read).length);
      }
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch notifications'
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/notifications/unread-count');
      if (response.data.success) {
        setUnreadCount(response.data.unreadCount || 0);
      }
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch unread count'
      };
    }
  }, []);

  const fetchUpcomingReminders = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/notifications/upcoming-reminders');
      if (response.data.success) {
        setUpcomingReminders(response.data.reminders || []);
      }
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch reminders'
      };
    }
  }, []);

  const refreshNotificationCenter = useCallback(async (options = {}) => {
    const { showLoading = false } = options;
    try {
      if (showLoading) {
        setLoading(true);
      }
      const [notifRes, unreadRes, reminderRes] = await Promise.all([
        axiosInstance.get('/notifications'),
        axiosInstance.get('/notifications/unread-count'),
        axiosInstance.get('/notifications/upcoming-reminders')
      ]);

      if (notifRes.data.success) {
        setNotifications(notifRes.data.notifications || []);
      }
      if (unreadRes.data.success) {
        setUnreadCount(unreadRes.data.unreadCount ?? 0);
      }
      if (reminderRes.data.success) {
        setUpcomingReminders(reminderRes.data.reminders || []);
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to refresh notifications'
      };
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, []);

  const markNotificationAsRead = async (notificationId) => {
    try {
      const response = await axiosInstance.put(`/notifications/${notificationId}/read`);
      if (response.data.success) {
        setNotifications((prev) =>
          prev.map((item) => (item._id === notificationId ? { ...item, read: true } : item))
        );
        setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));
      }
      return { success: response.data.success };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to mark as read'
      };
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      const response = await axiosInstance.put('/notifications/mark-all-read');
      if (response.data.success) {
        setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
        setUnreadCount(0);
      }
      return { success: response.data.success };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to mark all as read'
      };
    }
  };

  const deleteNotificationById = async (notificationId) => {
    try {
      const deletedNotification = notifications.find((item) => item._id === notificationId);
      const response = await axiosInstance.delete(`/notifications/${notificationId}`);
      if (response.data.success) {
        setNotifications((prev) => prev.filter((item) => item._id !== notificationId));
        setUpcomingReminders((prev) => prev.filter((item) => item._id !== notificationId));
        if (deletedNotification && !deletedNotification.read) {
          setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));
        }
      }
      return { success: response.data.success };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete notification'
      };
    }
  };

  const deleteAllInboxNotifications = async () => {
    try {
      const response = await axiosInstance.delete('/notifications/all');
      if (response.data.success) {
        setNotifications([]);
        setUnreadCount(0);
      }
      return { success: response.data.success };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete all notifications'
      };
    }
  };

  const createManualReminder = async ({ title, message, reminderAt }) => {
    try {
      const response = await axiosInstance.post('/notifications/reminders', {
        title,
        message,
        reminderAt
      });

      if (response.data.success) {
        const reminder = response.data.reminder;
        setUpcomingReminders((prev) => [reminder, ...prev]);
      }

      return { success: response.data.success };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create reminder'
      };
    }
  };

  const snoozeReminderById = async (reminderId, minutes = 10) => {
    try {
      const response = await axiosInstance.put(`/notifications/${reminderId}/snooze`, { minutes });
      if (response.data.success) {
        const updated = response.data.reminder;
        setUpcomingReminders((prev) =>
          prev
            .map((item) => (item._id === reminderId ? updated : item))
            .sort((a, b) => new Date(a.reminderAt) - new Date(b.reminderAt))
        );
      }
      return { success: response.data.success };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to snooze reminder'
      };
    }
  };

  const value = {
    notifications,
    upcomingReminders,
    unreadCount,
    loading,
    fetchNotifications,
    fetchUnreadCount,
    fetchUpcomingReminders,
    refreshNotificationCenter,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotificationById,
    deleteAllInboxNotifications,
    createManualReminder,
    snoozeReminderById
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}



