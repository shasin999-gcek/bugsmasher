exports.filterErrors = function(err) {
	var errors = [];
	Object.keys(err.errors).forEach(key => {
		errors.push({
			path: err.errors[key].path,
			message: err.errors[key].message
		});
	});
	return errors;
}