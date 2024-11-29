const express = require("express");
const router = express.Router();

const FriendsController = require("../controllers/friends");

router.get("/", FriendsController.getFriendsForUser);
router.get("/:username", FriendsController.getFriendsForAnotherUser);

module.exports = router;
