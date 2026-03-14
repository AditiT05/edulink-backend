const express = require("express");
const router = express.Router();
const Announcement = require("../models/Announcement");
const protect = require("../middleware/authMiddleware");


/* ===============================
   GET announcements by class
================================ */
router.get("/:classId", protect, async (req, res) => {
  try {
    const announcements = await Announcement.find({
      classId: req.params.classId
    }).sort({ createdAt: -1 });

    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===============================
   POST announcement (Teacher)
================================ */
router.post("/:classId", protect, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Access denied" });
    }
    const announcement = new Announcement({
      classId: req.params.classId,
      author: req.user.name || "Teacher",
      text: req.body.text
    });
    await announcement.save();
    res.status(201).json(announcement);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===============================
   EDIT announcement (Teacher)
================================ */
router.put("/:id", protect, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Access denied" });
    }
    const updated = await Announcement.findByIdAndUpdate(
      req.params.id,
      { text: req.body.text },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===============================
   DELETE announcement (Teacher)
================================ */
router.delete("/:id", protect, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Access denied" });
    }
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: "Announcement deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===============================
   ADD comment (Student / Teacher)
================================ */
router.post("/:id/comments", protect, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    announcement.comments.push({
      author: req.user.name || "Student",
      text: req.body.text
    });
    await announcement.save();
    res.status(201).json(announcement);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
