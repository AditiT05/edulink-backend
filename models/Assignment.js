const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  fileUrl: {
    type: String,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  createdBy: {
    type: String // teacher name or id
  }
}, { timestamps: true });

module.exports = mongoose.model("Assignment", assignmentSchema);
