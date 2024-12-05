const express = require("express");
const tokenChecker = require("../middleware/tokenChecker");
const UsersController = require("../controllers/users");

const upload = require("../middleware/uploafMiddleware");

const router = express.Router();

router.post("/", upload, UsersController.create);
router.get("/", tokenChecker, UsersController.getAllUsers);
router.get("/profile", tokenChecker, UsersController.getUserInfo);
router.get("/:username", tokenChecker, UsersController.getUserByUsername);
router.get(
  "/profile/:username",
  tokenChecker,
  UsersController.getAnotherUserInfo
);
router.put("/profile", tokenChecker, UsersController.updateUserInfo);

module.exports = router;
