const Friend = require("../models/friend");
const { generateToken } = require("../lib/token");

async function getFriendsForUser(req, res) {
  const friends = await Friend.find({
    $or: [
      { sender: req.username, approved: true },
      { receiver: req.username, approved: true },
    ]
  });  
  friends.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const updatedFriends = friends.map((friend) => {
    const friendObject = friend.toObject(); 
    friendObject.user = req.username; 
    return friendObject;
  });

  const token = generateToken(req.user_id, req.username);
  res.status(200).json({ friends: updatedFriends, token: token });
// console.log(req.username)
}

async function sendFriendRequest(req, res) {
  req.body.sender = req.username
  const friend = new Friend(req.body)

  await friend.save()

  const newToken = generateToken(req.user_id, req.username);
  res.status(201).json({ message: "Friend request sent", token: newToken });
}

const FriendsController = {
  getFriendsForUser: getFriendsForUser,
  sendFriendRequest: sendFriendRequest
};

module.exports = FriendsController;