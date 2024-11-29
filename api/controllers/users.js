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
        birthday: user.birthday,
        location: user.location,
        work_place: user.work_place,
        telephone_number: user.telephone_number,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred fetching user info." });
  }
}

const UsersController = {
  create: create,
  getAllUsers: getAllUsers,
  getUserInfo: getUserInfo
};

module.exports = UsersController;
