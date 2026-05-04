const Notification = require('../models/Notification');

const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;

const createInstantNotification = async ({
  userId,
  title,
  message,
  type = 'general',
  data = {},
  appointmentId = null
}) => {
  return Notification.create({
    userId,
    title,
    message,
    type,
    data,
    appointmentId,
    isReminder: false,
    delivered: true,
    deliveredAt: new Date()
  });
};

const getReminderDefinitions = () => [
  { hoursBefore: 24, type: 'appointment_reminder_24h', label: 'in 24 hours' }
];

const clearAppointmentReminders = async (appointmentId) => {
  if (!appointmentId) return;

  await Notification.deleteMany({
    appointmentId,
    isReminder: true,
    delivered: false
  });
};

const createAppointmentReminders = async (appointment) => {
  if (!appointment || appointment.status === 'Cancelled') return;

  await clearAppointmentReminders(appointment._id);

  const appointmentTime = new Date(appointment.appointmentDate).getTime();
  const reminders = getReminderDefinitions()
    .map((definition) => {
      const reminderAt = new Date(appointmentTime - definition.hoursBefore * HOUR_MS);

      if (reminderAt.getTime() <= Date.now()) {
        return null;
      }

      return {
        userId: appointment.patientId,
        title: 'Appointment Reminder',
        message: `Reminder: your appointment is ${definition.label} at ${appointment.timeSlot}.`,
        type: definition.type,
        appointmentId: appointment._id,
        isReminder: true,
        reminderAt,
        delivered: false,
        data: {
          appointmentId: appointment._id,
          doctorId: appointment.doctorId
        }
      };
    })
    .filter(Boolean);

  if (reminders.length > 0) {
    await Notification.insertMany(reminders);
  }
};

const processDueReminders = async () => {
  const now = new Date();
  const dueReminders = await Notification.find({
    isReminder: true,
    delivered: false,
    reminderAt: { $lte: now }
  });

  if (dueReminders.length === 0) {
    return 0;
  }

  await Notification.updateMany(
    { _id: { $in: dueReminders.map((item) => item._id) } },
    { $set: { delivered: true, deliveredAt: now } }
  );

  return dueReminders.length;
};

module.exports = {
  createInstantNotification,
  createAppointmentReminders,
  clearAppointmentReminders,
  processDueReminders,
  MINUTE_MS
};
