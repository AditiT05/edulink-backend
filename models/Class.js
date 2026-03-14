const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  className: { type: String, required: true },
  section: String,
  subject: String,
  classCode: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Class", classSchema);
