const Bcrypt = require("bcrypt");
const User = require("../models/user");
const { generateToken } = require("../lib/token");
const path = require("path");

async function create(req, res) {
  if (Object.keys(req.body).length !== 5) {
    return res
      .status(400)
      .json({ message: "Invalid body, expected 5 inputs." });
  }

  const name = req.body.name;
  const birthday = req.body.birthday;
  const email = req.body.email;
  const username = req.body.username;
  const password = Bcrypt.hashSync(req.body.password, 10);

  let profileImage = null;
  if (req.file) {
    profileImage = path.join("images", req.file.filename);
  }

  // console.log(profileImage);

  const user = new User({
    name,
    birthday,
    email,
    username,
    password,
    profileImage,
  });
  await user
    .save()
    .then((user) => {
      console.log("User created, id:", user._id.toString());
      res.status(201).json({
        message: "OK",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
          profileImage: user.profileImage,
        },
      });
    })
    .catch((err) => {
      console.error(err);
      const errorType = Object.keys(err.keyValue);
      res.status(400).json({ message: errorType[0] });
    });
}

async function getAllUsers(req, res) {
  const users = await User.find();
  const token = generateToken(req.user_id, req.username);
  res.status(200).json({ users: users, token: token });
}

async function getUserInfo(req, res) {
  try {
    const user = await User.findById(req.user_id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // User's information
    res.status(200).json({
      UserInfo: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        profileImage: user.profileImage,
        birthday: user.birthday,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred fetching user info." });
  }
}

async function getAnotherUserInfo(req, res) {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // User's information
    res.status(200).json({
      UserInfo: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        birthday: user.birthday,
        profileImage: user.profileImage,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred fetching user info." });
  }
}

async function updateUserInfo(req, res) {
  if (req.body.password == undefined) {
    delete req.body.password;
  } else {
    req.body.password = Bcrypt.hashSync(req.body.password, 10);
  }

  await User.findOneAndUpdate({ _id: req.user_id }, { $set: req.body });

  res.status(200).json({ message: "User info updated" });
}

async function getUserByUsername(req, res) {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({
      username: user.username,
      birthday: user.birthday,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred fetching user info." });
  }
}

const UsersController = {
  create: create,
  getAllUsers: getAllUsers,
  getUserInfo: getUserInfo,
  getAnotherUserInfo: getAnotherUserInfo,
  updateUserInfo: updateUserInfo,
  getUserByUsername: getUserByUsername,
};

module.exports = UsersController;
