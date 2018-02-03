const fs = require('fs');
const path = require('path');
const Admin = require('app/models/adminModel');
const Teams = require('app/models/teamModel');
const Questions = require('app/models/questionModel');
const Leaderboard = require('app/models/leaderboardModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const shell = require('shelljs')


function setStartTime(teamName) {
  Leaderboard
    .findOneAndUpdate(
      {team_name: teamName}, 
      { $set: { start_time: Date.now() } },
      { new : true },
      function(err, updatedLb) {
        if(err) throw err;
        if(updatedLb) {
          console.log(`Time started for team ${teamName}`);
        }
      }
    )
}

exports.competition_finished = function(req, res) {
  Leaderboard.findOneAndUpdate(
    { team_name: req.team.teamName},
    { $set: { end_time: Date.now() }}, 
    { new: true },
    function(err, lb) {
      if(err) throw err;
      if(lb) {
        res.json(lb);
      } else {
        res.status(404).json({ message: 'Not Found'});
      }
    }
  );
}

function compileCode(filePath, lang, code) {
  fs.writeFileSync(filePath, code, {flag: 'w'});
  var shellCmd = (lang === 'c') ? `gcc ${filePath} -lm` : `g++ ${filePath} -lm`;
  console.log('command to be executed', shellCmd);
  var stderr = shell.exec(shellCmd).stderr;
  return (stderr != '') ? stderr : false;
}

// save to db if submission was successfull
exports.submit_code = function(req, res) {
  // parse all post parameters
  const { level, code, submissionTime } = req.body;
  
  Teams.findById(req.team.teamId)
       .select('language')
       .exec(function(err, team) {
          var findDoc = { team_name: req.team.teamName, 'levels.level': level };
          
          Leaderboard.findOne(findDoc).select('levels.$').exec(function(err, result) {
            if(err) throw err;
            
            if(result) {
              var compileErrors = compileCode(result.levels[0].file_path, team.language.toLowerCase(), code);
              var updateDoc = {
                $set: { 
                  'levels.$.last_submission_time': submissionTime,
                  'levels.$.is_accepted': (compileErrors) ? false : true,
                  'levels.$.compile_errors': (compileErrors) ? compileErrors : ''
                },
                $inc: {
                  'levels.$.attempts' : 1
                }
              }

              // update the database
              Leaderboard.findOneAndUpdate(findDoc, updateDoc, {new: true})
              .exec(function(err, lb) {
                var currentLevel = lb.levels.find((each) => each.level === level);
                (compileErrors) 
                  ? res.json({ compileErrors })
                  : res.json({ compileErrors: false });
              });  

            }
          });
       });
}



// fetch all questions
exports.get_questions = function(req, res) {
  Leaderboard.findOne({ team_name: req.team.teamName })
  .exec(function(err, lb) {
    if(err) res.status(500).json(err);
    if(lb) {
      lb.levels.sort((a, b) => a.level - b.level);
      var questions = lb.levels.map(level => {
        var contents = fs.readFileSync(level.file_path).toString();
        return { contents, info: level}
      });
      res.status(200).json({questions, startTime: lb.start_time});
    }
  });
}

exports.get_settings = function(req, res) {
  Admin
    .find({})
    .select('is_complete time_duration maintainance_mode')
    .exec(function(err, settings) {
      if(err) throw err;
      if(settings.length) {
        res.status(200).json(settings[0]);
      }
    });
}

function copyFilesToUploads(teamName, lang, destination) {
  Questions
    .find({ language: lang })
    .sort('levels')
    .exec(function(err, questions) {
      if(err) throw err;
      if(questions) {
        questions.map(q => {
          // unique file name with timestamp
          var destFilename = `${teamName}_${q.name}_${Date.now()}.${lang.toLowerCase()}`;
          var destPath = path.join(destination, destFilename);  
          
          // copy file from source to destination synchrounously     
          fs.copyFileSync(q.file_path, destPath);
        
          // save copied file names to leaderboard collections
          Leaderboard.findOneAndUpdate(
            { team_name: teamName, 'levels.level': q.level },
            {$set: {
              'levels.$.level': q.level,
              'levels.$.file_path': destPath
            }},
            function(err, lb) {
              if(err) throw err;

              // TODO: found so delete previous files
              if(lb) {
                console.log(lb);
              }

              // not found so push new object to levels
              if(!lb) {
                Leaderboard.findOne({ team_name: teamName }, function(err, newLb) {
                  newLb.levels.push({
                    level: q.level,
                    file_path: destPath
                  });
                  newLb.save(function(err) { 
                    if(err) throw err;
                    console.log(`${lang} questions copied to ${destPath} for ${teamName}`); 
                  });
                })
              }
            });

        });
      }
    });
}

exports.set_language = function(req, res) {
  var language = req.body.language;
  var destination = path.join(req.app.get('BASE_PATH'), '/storage/uploads');

  Teams.findByIdAndUpdate(
    req.team.teamId,
    { $set: { language, set_lang_once: true }}, 
    { new: true },
    function(err, team) {
      if(err) throw err; // TODO: sent formatted error messages
      if(team) {
        res.json({ message: 'ok' });
        copyFilesToUploads(team.team_name, language, destination);
        setStartTime(team.team_name);
      }
    });
}

exports.get_lang_info = function(req, res) {
  Teams.findById(req.team.teamId)
  .select('language set_lang_once')
  .exec(function(err, langInfo) {
    if(err) throw err;
    if(langInfo) {
      res.status(200).json(langInfo);
    } else {
      res.status(404).json({ message: 'Team not found'});
    }
  });
}

exports.register = function(req, res) {
  // craeting an instance of Team
  var team = new Teams(req.body);

  // store in database
  team.save(function(err, team) {
    if(err) {
      console.log(err);
      var errors = [];
      Object.keys(err.errors).forEach(key => {
        errors.push({
          path: err.errors[key].path,
          message: err.errors[key].message
        });
      });

      // internal server error (status code: 500)
      res.status(200).json({err, errors, message: err.name});
    } else if(team) {
      var lb = new Leaderboard({ team_name: team.team_name });
      lb.save(function(err, team) {
        if(err) throw err;
        res.status(200).json({statusText: "OK", message: 'Team created succesfully'});
      });
    }
  });
}

exports.login = function(req, res) {
  var teamName = req.body.team_name;
  var password = req.body.password;

  // search teamName in DB
  Teams.findOne({team_name: teamName}, function(err, team) {
    if(err) {
      res.json({status: 500, message: 'Internal Server Error'});
    }

    // check for team is there on database or not
    if(!team) {
      res.json({
        status: 404,
        message: `Authentication failed: ${teamName} is not found`
      });
    } else if(team) {
      // compare password with hash value
      team.comparePassword(password, function(err, isMatch) {
        if(!isMatch)
          res.json({
            status: 404,
            message: 'Authentication failed: Incorrect Password'
          });
        else {
          // else return json web token (header.payload.signature)
          res.json({
            status: 200,
            token: jwt.sign({
              teamName: team.team_name,
              teamId: team._id
            }, req.app.get('superSecret')),
            team_name: team.team_name
          });
        }
      });
    }
  });
}

exports.loginRequired = function (req, res, next) {
  if(req.team) {
    next();
  } else {
    res.status(401).json({message: 'Unathorised: Authentication is required'})
  }
}

