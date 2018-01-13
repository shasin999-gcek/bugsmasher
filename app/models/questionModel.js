const mongoose = require('mongoose');
const { Schema } = mongoose;
const validate = require('mongoose-validator');

const questionSchema = new Schema({
  level: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
		validate: [
			validate({
				validator: 'isAlphanumeric',
				message: 'Name must only contain letters'
			})
		]
  },
	language: {
		type: String,
    enum: ['C', 'CPP'],
		required: true
	},
	file_name: {
    type: String,
    required: true,
    unique: true
  },
  file_path: {
    type: String,
    required: true,
    unique: true
  }
});



module.exports = mongoose.model('Questions', questionSchema);
