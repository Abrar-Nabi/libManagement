const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Function to generate a 6-digit user ID
const generateUserId = () => Math.floor(100000 + Math.random() * 900000).toString();

const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true }, // New field
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" },
});

// Hash password and assign userId before saving
userSchema.pre("save", async function (next) {
  if (this.isNew) {
    this.userId = generateUserId(); // Assign userId
  }

  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

module.exports = mongoose.model("User", userSchema);
