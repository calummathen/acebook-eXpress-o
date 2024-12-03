const mongoose = require("mongoose");

// A Schema defines the "shape" of entries in a collection. This is similar to
// defining the columns of an SQL Database.
const CommentSchema = new mongoose.Schema({
  user: { type: String, required: true },
  post_id: {type: String, required: true},
  message: { type: String, required: true },
  beans: [ String ],
  timestamp: { type: Date, default: Date.now, required: true },
});

// We use the Schema to create the Post model. Models are classes which we can
// use to construct entries in our Database.
const Post = mongoose.model("Comment", CommentSchema);

module.exports = Post;
