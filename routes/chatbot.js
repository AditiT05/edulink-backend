const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {

  const msg = req.body.message
    ?.toLowerCase()
    .trim()
    .replace(/[^\w\s]/gi, "") || "";

  let reply = "Sorry, I didn't understand. Please ask about EduLink features.";

  // ===== BASIC INFO =====
  if (msg.includes("edulink") && msg.includes("what")) {
    reply = "EduLink is a Real-Time Classroom Interaction System that allows teachers and students to manage classes, assignments, and live discussions online.";
  }
  else if (msg.includes("who") && msg.includes("developed")) {
    reply = "EduLink was developed as a final year project at D.G. Ruparel College under Mumbai University.";
  }
  else if (msg.includes("purpose")) {
    reply = "The main purpose of EduLink is to provide a digital platform for classroom management and real-time student-teacher interaction.";
  }

  // ===== ROLES =====
  else if (msg.includes("teacher") && msg.includes("role")) {
    reply = "Teachers can create classes, upload assignments, post announcements, and monitor student activity.";
  }
  else if (msg.includes("student") && msg.includes("role")) {
    reply = "Students can join classes, submit assignments, participate in discussions, and view announcements.";
  }

  // ===== CLASS MANAGEMENT =====
  else if (msg.includes("create") && msg.includes("class")) {
    reply = "Only teachers can create a class from the Teacher Dashboard using the Create Class option.";
  }
  else if (msg.includes("join") && msg.includes("class")) {
    reply = "Students can join a class using the unique class code provided by the teacher.";
  }
  else if (msg.includes("class") && msg.includes("code")) {
    reply = "Each class has a unique auto-generated code used by students to join the class.";
  }

  // ===== ASSIGNMENTS =====
  else if (msg.includes("assignment")) {
    reply = "Teachers upload assignments and students can submit them before the deadline.";
  }
  else if (msg.includes("grading")) {
    reply = "Teachers can review submitted assignments and provide feedback or grades.";
  }

  // ===== FEATURES =====
  else if (msg.includes("real") && msg.includes("time")) {
    reply = "EduLink supports real-time interaction including announcements and classroom discussions.";
  }
  else if (msg.includes("announcement")) {
    reply = "Teachers can post announcements visible to all students in that class.";
  }
  else if (msg.includes("discussion")) {
    reply = "Students and teachers can interact through classroom discussion features.";
  }

  // ===== TECH STACK =====
  else if (msg.includes("technology") || msg.includes("tech stack")) {
    reply = "EduLink uses HTML, CSS, JavaScript for frontend and Node.js, Express.js, and MongoDB for backend.";
  }
  else if (msg.includes("database")) {
    reply = "MongoDB is used to store users, classes, and assignments.";
  }
  else if (msg.includes("authentication") || msg.includes("jwt")) {
    reply = "EduLink uses JWT authentication with role-based access control.";
  }

  // ===== GENERAL =====
  else if (msg.includes("dashboard")) {
    reply = "After login, users are redirected to their respective dashboards based on their role.";
  }
  else if (msg.includes("contact")) {
    reply = "You can contact EduLink support using the Contact Form in the footer section.";
  }
  else if (msg.includes("logout")) {
    reply = "Users can securely logout from their dashboard when their session ends.";
  }
  else if (msg.includes("hello") || msg.includes("hi")) {
    reply = "Hello 👋 I'm EduLink AI. How can I help you?";
  }

  res.json({ reply });

});

module.exports = router;
