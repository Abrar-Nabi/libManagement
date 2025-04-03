const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  memberId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true }
});

module.exports = mongoose.model("Member", memberSchema);
                                                