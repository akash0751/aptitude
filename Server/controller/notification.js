const AptitudeNotification = require("../models/notification");

const getNotifications = async (req, res) => {
  try {
    const notifications = await AptitudeNotification.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notifications." });
  }
};

const markAsRead = async (req, res) => {
  try {
    await AptitudeNotification.updateMany({ user: req.user.userId }, { isRead: true });
    res.status(200).json({ message: "All notifications marked as read." });
  } catch (error) {
    res.status(500).json({ error: "Failed to mark notifications as read." });
  }
};

module.exports = { getNotifications, markAsRead };