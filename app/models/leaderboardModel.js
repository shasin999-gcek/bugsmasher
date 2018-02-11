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
      type: Number,
      required: true,
      default: 0
    },
    file_path: {
      type: String,
      unique: true,
      required: false,
      default: ''
    },
    is_accepted: {
      type: Boolean,
      required: true,
      default: false
    },
    compile_errors: {
      type: String,
      required: false,
      default: null
    },
    attempts: {
      type: Number,
      required: false,
      default: 0
    }
  }],
  start_time: {
    type: Number,
    required: true,
    default: 0
  },
  end_time: {
    type: Number,
    required: false
  }
});

module.exports = mongoose.model('Leaderboard', leaderboardModel);
