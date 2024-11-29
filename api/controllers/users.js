const Bcrypt = require("bcrypt");
const User = require("../models/user");
const { generateToken } = require("../lib/token");

function create(req, res) {
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

  if (!Object.keys(req.body).includes('birthday') || !req.body.birthday) {
    return res
      .status(400)
      .json({ message: "Missing birthday." });
  }
  if (!Object.keys(req.body).includes('name') || !req.body.name) {
    return res
      .status(400)
      .json({ message: "Name required." });
  }
  if (!Object.keys(req.body).includes('email') || !req.body.email) {
    return res
      .status(400)
      .json({ message: "Missing email." });
  }
  if (!Object.keys(req.body).includes('username') || !req.body.username) {
    return res
      .status(400)
      .json({ message: "Missing username." });
  }
  if (!Object.keys(req.body).includes('password') || !req.body.password) {
    return res
      .status(400)
      .json({ message: "Password required." });
  }
  // console.log(`Name: ${name}, Birthday: ${birthday}, Email: ${email}, Username: ${username}, Password: ${password}`)

  const user = new User({ name, birthday, email, username, password });
  user
    .save()
    .then((user) => {
      console.log("User created, id:", user._id.toString());
      res.status(201).json({ message: "OK" });
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

const UsersController = {
  create: create,
  getAllUsers: getAllUsers,
};

module.exports = UsersController;
