const express = require("express");
const router = express.Router();

const FriendsController = require("../controllers/friends");

router.get("/", FriendsController.getFriendsForUser);
router.get("/requests", FriendsController.getUnapprovedFriendsForUser);
router.get("/:username", FriendsController.getFriendsForAnotherUser);
router.get("/:username/requests", FriendsController.getUnapprovedFriendsForAnotherUser)
router.post("/request", FriendsController.sendFriendRequest);
router.delete("/:request_id", FriendsController.deleteFriend);
router.patch("/:friendRequestId", FriendsController.approveFriendRequest);

module.exports = router;
