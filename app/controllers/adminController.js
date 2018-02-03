const multer = require('multer');
const path = require('path');
const fs = require('fs');

// importing models
const Admin = require('app/models/adminModel');
const Teams = require('app/models/teamModel');
const Questions = require('app/models/questionModel');
const Leaderboard = require('app/models/leaderboardModel');

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
  }
})

var fileFilter = function (req, file, cb) {
  // accept c/c++ file only
  if (!file.originalname.match(/\.(c|cpp)$/)) {
    return cb(null, false);
  }

  cb(null, true);
};

var upload = multer({ storage: storage, fileFilter: fileFilter }).single('program_file');


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
	if(req.session && req.session.auth && req.session.auth.userId) {
		res.redirect('/admin/dashboard');
	} else {
		var navitems = [{ name: "View App", link: '#'}];
		res.render('pages/login', { title: 'Login', navitems});
	}
}

exports.admin_dashboard = function(req, res) {
	res.locals.navitems = [
		{ name: "Leaderboard", link: '/admin/leaderboard' },
		{ name: "Add Questions", link: '/admin/add-questions' },
		{ name: "Settings", link: '/admin/settings' },
		{ name: "Logout", link: '/admin/logout' }
	];
	res.locals.title = 'Dashboard';
	Teams.find({}, function(err, teams) {
		if(err) throw err;
    res.locals.teams = teams;
		res.render('pages/dashboard');
	})
}

exports.add_questions_page = function(req, res) {
	
	// fetch all questions
	Questions.find({}, function(err, result) {
		if(err) {
			
		} else if(result) {
			res.locals.questions = result;
			res.locals.title = 'Questions';
			res.locals.navitems = [
				{ name: "Leaderboard", link: '/admin/leaderboard' },
				{ name: "Add Questions", link: '/admin/add-questions' },
				{ name: "Settings", link: '/admin/settings' },
				{ name: "Logout", link: '/admin/logout' }
			];
			res.render('pages/add_questions');
		}
	});
	
}

exports.leaderboard_page = function(req, res) {
  Leaderboard.find({}).select('team_name levels start_time end_time').exec(function(err, results) {
    if(err) throw err;
    res.locals.navitems = [
      { name: "Leaderboard", link: '/admin/leaderboard' },
      { name: "Add Questions", link: '/admin/add-questions' },
      { name: "Settings", link: '/admin/settings' },
      { name: "Logout", link: '/admin/logout' }
		];

		var leaderboard = results.map(function(result) {
			var completedLevels = result.levels.reduce(function(levels, eachLevel) {
				if(eachLevel.is_accepted) {
					var newLevels = levels.slice()  // mutation ruduce must be pure func
					newLevels.push(eachLevel.level);
					return newLevels;
				}
				return levels.slice();
			}, []);
			return { completedLevels, result };
		});
		
    res.locals.title = 'Leaderboard';
    res.locals.leaderboard = leaderboard;
    res.render('pages/leaderboard');
  });
}

exports.show_result = function(req, res) {
  var teamName = req.params.teamName;
  Leaderboard.findOne({ team_name: teamName }).select('team_name levels').exec(function(err, result) {
    if(err) throw err;
    if(result) {
      res.locals.navitems = [
        { name: "Leaderboard", link: '/admin/leaderboard' },
        { name: "Add Questions", link: '/admin/add-questions' },
        { name: "Settings", link: '/admin/settings' },
        { name: "Logout", link: '/admin/logout' }
      ];
      res.locals.title = `${teamName} result`;
      res.locals.result = result;
      res.render('pages/result');
    } else {
      res.status(404).send("Not found")
    }
    
  }); 
}

exports.download_program = function(req, res) {
  var teamName = req.params.teamName;
  var level = req.params.level;
  Leaderboard.findOne({ team_name: teamName, 'levels.level': level})
    .select('levels.$.file_path')
    .exec(function(err, level) {
      res.download(level.levels[0].file_path, path.basename(level.levels[0].file_path));
    });
}

exports.add_questions = function(req, res) {

	upload(req, res, function (err) {
    if (err) {
      // An error occurred when uploading
      req.flash('error_msg', 'Upload Failed');
      res.redirect('/admin/add-questions');
    }

    if (req && !req.file) {
    	req.flash('error_msg', 'Only C/C++ files are allowed');
      res.redirect('/admin/add-questions');
    } else {
    	// req.file contains uploaded file details
			var lang = req.file.filename.split('.')[1].toUpperCase();

			Questions.isValid(req.body.level, lang, function(err, isValid) {
				if(err) throw err;

				if(!isValid) {
					// delete uploaded file
					fs.unlink(req.file.path, function(err) {
						if (err) res.status(500).json({ message: 'File cannot be deleted'})
						req.flash('error_msg',
						 `Level ${req.body.level} with ${lang} program already exists`);
						res.redirect('/admin/add-questions');			
					});

				} else {

					// file and question is valid, save to db
					var question = new Questions({
						level: req.body.level,
						name: req.body.program_name,
						language: lang,
						file_name: req.file.filename,
						file_path: req.file.path
					});

					question.save(function(err, question) {
						if (err) {
							req.flash('errors', filterErrors(err));
							res.redirect('/admin/add-questions');
						}	else if (question) {
							req.flash('success_msg', 'File Uplaoded Successfully');
							res.redirect('/admin/add-questions');			
						}
					});
				}
			});
    }
  });

}

exports.settings_page = function(req, res) {
	Admin.findById(req.session.auth.userId,function(err, admin) {
		if(err) {
			req.flash('error_msg', 'Somethig went wrong');
			res.render('pages/settings_page');
		} else if(admin) {
			res.locals.maintainance_mode = admin.maintainance_mode;
			res.locals.is_complete = admin.is_complete;
			res.locals.time_duration = admin.time_duration;
			res.locals.title = 'Settings';
			res.locals.navitems = [
				{ name: "Leaderboard", link: '/admin/leaderboard' },
				{ name: "Add Questions", link: '/admin/add-questions' },
				{ name: "Settings", link: '/admin/settings' },
				{ name: "Logout", link: '/admin/logout' }
			];
			res.render('pages/settings_page');
		}
	});
} 

exports.settings = function(req, res) {
	
	var maintainance_mode = (req.body.maintainance_mode === 'on') ? true : false;
	var is_complete = (req.body.shutdown_site === 'on') ? true : false;

	if(req.body.time_duration && !isNaN(parseInt(req.body.time_duration))) {
		var time_duration = parseInt(req.body.time_duration);
		
		Admin.findByIdAndUpdate(req.session.auth.userId,
		 { $set: { maintainance_mode, is_complete, time_duration }}, 
		 { new: true },
		 function (err, admin) {
		  if (err) {
		  	req.flash('errors', filterErrors(err));
				res.redirect('/admin/add-questions');
		  } else if(admin) {
		  	req.flash('success_msg', 'Settings Updated');
				res.redirect('/admin/settings');
		  }
		});
	} else {
		req.flash('error_msg', 'Time duration must be a number (minutess)');
		res.redirect('/admin/settings');
	}
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


// authentication
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



