const express = require("express");
const router = express.Router();

const User = require("../models/userModel");
const { verifyToken, requireLibrarian } = require("../middlewares/auth");

// Get all users
router.get("/users", verifyToken, requireLibrarian, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

// Add a new user
router.post("/users", verifyToken, requireLibrarian, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
});

// Update user
router.put("/users/:id", verifyToken, requireLibrarian, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findById(req.params.id);

    user.name = name || user.name;
    user.email = email || user.email;
    if (password) user.password = password;

    await user.save();
    res.json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
});

// Delete user
router.delete("/users/:id", verifyToken, requireLibrarian, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
});

module.exports = router;
