const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead
} = require('../controllers/notificationController');

router.get('/', authMiddleware, getMyNotifications);
router.get('/unread-count', authMiddleware, getUnreadCount);
router.put('/mark-all-read', authMiddleware, markAllAsRead);
router.put('/:id/read', authMiddleware, markAsRead);

module.exports = router;
