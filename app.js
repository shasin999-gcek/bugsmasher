var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var jsonwebtoken = require('jsonwebtoken');
var session = require('express-session');
var flash = require('connect-flash');

var admin = require('routes/admin');
var apis = require('routes/apis');
var config = require('config/default');

/* loading environment variables defined 
 * in .env file at root of the application
 */

require('dotenv').load();

// connect to mongodb database
mongoose.connect(config.mongodbConnString, function(err) {
    if (err) throw err;
    console.log('Successfully connected to MongoDB');
});


// init application
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// set app globals
app.set('superSecret', config.secret);
app.set('BASE_PATH', __dirname);

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// to use apis
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// jsonwebtoken middleware for authorisation of client-app
app.use(function(req, res, next) {
  // check for the Authorization headers
  if(req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    var secret = app.get('superSecret');
    jsonwebtoken.verify(req.headers.authorization.split(' ')[1], secret, function(err, decode) {
      if(err) req.team = undefined;
      else req.team = decode; // attach on req object
      next();
    });

  } else {
    req.team = undefined;
    next();
  }
});

// configurinng express sessions for admin 
app.use(session({
	secret: 'thisissomerandomtext',
	cookie: { maxAge: 1000 * 60 * 60 * 24 },  // last for a day
	saveUninitialized: true,
  resave: 'true',
}));

// fash messages
app.use(flash());

app.use(function(req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.errors = req.flash('errors');
	next();
});

// defining routes
app.use('/admin', admin);
app.use('/api', apis);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
