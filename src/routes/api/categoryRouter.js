const express = require("express");
const router = express.Router();
const categoryController = require("../../controllers/api/categoryController");
const authenticateJWT = require("../../middlewares/authentication");

router.get("/", categoryController.getAllCategories);
router.post("/", authenticateJWT, categoryController.createCategory);
router.delete("/:id", authenticateJWT, categoryController.deleteCategory);

module.exports = router;
