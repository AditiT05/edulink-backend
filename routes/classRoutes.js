const express = require("express");
const router = express.Router();
const Class = require("../models/Class");
const protect = require("../middleware/authMiddleware");

// Generate class code
function generateClassCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// CREATE CLASS
router.post("/create", protect ,async (req, res) => {
  console.log("REQ.USER:", req.user); 
  try {
    const { className, section, subject } = req.body;
    if (!className) {
      return res.status(400).json({ message: "Class name required" });
    }
    const newClass = new Class({
      className,
      section,
      subject,
      classCode: generateClassCode(),
      teacher: req.user.id,   
      students: []
    });
    await newClass.save();
    res.status(201).json(newClass);
  } catch (err) {
  console.error("CREATE CLASS ERROR:", err);  // 🔥 ADD THIS
  res.status(500).json({ message: err.message });
}});


// GET ALL CLASSES (Teacher Dashboard)
router.get("/", protect , async (req, res) => {
  try {
    let classes;
    if (req.user.role === "teacher") {
      classes = await Class.find({ teacher: req.user.id })
        .sort({ createdAt: -1 });
    }
    if (req.user.role === "student") {
      classes = await Class.find({ students: req.user.id })
        .sort({ createdAt: -1 });
    }
    res.json(classes);
  } catch (err) {
    console.error("Fetch classes error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET MY CLASSES (Role Based - Safe Route)
router.get("/my/classes", protect, async (req, res) => {
  try {
    let classes;
    if (req.user.role === "teacher") {
      classes = await Class.find({ teacher: req.user.id })
        .sort({ createdAt: -1 });
    }
    if (req.user.role === "student") {
      classes = await Class.find({ students: req.user.id })
        .sort({ createdAt: -1 });
    }
    res.json(classes);
  } catch (err) {
    console.error("Fetch my classes error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/join-by-code", protect, async (req, res) => {
  try {
    const { classCode } = req.body;
    if (!classCode) {
      return res.status(400).json({ message: "Class code required" });
    }
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can join classes" });
    }
    const cls = await Class.findOne({ classCode: classCode.toUpperCase() });
    if (!cls) {
      return res.status(404).json({ message: "Invalid class code" });
    }
    const userId = req.user.id.toString();
    // SAFE teacher check
    if (cls.teacher && cls.teacher.toString() === userId) {
      return res.status(400).json({ message: "Teacher cannot join as student" });
    }
    // SAFE duplicate check
    const alreadyJoined = cls.students?.some(
      (studentId) => studentId.toString() === userId
    );
    if (alreadyJoined) {
      return res.status(400).json({ message: "Already joined this class" });
    }
    cls.students = cls.students || [];
    cls.students.push(userId);
    await cls.save();
    res.json({ message: "Joined successfully" });
  } catch (err) {
    console.error("Join by code error:", err);
    res.status(500).json({ message: err.message });
  }
});


// GET SINGLE CLASS BY ID (Class Page)
router.get("/:id", protect , async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id);
    if (!cls) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.json(cls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:classId/people", protect, async (req, res) => {
  try {
    const cls = await Class.findById(req.params.classId)
      .populate("teacher", "name email")
      .populate("students", "name email");

    if (!cls) return res.status(404).json({ message: "Class not found" });
    res.json({
      teacher: cls.teacher,
      students: cls.students
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/:classId/join", protect, async (req, res) => {
  try {
    const cls = await Class.findById(req.params.classId);
    if (!cls)
      return res.status(404).json({ message: "Class not found" });
    // ✅ Only students can join
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can join classes" });
    }
    // ✅ Prevent teacher from joining their own class
    if (cls.teacher.toString() === req.user.id) {
      return res.status(400).json({ message: "Teacher cannot join as student" });
    }
    // ✅ Prevent duplicate join (correct way)
    const alreadyJoined = cls.students.some(
      (studentId) => studentId.toString() === req.user.id
    );
    if (alreadyJoined) {
      return res.status(400).json({ message: "Already joined" });
    }
    cls.students.push(req.user.id);
    await cls.save();
    res.json({ message: "Joined successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
