const mongoose = require("mongoose");

const calendarEventSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true
  },
  title: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("CalendarEvent", calendarEventSchema);
