const express = require("express");
const router = express.Router();
const Assignment = require("../models/Assignment");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");


/* ===== Create Assignment (Teacher) ===== */
router.post("/:classId", protect, upload.single("file"), async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    const assignment = new Assignment({
      classId: req.params.classId,
      title,
      description,
      dueDate,
      fileUrl: req.file.path,
      createdBy: req.user.id
    });

    await assignment.save();
    res.status(201).json(assignment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===== Get Assignments (Teacher & Student) ===== */
router.get("/:classId", protect, async (req, res) => {
  const assignments = await Assignment.find({
    classId: req.params.classId
  }).sort({ createdAt: -1 });

  res.json(assignments);
});

/* ===== Delete Assignment (Teacher) ===== */
router.delete("/:id", protect, async (req, res) => {
  await Assignment.findByIdAndDelete(req.params.id);
  res.json({ message: "Assignment deleted" });
});

module.exports = router;
