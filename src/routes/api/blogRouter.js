const express = require("express");
const router = express.Router();
const blogController = require("../../controllers/api/blogController");
const authenticateJWT = require("../../middlewares/authentication");

router.get("/", blogController.getAllBlogs);

router.post("/", authenticateJWT, blogController.createBlog);

router.get("/:id", blogController.getBlog);

router.put("/:id", authenticateJWT, blogController.updateBlog);
router.delete("/:id", blogController.deleteBlog);

module.exports = router;
