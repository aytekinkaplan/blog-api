const Blog = require("../../models/blogModel");

// Get all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "username")
      .populate("category", "name");
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new blog
exports.createBlog = async (req, res) => {
  const blog = new Blog({
    title: req.body.title,
    content: req.body.content,
    author: req.user.userId,
    category: req.body.category,
    tags: req.body.tags,
  });
  try {
    const newBlog = await blog.save();
    await newBlog.populate("author", "username");
    await newBlog.populate("category", "name");
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single blog
exports.getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "username")
      .populate("category", "name");
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a blog
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    // Check if the user is the author of the blog
    if (blog.author.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this blog" });
    }
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        content: req.body.content,
        category: req.body.category,
        tags: req.body.tags,
      },
      { new: true }
    )
      .populate("author", "username")
      .populate("category", "name");
    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    // Check if the user is the author of the blog
    if (blog.author.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this blog" });
    }
    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get blogs by category
exports.getBlogsByCategory = async (req, res) => {
  try {
    const blogs = await Blog.find({ category: req.params.categoryId })
      .populate("author", "username")
      .populate("category", "name");
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get blogs by tag
exports.getBlogsByTag = async (req, res) => {
  try {
    const blogs = await Blog.find({ tags: req.params.tag })
      .populate("author", "username")
      .populate("category", "name");
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// New function: Search blogs
exports.searchBlogs = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const blogs = await Blog.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
        { tags: { $in: [new RegExp(query, "i")] } },
      ],
    })
      .populate("author", "username")
      .populate("category", "name");

    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
