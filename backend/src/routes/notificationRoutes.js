const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  getUpcomingReminders,
  deleteNotification,
  deleteAllInboxNotifications,
  createManualReminder,
  snoozeReminder
} = require('../controllers/notificationController');

router.get('/', authMiddleware, getMyNotifications);
router.get('/unread-count', authMiddleware, getUnreadCount);
router.get('/upcoming-reminders', authMiddleware, getUpcomingReminders);
router.post('/reminders', authMiddleware, createManualReminder);
router.put('/mark-all-read', authMiddleware, markAllAsRead);
router.delete('/all', authMiddleware, deleteAllInboxNotifications);
router.put('/:id/read', authMiddleware, markAsRead);
router.put('/:id/snooze', authMiddleware, snoozeReminder);
router.delete('/:id', authMiddleware, deleteNotification);

module.exports = router;
