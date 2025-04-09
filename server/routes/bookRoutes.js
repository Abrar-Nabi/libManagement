const express = require("express");
const router = express.Router();
const Book = require("../models/bookModel");





// Generate a 6-digit unique book ID
const generateBookId = () => Math.floor(100000 + Math.random() * 900000).toString();

// 📌 Get all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// 📌 Add a book
router.post("/add", async (req, res) => {
  try {
    const { name, author, genre, language, totalCopies } = req.body;
    if (!name || !author || !genre || !language || !totalCopies) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newBook = new Book({
      bookId: generateBookId(),
      name,
      author,
      genre,
      language,
      totalCopies,
    });

    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ message: "Error adding book" });
  }
});

// 📌 Edit a book
router.put("/edit/:id", async (req, res) => {
  try {
    const { name, author, genre, language, totalCopies } = req.body;
    if (!name || !author || !genre || !language || !totalCopies) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { name, author, genre, language, totalCopies },
      { new: true }
    );

    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: "Error updating book" });
  }
});

// 📌 Delete a book
router.delete("/delete/:id", async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting book" });
  }
});

module.exports = router;
