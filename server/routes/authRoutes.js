const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Librarian = require("../models/librarianModel");

const router = express.Router();


// Signup Route
router.post("/signup", async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      // Check if email already exists
      const existingUser = await Librarian.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }
  
      // Create new librarian
      const newLibrarian = new Librarian({ name, email, password });
      await newLibrarian.save();
  
      res.status(201).json({ message: "Librarian registered successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const librarian = await Librarian.findOne({ email });
    if (!librarian) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, librarian.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: librarian._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token,
      librarian: { id: librarian._id, name: librarian.name, email: librarian.email },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
