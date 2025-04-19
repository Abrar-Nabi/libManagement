const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Librarian = require("../models/librarianModel");
const User = require("../models/userModel");

const router = express.Router();

// ================= LIBRARIAN AUTH ================= //

// Librarian Signup
router.post("/librarian/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await Librarian.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const librarian = await Librarian.create({ name, email, password, role: "librarian" });
    res.status(201).json({ message: "Librarian registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Librarian Login
router.post("/librarian/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const librarian = await Librarian.findOne({ email });
    if (!librarian || !(await bcrypt.compare(password, librarian.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: librarian._id, role: "librarian" }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, librarian: { id: librarian._id, name: librarian.name, email: librarian.email, role: "librarian" } });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= USER AUTH ================= //

// User Signup
router.post("/user/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password, role: "user" });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// User Login
router.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role: "user" }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: "user" } });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
