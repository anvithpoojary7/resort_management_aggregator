const express = require("express");
const Notification = require("../models/notification");
const { protect } = require("../middleware/authMiddleware"); // ✅ destructure
const router = express.Router();

// ✅ Get all notifications for logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
});

// ✅ Mark all as read
router.patch("/mark-all-read", protect, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, isRead: false },
      { isRead: true }
    );
    res.json({ message: "All marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Error marking notifications as read" });
  }
});

// ✅ Clear all notifications
router.delete("/clear-all", protect, async (req, res) => {
  try {
    await Notification.deleteMany({ userId: req.user._id });
    res.json({ message: "All cleared" });
  } catch (err) {
    res.status(500).json({ message: "Error clearing notifications" });
  }
});

module.exports = router;
