const express = require("express");
const router = express.Router();
const Meet = require("../models/Meet");
const protect = require("../middleware/authMiddleware");

/*GET MEET STATUS/api/meet/:classId*/
router.get("/:classId", protect, async (req, res) => {
  try {
    const meet = await Meet.findOne({
      classId: req.params.classId,
      isActive: true
    });
    res.json(meet);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*CREATE / UPDATE MEET (Teacher)*/
router.post("/:classId", protect, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Access denied" });
    }
    const { meetLink } = req.body;
    let meet = await Meet.findOne({ classId: req.params.classId });
    if (meet) {
      meet.meetLink = meetLink;
      meet.isActive = true;
      await meet.save();
    } else {
      meet = await Meet.create({
        classId: req.params.classId,
        meetLink,
        createdBy: req.user.id
      });
    }
    res.json(meet);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*END MEET (Teacher)*/
router.delete("/:classId", protect, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Access denied" });
    }
    await Meet.findOneAndUpdate(
      { classId: req.params.classId },
      { isActive: false }
    );
    res.json({ message: "Meeting ended" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
