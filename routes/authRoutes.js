const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware"); 
const {
  register,
  login
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);

router.get("/me", protect, (req, res) => {
  res.json(req.user);
});

module.exports = router;
