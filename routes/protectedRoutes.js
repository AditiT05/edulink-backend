const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const protect = require("../middleware/authMiddleware");

router.get("/student", protect, (req, res) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ message: "Access denied" });
  }
  res.json({ message: "Student dashboard data" });
});
router.get("/teacher", protect, (req, res) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({ message: "Access denied" });
  }
  res.json({ message: "Teacher dashboard data" });
});

router.get("/user", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

module.exports = router;
