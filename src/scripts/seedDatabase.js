const mongoose = require("mongoose");
const User = require("../models/userModel");
const Blog = require("../models/blogModel");
const Category = require("../models/categoryModel");
const Comment = require("../models/commentModel");
const bcrypt = require("bcryptjs");
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Blog.deleteMany();
    await Category.deleteMany();
    await Comment.deleteMany();

    // Create categories
    const categories = await Category.create([
      { name: "Technology" },
      { name: "Travel" },
      { name: "Food" },
      { name: "Lifestyle" },
      { name: "Health" },
    ]);

    // Create users
    const users = await User.create([
      {
        username: "johndoe",
        email: "john@example.com",
        password: await bcrypt.hash("password123", 10),
      },
      {
        username: "janedoe",
        email: "jane@example.com",
        password: await bcrypt.hash("password123", 10),
      },
      {
        username: "bobsmith",
        email: "bob@example.com",
        password: await bcrypt.hash("password123", 10),
      },
    ]);

    // Create blogs
    const blogs = await Blog.create([
      {
        title: "The Future of AI",
        content: "Artificial Intelligence is rapidly evolving...",
        author: users[0]._id,
        category: categories[0]._id,
        tags: ["AI", "Technology", "Future"],
      },
      {
        title: "Exploring the Wonders of Bali",
        content:
          "Bali, the Island of Gods, offers a unique travel experience...",
        author: users[1]._id,
        category: categories[1]._id,
        tags: ["Travel", "Bali", "Adventure"],
      },
      {
        title: "Delicious Vegan Recipes",
        content: "Veganism is not just a diet, it's a lifestyle...",
        author: users[2]._id,
        category: categories[2]._id,
        tags: ["Vegan", "Food", "Recipes"],
      },
      {
        title: "Minimalism: Living with Less",
        content: "Embracing minimalism can lead to a more fulfilling life...",
        author: users[0]._id,
        category: categories[3]._id,
        tags: ["Minimalism", "Lifestyle", "Simplicity"],
      },
      {
        title: "The Importance of Mental Health",
        content: "Taking care of your mental health is crucial...",
        author: users[1]._id,
        category: categories[4]._id,
        tags: ["Mental Health", "Wellness", "Self-care"],
      },
      {
        title: "Blockchain: Beyond Cryptocurrency",
        content:
          "Blockchain technology has potential applications far beyond digital currencies...",
        author: users[2]._id,
        category: categories[0]._id,
        tags: ["Blockchain", "Technology", "Innovation"],
      },
      {
        title: "Hidden Gems of Europe",
        content:
          "Discover the lesser-known but equally beautiful destinations in Europe...",
        author: users[0]._id,
        category: categories[1]._id,
        tags: ["Travel", "Europe", "Hidden Gems"],
      },
      {
        title: "The Art of Coffee Making",
        content: "Learn the secrets to brewing the perfect cup of coffee...",
        author: users[1]._id,
        category: categories[2]._id,
        tags: ["Coffee", "Brewing", "Barista"],
      },
      {
        title: "Sustainable Living in the City",
        content: "Implementing eco-friendly practices in urban environments...",
        author: users[2]._id,
        category: categories[3]._id,
        tags: ["Sustainability", "Urban Living", "Eco-friendly"],
      },
      {
        title: "Yoga for Beginners",
        content:
          "Start your yoga journey with these simple poses and breathing techniques...",
        author: users[0]._id,
        category: categories[4]._id,
        tags: ["Yoga", "Fitness", "Beginners"],
      },
    ]);

    // Create comments
    await Comment.create([
      {
        content: "Great article! Very informative.",
        author: users[1]._id,
        blog: blogs[0]._id,
      },
      {
        content: "I've been to Bali and it's truly amazing!",
        author: users[2]._id,
        blog: blogs[1]._id,
      },
      {
        content: "These recipes look delicious. Can't wait to try them!",
        author: users[0]._id,
        blog: blogs[2]._id,
      },
      {
        content: "Minimalism has changed my life for the better.",
        author: users[1]._id,
        blog: blogs[3]._id,
      },
      {
        content:
          "Mental health awareness is so important. Thank you for sharing.",
        author: users[2]._id,
        blog: blogs[4]._id,
      },
    ]);

    console.log("Database seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
