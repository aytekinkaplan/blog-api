const express = require("express");
const router = express.Router();

const blogRouter = require("./blogRouter");

const authRouter = require("./authRouter");

router.use("/blogs", blogRouter);

router.use("/auth", authRouter);

module.exports = router;
