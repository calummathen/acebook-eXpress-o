const express = require("express");
const router = express.Router();

const CommentsController = require("../controllers/comments");

// router.get("/", PostsController.getAllPosts);
router.post("/:post_id", CommentsController.createComment);
router.get("/:post_id", CommentsController.getAllCommentsForPost);
router.delete("/:comment_id", CommentsController.deleteComment);
router.patch("/:comment_id", CommentsController.updateComment);
router.patch("/:comment_id/like", CommentsController.likeComment);

module.exports = router;
