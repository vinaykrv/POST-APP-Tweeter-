const mongoose = require("mongoose");

const tweetSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    required: true
  }
});


const Tweet = mongoose.model("chat",tweetSchema);

module.exports = Tweet;
