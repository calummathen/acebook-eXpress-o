const express = require("express");
const router = express.Router();

const FriendsController = require("../controllers/friends");

router.get("/", FriendsController.getFriendsForUser);
router.get("/requests", FriendsController.getUnapprovedFriendsForUser);
router.get("/:username", FriendsController.getFriendsForAnotherUser);
router.post("/request", FriendsController.sendFriendRequest);
router.get("/:username", FriendsController.getFriendsForAnotherUser);

module.exports = router;
