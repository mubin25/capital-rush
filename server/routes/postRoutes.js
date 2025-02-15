const express = require("express");
const { createPost, getPosts, updatePost, deletePost } = require("../controllers/postController");
const { authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticateUser, createPost);
router.get("/", getPosts);
router.put("/:id", authenticateUser, updatePost);
router.delete("/:id", authenticateUser, deletePost);

module.exports = router;