const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "AptitudeUser" },
  message: String,
  isRead: { type: Boolean, default: false },
}, { timestamps: true });
const AptitudeNotification = mongoose.model("AptitudeNotification", notificationSchema);
module.exports = AptitudeNotification;