const express = require("express");
const router = express.Router();

const FriendsController = require("../controllers/friends");

router.get("/", FriendsController.getFriendsForUser);
router.post("/request", FriendsController.sendFriendRequest);

module.exports = router;
