const multer = require('multer');
const path = require('path');
const fs = require('fs');

// importing models
const Admin = require('app/models/adminModel');
const Globals = require('app/models/globalModel');
const Questions = require('app/models/questionModel');

const { filterErrors } = require('app/helpers');

// setup multer (handling multipart/form-data)
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
		cb(null, path.join(req.app.get('BASE_PATH'), '/storage/questions'));
	},
  filename: function (req, file, cb) {
		var name = req.body.program_name + '-' + Date.now();
		var extension = file.originalname.split('.')[1]
		var filename = [name, extension].join('.')
    cb(null, filename);
  },
	language: function(req,file, cb) {
		cb(null, file.originalname.split('.')[1].toUpperCase())
	}
})

exports.upload = multer({ storage: storage });


exports.auth_middleware = function(req, res, next) {
	if(req.session && req.session.auth && req.session.auth.userId) {
		next();
	} else {
		res.redirect('/admin/login');	
	}
}

exports.check_admin_already_created = function(req, res, next) {
	Admin.count({}, function(err, count) {
		if(err) {
			res.status(500).send(`<h1>Internal Server Error</h1><br /><p>${err}</p>`);
		}
		
		if (count === 1) {
			res.redirect('/admin/login');
		} else if (!count) {
			next();
		}

	});
}

// Page render functions
exports.init_setup = function(req, res) {
	var navitems = [{ name: "View App", link: '#'}];
	res.render('pages/initsetup', { title: 'Setup ', navitems });
}

exports.login_page = function(req, res) {
	var navitems = [{ name: "View App", link: '#'}];
	res.render('pages/login', { title: 'Login', navitems});
}

exports.admin_dashboard = function(req, res) {
	var navitems = [{ name: "Add Questions", link: '/admin/add-questions/#'}];
	res.render('pages/dashboard', { title: 'Dashboard', navitems});
}

exports.add_questions_page = function(req, res) {
	
	// fetch all questions
	Questions.find({}, function(err, result) {
		if(err) {
			
		} else if(result) {
			res.locals.questions = result;
			res.locals.title = 'Questions';
			res.locals.navitems = [{ name: "Home", link: '/admin/dashboard'}];
			res.render('pages/add_questions');
		}
	});
	
}

exports.add_questions = function(req, res) {

	// req.file contains uploaded file details
	var lang = req.file.filename.split('.')[1].toUpperCase();

	var question = new Questions({
		level: req.body.level,
		name: req.body.program_name,
		language: lang,
		file_name: req.file.filename,
		file_path: req.file.path
	});
	
	question.save(function(err, question) {
		if (err) {
			console.log(err);
			req.flash('errors', filterErrors(err));
			res.redirect('/admin/add-questions');
		}	else if (question) {
			req.flash('success_msg', 'File Uplaoded Successfully');
			res.redirect('/admin/add-questions');			
		}
	});
	
}

// APIS

exports.delete_question = function(req, res) {
	var objectId = req.body.object_id;

	Questions.findOneAndRemove({_id: objectId}, function(err, question) {
		if (err) {
			res.status(404).json({ message: 'No question found' });
		} else if (question) {
			fs.unlink(question.file_path, function(err) {
				if (err) res.status(500).json({ message: 'File cannot be deleted'})
				res.json({ message: `${question.file_name} Successfully deleted`});
			});
		}
	});
}

exports.view_question = function(req, res) {
	var objectId = req.body.object_id;
	
	Questions.findById(objectId, function(err, question) {
		if (err) {
			res.status(404).json({ message: 'No question found' });
		} else if (question) {
			fs.readFile(question.file_path, (err, data) => {
				if (err) throw err;
				
				res.status(200).json({ contents: data.toString() });
			});
		}
	});
	
}

exports.create_admin = function(req, res) {
	const { username, password } = req.body;
	
	// create new admin instance
	var admin = new Admin({ username, password });
	
	admin.save(function(err, result) {
		if(err) {
			// send error messages
			res.status(500).json({ err });
		} else if(result) {
			res.redirect('/admin/login');
		}
	});
	
}

exports.login = function(req, res) {
	const { username, password } = req.body;
	
	Admin.findOne({ username: username }, function(err, result) {
		if(err) {
			res.status(500).send({err});
		}
		
		if(result) {
			result.comparePassword(password, function(err, isMatch) {
				if(!isMatch) {
					res.status(401).send('Password Incorrect');
				} else {
					// passsword is match set session
					req.session.auth = { userId: result._id };
					res.redirect('/admin/dashboard');
				}
			});	
		} else {
			res.status(401).send('Username not found');
		}
		
	});
}

exports.logout = function(req, res) {
	delete req.session.auth;
	res.redirect('/admin/login');
}



