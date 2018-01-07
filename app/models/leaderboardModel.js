const mongoose = require('mongoose');
const { Schema } = mongoose;

const leaderboardModel = new Schema({
  team_name: {
    type: String,
    unique: true,
    required: true
  },
  completed_levels: [{
    level: {
      type: Number,
      required: false
    },
    last_submission_time: {
      type: Date,
      required: false
    },
    file_name: {
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
    required: true
  },
  end_time: {
    type: Date,
    required: false
  },
  language: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Leaderboard', leaderboardModel);
