const express = require("express");
const router = express.Router();
const Submission = require("../models/Submission");
const auth = require("../middleware/authMiddleware");
const multer = require("multer");

/* ==== Multer Config ==== */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });
const User = require("../models/User");  // make sure this is at top

router.post("/:assignmentId", auth, upload.single("file"), async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can submit" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // ✅ Fetch student from DB
    const student = await User.findById(req.user.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const submission = new Submission({
      assignmentId: req.params.assignmentId,
      studentId: req.user.id,
      studentName: student.name,   // ✅ now properly defined
      fileUrl: req.file.path,
      submittedAt: new Date()
    });

    await submission.save();

    res.json({ message: "Submission successful" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Submission failed" });
  }
});

/* ==== Teacher View Submissions ==== */
router.get("/:assignmentId", auth, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can view submissions" });
    }

    const submissions = await Submission.find({
      assignmentId: req.params.assignmentId
    });

    res.json(submissions);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch submissions" });
  }
});

module.exports = router;
