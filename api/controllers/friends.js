const Friend = require("../models/friend");
const { generateToken } = require("../lib/token");

async function getFriendsForUser(req, res) {
  const friends = await Friend.find({
    $or: [
      { sender: req.username, approved: true },
      { receiver: req.username, approved: true },
    ]
  });  
  // friends.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const token = generateToken(req.user_id, req.username);
  res.status(200).json({ friends: friends, token: token });
// console.log(req.username)
}

const FriendsController = {
  getFriendsForUser: getFriendsForUser,
};

module.exports = FriendsController;