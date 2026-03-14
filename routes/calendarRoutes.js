const express = require("express");
const router = express.Router();
const { addEvent, getEvents } = require("../controllers/calendarController");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, addEvent);
router.get("/", auth, getEvents);

module.exports = router;
