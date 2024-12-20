const express = require("express");
const router = express.Router();

const PostsController = require("../controllers/posts");

router.get("/", PostsController.getAllPosts);
router.get("/friends", PostsController.getFriendsPosts);
router.post("/", PostsController.createPost);
router.delete("/:post_id", PostsController.deletePostId);
router.patch("/:post_id", PostsController.updatePost);
router.patch("/:post_id/comments", PostsController.disableCommentsOnPost);
router.patch("/:post_id/like", PostsController.likePost);
router.get("/mine", PostsController.getYourPosts);
router.get("/:username", PostsController.getUserPosts);
router.post("/repost/:postId", PostsController.repost);
module.exports = router;
