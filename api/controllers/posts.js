const Friend = require("../models/friend");
const Post = require("../models/post");
const { generateToken } = require("../lib/token");

async function getAllPosts(req, res) {
  
  const posts = await Post.find();
  posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const updatedPosts = posts.map((post) => {
    post._doc.isYours = (post.user == req.username)
    post._doc.hasLiked = (post.beans.includes(req.username))
    return post
  })

  const token = generateToken(req.user_id, req.username);
  res.status(200).json({ posts: updatedPosts, token: token });
}

async function getFriendsPosts(req, res) {
  
  const friends = await Friend.find({
    $or: [
      { sender: req.username, approved: true },
      { receiver: req.username, approved: true },
    ]
  });
  const usernames = friends.map((friend) => {
    if (
      friend.sender === req.username
    )
    {
      return friend.receiver
    }else{
      return friend.sender
    }
  }); 
    
  const friendPosts = await Post.find({ user: { $in: usernames } });

  friendPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const updatedPosts = friendPosts.map((post) => {
    post._doc.isYours = (post.user == req.username)
    post._doc.hasLiked = (post.beans.includes(req.username))
    return post
  })

  const token = generateToken(req.user_id, req.username);
  res.status(200).json({ posts: updatedPosts, token: token });
}

async function createPost(req, res) {
  req.body.user = req.username
  const post = new Post(req.body);

  await post.save();

  const newToken = generateToken(req.user_id, req.username);
  res.status(201).json({ message: "Post created", token: newToken });
}
async function getYourPosts(req, res) {
  const posts = await Post.find({user:req.username});
  posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const updatedPosts = posts.map((post) => {
    post._doc.isYours = (post.user == req.username)
    post._doc.hasLiked = (post.beans.includes(req.username))
    return post
  })

  const token = generateToken(req.user_id, req.username);
  res.status(200).json({ posts: updatedPosts, token: token });
}

async function getUserPosts(req, res) {
  const posts = await Post.find({user:req.params.username});
  posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const updatedPosts = posts.map((post) => {
    post._doc.isYours = (post.user == req.username)
    post._doc.hasLiked = (post.beans.includes(req.username))
    return post
  })

  const token = generateToken(req.user_id, req.username);
  res.status(200).json({ posts: updatedPosts, token: token });
}

async function deletePostId(req, res) {
  const postId = req.params.post_id
  if (req.body.isYours){
    await Post.findByIdAndDelete(postId);
    const newToken = generateToken(req.user_id, req.username);
    res.status(200).json({ message: "Post deleted", token: newToken });
  } else {
    console.error("Not your post can't delete")
    res.status(401).json({ message: "Not your post can't delete" })
  }
}


async function updatePost(req, res) {
  const postId = req.params.post_id
  if (req.body.isYours) {
    await Post.findOneAndUpdate(
      {_id: postId},
      {$set: {message: req.body.message}},
    );
    
    const newToken = generateToken(req.user_id, req.username);
    res.status(200).json({ message: "Post updated", token: newToken });
  } else {
    console.error("Not your post, can't edit")
    res.status(401).json({ message: "Not your post can't edit" })
  }
} 

async function likePost(req, res) {
  const postId = req.params.post_id
  const post = await Post.findOne({_id: postId})
  const hasLiked = post.beans.includes(req.username)
  
  if (hasLiked) {
    await Post.findOneAndUpdate(
      {_id: postId},
      {$pull: { beans: req.username }}
    )
  } else {
    await Post.findOneAndUpdate(
      {_id: postId},
      {$push: { beans: req.username }}
    )
  }

  const newToken = generateToken(req.user_id, req.username);
  res.status(200).json({ message: "Likes changed", token: newToken })
}

const PostsController = {
  getAllPosts: getAllPosts,
  getFriendsPosts:getFriendsPosts,
  createPost: createPost,
  deletePostId: deletePostId,
  updatePost: updatePost,
  getUserPosts: getUserPosts,
  getYourPosts: getYourPosts,
  likePost: likePost,
};

module.exports = PostsController;
