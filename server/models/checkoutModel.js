const mongoose = require("mongoose");

const checkoutSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: "Member", required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  checkoutDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  returned: { type: Boolean, default: false },
});

module.exports = mongoose.model("Checkout", checkoutSchema);
