const Teams = require('app/models/teamModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = function(req, res) {
  // craeting an instance of Team
  var team = new Teams(req.body);

  // store in database
  team.save(function(err, team) {
    if(err) {
    
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
      res.status(200).json({statusText: "OK", message: 'Team created succesfully'});
    }
  });
}

exports.signIn = function(req, res) {
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
        status: 200,
        message: `Authentication failed: ${teamName} is not found`
      });
    } else if(team) {
      // compare password with hash value
      team.comparePassword(password, function(err, isMatch) {
        if(!isMatch)
          res.json({
            status: 200,
            message: 'Authentication failed: Incorrect Password'
          });
        else {
          // else return json web token (header.payload.signature)
          res.json({
            token: jwt.sign({
              teamName: team.team_name,
              teamId: team._id
            }, req.app.get('superSecret'))
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
    res.json({status: 200, message: 'Unathorised: Authentication is required'})
  }
}
