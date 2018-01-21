const mongoose = require('mongoose');
const { Schema } = mongoose;

const leaderboardModel = new Schema({
  team_name: {
    type: String,
    unique: true,
    required: true
  },
  levels: [{
    level: {
      type: Number,
      required: false
    },
    last_submission_time: {
      type: Date,
      required: false
    },
    file_path: {
      type: String,
      unique: true,
      required: false
    },
    attempts: {
      type: Number,
      required: false,
      default: 0
    }
  }],
  start_time: {
    type: Date,
    required: false
  },
  end_time: {
    type: Date,
    required: false
  }
});

module.exports = mongoose.model('Leaderboard', leaderboardModel);
