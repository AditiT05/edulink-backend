const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    author: { type: String, required: true },
    text: { type: String, required: true }
  },
  { timestamps: true }
);

const announcementSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true
    },
    author: {
      type: String, // teacher name or email
      required: true
    },
    text: {
      type: String,
      required: true
    },
    comments: [commentSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Announcement", announcementSchema);
