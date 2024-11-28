const express = require("express");
const router = express.Router();

const PostsController = require("../controllers/posts");

router.get("/", PostsController.getAllPosts);
router.post("/", PostsController.createPost);
router.delete("/:post_id", PostsController.deletePostId);
router.patch("/:post_id", PostsController.updatePost);
router.patch("/:post_id/like", PostsController.likePost);
router.get("/mine", PostsController.getYourPosts);
router.get("/:username", PostsController.getUserPosts);

module.exports = router;
