const mongoose = require("mongoose")
const env = require("dotenv")
env.config()
const { seedUsers, seedPosts } = require("./seed");
// mongodb://localhost:27017/microblog
const URI = process.env.DB_URI; 

(async () => {
    try {
      await mongoose.connect(URI);
      console.log("connected");
      seedUsers();
      seedPosts();
    } catch (error) {
      console.log("Couldn't Connect to server!");
      return "Server Error";
    }
  })();