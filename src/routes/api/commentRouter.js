const express = require("express");
const router = express.Router({ mergeParams: true });
const commentController = require("../../controllers/api/commentController");
const authenticateJWT = require("../../middlewares/authentication");

router.get("/", commentController.getComments);
router.post("/", authenticateJWT, commentController.createComment);
router.delete("/:commentId", authenticateJWT, commentController.deleteComment);

module.exports = router;
