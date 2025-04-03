const express = require("express");
const Member = require("../models/memberModel");

const router = express.Router();

// Generate 6-digit unique ID
const generateMemberId = () => Math.floor(100000 + Math.random() * 900000).toString();

// ➤ GET All Members
router.get("/", async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ➤ ADD New Member
router.post("/add", async (req, res) => {
  try {
    const { name, email } = req.body;
    const newMember = new Member({
      memberId: generateMemberId(),
      name,
      email,
    });

    await newMember.save();
    res.status(201).json(newMember);
  } catch (error) {
    res.status(400).json({ message: "Error adding member" });
  }
});

// ➤ UPDATE Member
router.put("/edit/:id", async (req, res) => {
  try {
    const { name, email } = req.body;
    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true }
    );

    res.json(updatedMember);
  } catch (error) {
    res.status(400).json({ message: "Error updating member" });
  }
});

// ➤ DELETE Member
router.delete("/delete/:id", async (req, res) => {
  try {
    await Member.findByIdAndDelete(req.params.id);
    res.json({ message: "Member deleted" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting member" });
  }
});

module.exports = router;
