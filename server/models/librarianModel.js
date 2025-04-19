const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const librarianSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "librarian" }, // 👈 Add this line
});

librarianSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("Librarian", librarianSchema);
