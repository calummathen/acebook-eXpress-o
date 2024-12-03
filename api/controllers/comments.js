const Comment = require("../models/comment");
const { generateToken } = require("../lib/token");

async function createComment(req, res) {
  req.body.user = req.username
  req.body.post_id = req.params.post_id 
  const comment = new Comment(req.body);

  await comment.save();

  const newToken = generateToken(req.user_id, req.username);
  res.status(201).json({ message: "Comment created", token: newToken });
}

async function getAllCommentsForPost(req, res) {
  const comments = await Comment.find({post_id: req.params.post_id});
  comments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const updatedComments = comments.map((comment) => {
    comment._doc.isYours = (comment.user == req.username)
    comment._doc.hasLiked = (comment.beans.includes(req.username))
    return comment
  })

  const token = generateToken(req.user_id, req.username);
  res.status(200).json({ comments: updatedComments, token: token });
}

async function deleteComment(req, res) {
  const commentId = req.params.comment_id
  if (req.body.isYours){
    await Comment.findByIdAndDelete(commentId);
    const newToken = generateToken(req.user_id, req.username);
    res.status(200).json({ message: "Comment deleted", token: newToken });
  } else {
    console.error("Not your comment, can't delete")
    res.status(401).json({ message: "Not your comment, can't delete" })
  }
}

async function updateComment(req, res) {
  const commentId = req.params.comment_id
  if (req.body.isYours) {
    await Comment.findOneAndUpdate(
      {_id: commentId},
      {$set: {message: req.body.message}},
    );
    
    const newToken = generateToken(req.user_id, req.username);
    res.status(200).json({ message: "Comment updated", token: newToken });
  } else {
    console.error("Not your comment, can't edit")
    res.status(401).json({ message: "Not your comment can't edit" })
  }
} 

async function likeComment(req, res) {
  const commentId = req.params.comment_id
  const comment = await Comment.findOne({_id: commentId})
  const hasLiked = comment.beans.includes(req.username)
  
  if (hasLiked) {
    await Comment.findOneAndUpdate(
      {_id: commentId},
      {$pull: { beans: req.username }}
    )
  } else {
    await Comment.findOneAndUpdate(
      {_id: commentId},
      {$push: { beans: req.username }}
    )
  }

  const newToken = generateToken(req.user_id, req.username);
  res.status(200).json({ message: "Likes changed", token: newToken })
}

const CommentsController = {
  createComment: createComment,
  getAllCommentsForPost: getAllCommentsForPost,
  deleteComment: deleteComment,
  updateComment: updateComment,
  likeComment: likeComment,
};

module.exports = CommentsController;