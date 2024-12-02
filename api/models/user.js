const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, lowercase: true, unique: true},
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, unique: true},
  password: { type: String, required: true },
  birthday: {type: Date,required: true},
    // validate: {
    //   validator: function(value) {

    //     // Get today's date
    //     const today = new Date();

    //     // Calculate the date 18 years ago
    //     const eighteenYearsAgo = new Date(
    //       today.getFullYear() - 18,
    //       today.getMonth(),
    //       today.getDate()
    //     );

    //     // Check if the birthDate is on or before the date 18 years ago
    //     return value <= eighteenYearsAgo;
    //   },
    //   message: 'You must be at least 18 years old.',
    // },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
