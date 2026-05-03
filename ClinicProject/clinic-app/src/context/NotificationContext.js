import React, { createContext, useCallback, useState } from 'react';
import axiosInstance from '../api/axios';

export const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
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

  const value = {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    fetchUnreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}



