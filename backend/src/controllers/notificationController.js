const Notification = require('../models/Notification');

const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user.id,
      delivered: { $ne: false }
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const unreadCount = await Notification.countDocuments({
      userId: req.user.id,
      delivered: { $ne: false },
      read: false
    });

    res.status(200).json({
      success: true,
      unreadCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.id, delivered: { $ne: false }, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getUpcomingReminders = async (req, res) => {
  try {
    const reminders = await Notification.find({
      userId: req.user.id,
      isReminder: true,
      delivered: false
    }).sort({ reminderAt: 1 });

    res.status(200).json({
      success: true,
      count: reminders.length,
      reminders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const createManualReminder = async (req, res) => {
  try {
    const { title, message, reminderAt } = req.body;

    if (!title || !message || !reminderAt) {
      return res.status(400).json({
        success: false,
        message: 'Title, message, and reminder time are required'
      });
    }

    const reminderDate = new Date(reminderAt);
    if (Number.isNaN(reminderDate.getTime()) || reminderDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Reminder time must be a valid future date/time'
      });
    }

    const reminder = await Notification.create({
      userId: req.user.id,
      title,
      message,
      type: 'general',
      isReminder: true,
      reminderAt: reminderDate,
      delivered: false,
      data: {
        manualReminder: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Reminder created successfully',
      reminder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const snoozeReminder = async (req, res) => {
  try {
    const { minutes = 10 } = req.body;
    const snoozeMinutes = Number(minutes);

    if (!Number.isFinite(snoozeMinutes) || snoozeMinutes <= 0 || snoozeMinutes > 1440) {
      return res.status(400).json({
        success: false,
        message: 'Snooze minutes must be between 1 and 1440'
      });
    }

    const reminder = await Notification.findOne({
      _id: req.params.id,
      userId: req.user.id,
      isReminder: true
    });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found'
      });
    }

    reminder.reminderAt = new Date(Date.now() + snoozeMinutes * 60 * 1000);
    reminder.delivered = false;
    reminder.deliveredAt = null;
    await reminder.save();

    res.status(200).json({
      success: true,
      message: `Reminder snoozed by ${snoozeMinutes} minute(s)`,
      reminder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteAllInboxNotifications = async (req, res) => {
  try {
    const result = await Notification.deleteMany({
      userId: req.user.id,
      delivered: { $ne: false }
    });

    res.status(200).json({
      success: true,
      message: 'All notifications deleted successfully',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  getUpcomingReminders,
  deleteNotification,
  deleteAllInboxNotifications,
  createManualReminder,
  snoozeReminder
};
