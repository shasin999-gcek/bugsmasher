const mongoose = require('mongoose');
const validate = require('mongoose-validator');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

let usernameValidator = [
  validate({
    validator: 'isLength',
    arguments: [3, 10],
    message: 'Username must between 3 and 10'
  }),
  validate({
    validator: 'isAlphanumeric',
    message: 'Username should contain alpha-numeric characters only'
  })
];

let passwordValidator = [
  validate({
    validator: 'isLength',
    arguments: [6, 50],
    message: 'Password must have at least 6 characters'
  })
]

const adminSchema = new Schema({
	username: {
		type: String,
		unique: true,
		trim: true,
		required: true,
		validate: usernameValidator
	},
	password: {
		type: String,
		required: true,
		validate: passwordValidator
	},
  maintainance_mode: {
    type: Boolean,
    default: false,
  },
  time_duration: {
    type: Number,      // unit minutes (30 === 30 mins competition)
    required: true,
    default: 30
  },
  is_complete: {
    type: Boolean,
    default: false
  },
	created_at: {
		type: Date,
		default: Date.now,
		required: true
	}
});

adminSchema.pre('save', function(next) {
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

adminSchema.methods.comparePassword = function(password, callback) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if(err) throw err;
    callback(null, isMatch);
  });
}

module.exports = mongoose.model('Admin', adminSchema);