const mongoose = require('mongoose');
const { Schema } = mongoose;
const validate = require('mongoose-validator');
const bcrypt = require('bcrypt');

let teamNameValidator = [
  validate({
    validator: 'isLength',
    arguments: [3, 10],
    message: 'Team Name must between 3 and 10'
  }),
  validate({
    validator: 'isAlphanumeric',
    passIfEmpty: true,
    message: 'Team Name should contain alpha-numeric characters only'
  })
];

let passwordValidator = [
  validate({
    validator: 'isLength',
    arguments: [6, 50],
    message: 'Password must have at least 6 characters'
  })
]

const concat = (val) => val.concat(" is required");

const teamSchema = new Schema({
  no_of_players: {
    type: Number,
    min: 1,
    max: 2,
    required: [true, concat('{PATH}')]
  },
  player_one_name: {
    type: String,
    required: [true, concat('{PATH}')],
    trim: true
  },
  player_two_name: {
    type: String,
    trim: true,
    required: [function() {
      return this.no_of_players === 2
    }, concat('{PATH}')]
  },
	mobile_number: {
		type: Number,
		required: [true, concat('{PATH}')],
		trim: true,
		unique: true
	},
  team_name: {
    type: String,
    required: [true, concat('team_name')],
    trim: true,
    unique: true,
    validate: teamNameValidator
  },
  password: {
    type: String,
    required: [true, concat('password')],
    validate: passwordValidator
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: true
  }
});

teamSchema.pre('save', function(next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt value
  bcrypt.genSalt(10, function(err, salt) {
    if(err) return next(err);
    // hash password using generated salt
    bcrypt.hash(user.password, salt, function(err, hash) {
        if(err) return next(err);
        // override cleartest password with its hash value
        user.password = hash
        next();
    });
  });

});

teamSchema.methods.comparePassword = function(password, callback) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if(err) throw err;
    callback(null, isMatch);
  });
}

module.exports = mongoose.model('Teams', teamSchema);
