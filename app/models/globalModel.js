var mongoose = require('mongoose');

// to store global information about competitions;

var globalSchema = new mongoose.Schema({
	maintainace_mode: {
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
	admin_created: {
		type: Boolean,
		default: false,
		required: true
	}
});

module.exports = mongoose.model('Globals', globalSchema);