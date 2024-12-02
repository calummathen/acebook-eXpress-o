const express = require("express");
const tokenChecker = require("../middleware/tokenChecker")
const UsersController = require("../controllers/users");
const tokenChecker = require("../middleware/tokenChecker");


const router = express.Router();

router.post("/", UsersController.create);
router.get("/", tokenChecker, UsersController.getAllUsers);
router.get("/profile", tokenChecker, UsersController.getUserInfo);

module.exports = router;
