const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const announcementRoutes = require("./routes/announcementRoutes");
const contactRoute = require("./routes/contact");
const chatbotRoute = require("./routes/chatbot");
const submissionsRoute = require("./routes/submissions");

// Middleware
app.use(cors({}));
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/dashboard", require("./routes/protectedRoutes"));
app.use("/api/calendar", require("./routes/calendarRoutes"));
app.use("/uploads", express.static("uploads"));
app.use("/api/classes", require("./routes/classRoutes"));
app.use("/api/announcements", announcementRoutes);
app.use("/api/assignments", require("./routes/assignmentRoutes"));
app.use("/api/notes", require("./routes/noteRoutes"));
app.use("/api/meet", require("./routes/meetRoutes"));
app.use("/api/contact", contactRoute);
app.use("/api/chatbot", chatbotRoute);
app.use("/api/submissions", submissionsRoute);

// Test route
app.get("/", (req, res) => {
  res.send("EduLink Backend is running 🚀");
});

// Server
const PORT = process.env.PORT || 5000;

mongoose
.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB connected");
  app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
  );
})
.catch((err) => console.log(err));
