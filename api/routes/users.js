const express = require("express");
const tokenChecker = require("../middleware/tokenChecker")
const UsersController = require("../controllers/users");

const router = express.Router();

router.post("/", UsersController.create);
router.get("/", tokenChecker, UsersController.getAllUsers);
router.get("/profile", tokenChecker, UsersController.getUserInfo);
router.put("/profile", tokenChecker, UsersController.updateUserInfo);

module.exports = router;
