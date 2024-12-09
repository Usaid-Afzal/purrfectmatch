// src/controllers/notificationController.js
const Notification = require('../models/Notification');

class NotificationController {
  async getNotifications(req, res) {
    try {
      const notifications = await Notification.find({ user: req.user._id });
      res.json({ notifications });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  }
}

module.exports = new NotificationController();
