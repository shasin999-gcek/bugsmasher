var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');

var teamHandlers = require('app/controllers/teamController');

/* POST apis listing. */
router.post('/register', teamHandlers.register);
router.post('/login', teamHandlers.signIn);

/* GET apis listing. */
router.get('/', teamHandlers.loginRequired, (req, res) => res.send(req.team));

router.get('/check/:env', (req, res) => {
	res.send(req.app.get(req.params.env));
})

module.exports = router;
