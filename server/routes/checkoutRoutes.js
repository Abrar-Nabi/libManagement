const express = require("express");
const router = express.Router();
const Checkout = require("../models/checkoutModel");
const Book = require("../models/bookModel");

// Checkout a book
router.post("/checkout", async (req, res) => {
  try {
    const { memberId, bookId, dueDate } = req.body;

    // Check if the book exists
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // Check if the book is available
    if (book.totalCopies <= 0) {
      return res.status(400).json({ message: "No copies available" });
    }

    // Create a new checkout record
    const checkout = new Checkout({ memberId, bookId, dueDate });
    await checkout.save();

    // Decrease the available copies
    book.totalCopies -= 1;
    await book.save();

    res.status(201).json({ message: "Book checked out successfully", checkout });
  } catch (error) {
    res.status(500).json({ message: "Error checking out book", error });
  }
});

// Return a book
router.put("/return/:id", async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);
    if (!checkout) return res.status(404).json({ message: "Checkout not found" });

    if (checkout.returned) {
      return res.status(400).json({ message: "Book already returned" });
    }

    // Mark as returned
    checkout.returned = true;
    await checkout.save();

    // Increase book availability
    const book = await Book.findById(checkout.bookId);
    book.totalCopies += 1;
    await book.save();

    res.json({ message: "Book returned successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error returning book", error });
  }
});

// Fetch all checkouts
router.get("/", async (req, res) => {
  try {
    const checkouts = await Checkout.find().populate("memberId").populate("bookId");
    res.json(checkouts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching checkouts", error });
  }
});

module.exports = router;
