const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const express = require("express");
// const helmet = require("helmet");
// const morgan = require("morgan");
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());
// Middleware
// app.use(helmet()); // Secure HTTP headers
app.use(cors()); // Enable CORS
// app.use(morgan("dev")); // Logging
app.use(express.json({ limit: "10kb" })); // Parse JSON with size limit
app.use(express.urlencoded({ extended: true, limit: "10kb" })); // Parse URL-encoded data
const captainRoutes = require("./routes/captain.routes");
// Routes
const users = require("./routes/user.routes");
app.use("/users", users);
app.use("/captains", captainRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

module.exports = app;
