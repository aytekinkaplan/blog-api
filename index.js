const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Connect to MongoDB
require("./src/configs/dbConnection")();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));
app.use(expressLayouts);
app.set("layout", "layouts");

// Static files
app.use(express.static(path.join(__dirname, "src", "views", "assets")));

// Routes
const apiRoutes = require("./src/routes/api");
app.use("/api", apiRoutes);

// Home route
app.get("/", async (req, res) => {
  try {
    const Blog = require("./src/models/blogModel");
    const blogs = await Blog.find().sort({ createdAt: -1 }).limit(5);
    res.render("index", { title: "Home", blogs: blogs });
  } catch (error) {
    res.status(500).render("error", { message: "Error fetching blogs" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", { message: "Something went wrong!" });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
