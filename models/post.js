const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    postContent: String,
    imageUrl : String,
    likes: [String],
  },
  { timestamps: true }
);

const Post = mongoose.model("posts", postsSchema);

module.exports = Post;
