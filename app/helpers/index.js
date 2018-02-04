exports.filterErrors = function(err) {
  var errors = [];
	if(err.name === "MongoError") {
		errors.push({
      path: err.errmsg.split(':')[2].split(' ')[1],
      message: err.errmsg.split(':')[4].split('}')[0].trim() + ' Already Exists'
    });
	} else {
		Object.keys(err.errors).forEach(key => {
			errors.push({
				path: err.errors[key].path,
				message: err.errors[key].message
			});
		});
  }
  
  return errors;
}