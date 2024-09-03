const express = require("express");
const router = express.Router();

const blogRouter = require("./blogRouter");
const authRouter = require("./authRouter");
const commentRouter = require("./commentRouter");
const categoryRouter = require("./categoryRouter");

router.use("/blogs", blogRouter);
router.use("/auth", authRouter);
router.use("/blogs/:blogId/comments", commentRouter);
router.use("/categories", categoryRouter);

module.exports = router;
