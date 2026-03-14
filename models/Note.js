const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true
    },
    title: {
      type: String,
      required: true
    },
    file: {
      type: String,
      required: true
    },
    uploadedBy: {
      type: String, // teacher name or email
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);
