const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  bookId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  language: { type: String, required: true },
  totalCopies: { type: Number, required: true },
  borrowedCopies: { type: Number, default: 0 }, // Tracks borrowed books
});

// Virtual property for status
bookSchema.virtual("status").get(function () {
  return this.totalCopies > this.borrowedCopies ? "Available" : "Not Available";
});

module.exports = mongoose.model("Book", bookSchema);
