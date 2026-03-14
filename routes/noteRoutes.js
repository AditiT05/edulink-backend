const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

/* ===============================
   GET NOTES (Teacher + Student)
   =============================== */
router.get("/:classId", protect, async (req, res) => {
  try {
    const notes = await Note.find({ classId: req.params.classId })
      .sort({ createdAt: -1 });

    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===============================
   UPLOAD NOTES (Teacher only)
   =============================== */
router.post("/:classId", protect, upload.single("file"), async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Access denied" });
    }

    const note = new Note({
      classId: req.params.classId,
      title: req.body.title,
      file: req.file.filename,
      uploadedBy: req.user.name || "Teacher"
    });

    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===============================
   DELETE NOTES (Teacher only)
   =============================== */
router.delete("/:id", protect, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Access denied" });
    }

    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
