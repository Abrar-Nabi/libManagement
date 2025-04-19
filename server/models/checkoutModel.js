const mongoose = require("mongoose");

const checkoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  returned: { type: Boolean, default: false },
  returnDate: { type: Date } // ✅ Optional return date
}, { timestamps: true }); // ✅ Enables createdAt for checkout date

module.exports = mongoose.model("Checkout", checkoutSchema);
