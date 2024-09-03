const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/configs/swagger");

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

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
const apiRoutes = require("./src/routes/api");
app.use("/api", apiRoutes);

// Home route
app.get("/", async (req, res) => {
  try {
    const Blog = require("./src/models/blogModel");
    const Category = require("./src/models/categoryModel");
    const User = require("./src/models/userModel");

    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("author", "username")
      .populate("category", "name");
    const recentPosts = await Blog.find().sort({ createdAt: -1 }).limit(5);
    const categories = await Category.find();
    const authors = await User.find().select("username");

    res.render("index", {
      title: "Home",
      blogs: blogs,
      recentPosts: recentPosts,
      categories: categories,
      authors: authors,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).render("error", { message: "Error fetching data" });
  }
});

// About route
app.get("/about", (req, res) => {
  res.render("about", { title: "About Us" });
});

// Contact route
app.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact Us" });
});

// Posts route
app.get("/posts", async (req, res) => {
  const Blog = require("./src/models/blogModel");
  const ITEMS_PER_PAGE = 10;

  try {
    const page = parseInt(req.query.page) || 1;
    const totalPosts = await Blog.countDocuments();
    const totalPages = Math.ceil(totalPosts / ITEMS_PER_PAGE);

    const posts = await Blog.find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .populate("author", "username")
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.render("posts", {
      title: "Blog Posts",
      posts: posts,
      currentPage: page,
      totalPages: totalPages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("error", { message: "Error fetching posts" });
  }
});

// Login route
app.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

// Register route
app.get("/register", (req, res) => {
  res.render("register", { title: "Register" });
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
  console.log(
    `Swagger documentation available at http://localhost:${PORT}/api-docs`
  );
});
