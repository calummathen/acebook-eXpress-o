const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, lowercase: true, unique: true},
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, unique: true},
  password: { type: String, required: true },
  birthday: {type: Date,required: true}
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
