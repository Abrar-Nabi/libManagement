const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const morgan = require("morgan");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Library Management System API is running...");
});


app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/adminRoutes"));

app.use("/api/books", require("./routes/bookRoutes"));
app.use("/api/checkout", require("./routes/checkoutRoutes"));






const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
