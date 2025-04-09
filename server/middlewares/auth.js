// middlewares/auth.js
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(400).json({ message: "Invalid token" });
  }
};

const requireLibrarian = (req, res, next) => {
  if (req.user?.role !== "librarian") {
    return res.status(403).json({ message: "Access denied. Librarian only." });
  }
  next();
};

module.exports = { verifyToken, requireLibrarian };
