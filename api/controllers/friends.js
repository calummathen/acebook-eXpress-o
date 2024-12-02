const Friend = require("../models/friend");
const { generateToken } = require("../lib/token");

async function getFriendsForUser(req, res) {
  const friends = await Friend.find({
    $or: [
      { sender: req.username, approved: true },
      { receiver: req.username, approved: true },
    ]
  });  
  if (friends.length === 0) {
    return res.status(200).json({
      friends: [{
        sender: "",
        receiver: "",
        user: req.username, 
        timestamp: ""
      }],
      token: generateToken(req.user_id, req.username),
    });
  }
  friends.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const updatedFriends = friends.map((friend) => {
    const friendObject = friend.toObject(); 
    friendObject.user = req.username; 
    return friendObject;
  });
  
  const token = generateToken(req.user_id, req.username);
  res.status(200).json({ friends: updatedFriends, token: token });
}

async function approveFriendRequest(req, res) {
  const friendRequest = await Friend.findOneAndUpdate(
    {_id: req.body.request_id},
    {$set: {approved: true, timestamp: new Date()},
  });

  if (!friendRequest) {
    return res.status(404).json({ message: "Friend request not found" });
  }

const token = generateToken(req.user_id, req.username);
res.status(200).json({ friendRequest: friendRequest, token: token });
}

async function getUnapprovedFriendsForUser(req, res) {
  const friends = await Friend.find({
    receiver: req.username,
    approved: false
  });
  const updatedFriends = friends.map((friend) => {
    const friendObject = friend.toObject(); 
    friendObject.user = req.username; 
    return friendObject;
  });
  
  const token = generateToken(req.user_id, req.username);
  res.status(200).json({ friends: updatedFriends, token: token });
}

async function getFriendsForAnotherUser(req, res) {
  const friends = await Friend.find({
    $or: [
      { sender: req.params.username, approved: true },
      { receiver: req.params.username, approved: true },
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
}

async function getUnapprovedFriendsForAnotherUser(req, res) {
  const friends = await Friend.find({
    receiver: req.params.username,
    approved: false
  });
  const updatedFriends = friends.map((friend) => {
    const friendObject = friend.toObject(); 
    friendObject.user = req.username; 
    return friendObject;
  });
  
  const token = generateToken(req.user_id, req.username);
  res.status(200).json({ friends: updatedFriends, token: token });
}

async function sendFriendRequest(req, res) {

  const existingFriends = await Friend.find({
    $or: [
      { sender: req.username, receiver: req.body.receiver },
      { sender: req.body.receiver, receiver: req.username },
    ]
  }); 

  console.log(existingFriends)
  
  if (existingFriends.length == 0) {
    req.body.sender = req.username
    const friend = new Friend(req.body)

    await friend.save()

    const newToken = generateToken(req.user_id, req.username);
    res.status(201).json({ message: "Friend request sent", token: newToken });
  } else {
    res.status(200).json({ message: "Friend already exists"})
  }
}

async function deleteFriend(req, res) {
  const requestId = req.params.request_id
  await Friend.findByIdAndDelete(requestId)

  const newToken = generateToken(req.user_id, req.username);
  res.status(200).json({ message: "Friendship deleted", token: newToken });
}

async function deleteFriend(req, res) {
  const requestId = req.params.request_id
  await Friend.findByIdAndDelete(requestId)

  const newToken = generateToken(req.user_id, req.username);
  res.status(200).json({ message: "Friendship deleted", token: newToken });
}

const FriendsController = {
  getFriendsForUser: getFriendsForUser,
  getFriendsForAnotherUser: getFriendsForAnotherUser,
  sendFriendRequest: sendFriendRequest, 
  getUnapprovedFriendsForUser: getUnapprovedFriendsForUser,
  getUnapprovedFriendsForAnotherUser: getUnapprovedFriendsForAnotherUser,
  deleteFriend: deleteFriend,
  approveFriendRequest: approveFriendRequest,
};

module.exports = FriendsController;
